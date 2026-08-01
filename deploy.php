<?php

declare(strict_types=1);

namespace Deployer;

// ─── Credentials (deploy.local.php is gitignored) ────────────────────────────
if (! file_exists(__DIR__.'/deploy.local.php')) {
    fwrite(STDERR, "\033[0;31m✗\033[0m  deploy.local.php not found.\n");
    fwrite(STDERR, "   cp deploy.local.php.example deploy.local.php  # fill in values\n");
    exit(1);
}
require __DIR__.'/deploy.local.php';

// ─── Host (used only for `dep ssh` built-in routing) ─────────────────────────
host('production')
    ->set('hostname', DEP_HOST)
    ->set('port', DEP_PORT)
    ->set('remote_user', DEP_USER)
    ->set('deploy_path', DEP_PROJECT_PATH)
    ->set('ssh_multiplexing', false)
    ->set('ssh_extra_args', '-o StrictHostKeyChecking=no -o ConnectTimeout=10');

// ─── SSH / transfer helpers (mirrors backend/deploy.php) ─────────────────────

function sshBin(): string
{
    $opts = '-o StrictHostKeyChecking=no -o ConnectTimeout=10 -p '.DEP_PORT;
    if (DEP_SSH_KEY) {
        return 'ssh -i '.escapeshellarg(DEP_SSH_KEY)." $opts";
    }

    return 'sshpass -p '.escapeshellarg(DEP_PASSWORD)." ssh $opts";
}

/** Run command on remote as DEP_USER */
function runAs(string $cmd, array $opts = []): string
{
    return runLocally(
        sshBin().' '.DEP_USER.'@'.DEP_HOST.' '.escapeshellarg($cmd),
        array_merge(['timeout' => 300], $opts)
    );
}

function sshBinRoot(): string
{
    return 'sshpass -p '.escapeshellarg(DEP_PASSWORD_ROOT)
        .' ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 -p '.DEP_PORT;
}

/** Run privileged command on remote via sudo (DEP_USER_ROOT) */
function runPriv(string $cmd, array $opts = []): string
{
    $remoteCmd = 'echo '.escapeshellarg(DEP_PASSWORD_ROOT).' | sudo -S -p \'\' bash -c '.escapeshellarg($cmd);

    return runLocally(
        sshBinRoot().' '.DEP_USER_ROOT.'@'.DEP_HOST.' '.escapeshellarg($remoteCmd),
        array_merge(['timeout' => 120], $opts)
    );
}

/** rsync local → remote */
function rsyncTo(string $src, string $dst, array $exclude = [], bool $delete = false): void
{
    $flags = implode(' ', array_map(fn ($e) => '--exclude='.escapeshellarg($e), $exclude));
    if ($delete) {
        $flags .= ' --delete';
    }
    runLocally(
        'rsync -az --progress -e '.escapeshellarg(sshBin())." $flags --ignore-errors $src ".DEP_USER.'@'.DEP_HOST.":$dst",
        ['timeout' => 600]
    );
}

function scpTo(string $local, string $remote): void
{
    $opts = '-P '.DEP_PORT.' -o StrictHostKeyChecking=no';
    if (DEP_SSH_KEY) {
        runLocally('scp -i '.escapeshellarg(DEP_SSH_KEY)." $opts ".escapeshellarg($local).' '.DEP_USER.'@'.DEP_HOST.":$remote");
    } else {
        runLocally('sshpass -p '.escapeshellarg(DEP_PASSWORD)." scp $opts ".escapeshellarg($local).' '.DEP_USER.'@'.DEP_HOST.":$remote");
    }
}

// Не синхронизируем и не затираем на сервере (--delete их не тронет)
const SYNC_EXCLUDE = [
    '.git/', '.ddev/', '.env*', 'node_modules/', '/.next/',
    '/vendor/', '/dump/',
    '.idea/', '.vscode/', '.junie/', '.ai/', '.claude/',
    '.next/', 'next-env.d.ts', '*.tsbuildinfo',
    'CLAUDE.md', 'AGENTS.md', 'docs/',
    'deploy.local.php',
];

function systemdUnit(): string
{
    return <<<UNIT
[Unit]
Description=art-ua.info (Next.js)
After=network.target

[Service]
Type=simple
User=developer
WorkingDirectory=DEP_PROJECT_PATH_PLACEHOLDER
Environment=NODE_ENV=production
ExecStart=DEP_PROJECT_PATH_PLACEHOLDER/node_modules/.bin/next start -p DEP_APP_PORT_PLACEHOLDER -H 0.0.0.0
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
UNIT;
}

// ─── DEPLOY ───────────────────────────────────────────────────────────────────
task('deploy', function (): void {
    $path = DEP_PROJECT_PATH;

    writeln('<comment>▶ 1/5 Sync code</comment>');
    rsyncTo(__DIR__.'/', "$path/", SYNC_EXCLUDE, delete: true);

    writeln('<comment>▶ 2/5 .env</comment>');
    $hasEnv = trim(runAs("[ -f $path/.env ] && echo 1 || echo 0")) === '1';
    if ($hasEnv) {
        writeln('  .env already on server, skipping');
    } elseif (file_exists(__DIR__.'/.env.production')) {
        scpTo(__DIR__.'/.env.production', "$path/.env");
    } else {
        writeln('  <warning>No .env.production locally — server will run without it (checked into deploy_path already? verify manually)</warning>');
    }

    writeln('<comment>▶ 3/5 Install dependencies</comment>');
    runAs("cd $path && npm ci", ['timeout' => 300]);

    writeln('<comment>▶ 4/5 Build</comment>');
    runAs("cd $path && npm run build", ['timeout' => 300]);

    writeln('<comment>▶ 5/5 Restart app</comment>');
    invoke('restart:app');

    writeln('<info>✓  Deploy complete → https://'.DEP_SITE_DOMAIN.'</info>');
})->desc('Full deploy: sync code, install deps, build, restart systemd service');

task('deploy:quick', function (): void {
    $path = DEP_PROJECT_PATH;

    writeln('<comment>▶ 1/3 Sync code</comment>');
    rsyncTo(__DIR__.'/', "$path/", SYNC_EXCLUDE);

    writeln('<comment>▶ 2/3 Build</comment>');
    runAs("cd $path && npm run build", ['timeout' => 300]);

    writeln('<comment>▶ 3/3 Restart app</comment>');
    invoke('restart:app');

    writeln('<info>✓  Quick deploy done → https://'.DEP_SITE_DOMAIN.'</info>');
})->desc('Quick deploy: code sync + build + restart (reuses existing node_modules, no npm ci)');

// ─── SYSTEMD ──────────────────────────────────────────────────────────────────
// Разовая настройка: создаёт /etc/systemd/system/<service>.service, включает автозапуск.
// Требует root (DEP_USER_ROOT). Порт DEP_APP_PORT должен совпадать с nginx proxy_pass
// в конфиге домена (проверить: /etc/nginx/conf.d/domains/<domain>.conf).
task('systemd:install', function (): void {
    $unit = str_replace(
        ['DEP_PROJECT_PATH_PLACEHOLDER', 'DEP_APP_PORT_PLACEHOLDER'],
        [DEP_PROJECT_PATH, (string) DEP_APP_PORT],
        systemdUnit()
    );

    $tmp = tempnam(sys_get_temp_dir(), 'art-ua-info-unit-');
    file_put_contents($tmp, $unit);
    scpTo($tmp, '/tmp/'.DEP_SERVICE_NAME.'.service');
    unlink($tmp);

    runPriv('mv /tmp/'.DEP_SERVICE_NAME.'.service /etc/systemd/system/'.DEP_SERVICE_NAME.'.service');
    runPriv('systemctl daemon-reload');
    runPriv('systemctl enable '.DEP_SERVICE_NAME);

    writeln('<info>✓  systemd unit installed: '.DEP_SERVICE_NAME.'.service (not started yet — run `dep restart:app production`)</info>');
})->desc('One-time: install/update the systemd unit for the app (requires root)');

// ─── NGINX ────────────────────────────────────────────────────────────────────
// Разовая настройка: Hestia изначально прописала proxy_pass на 3001, но этот порт
// занят чужим процессом (см. DEPLOY.md). Переключает proxy_pass на DEP_APP_PORT
// в обоих файлах домена (http + ssl). Требует root.
task('nginx:repoint', function (): void {
    $confDir = '/etc/nginx/conf.d/domains';
    $files = [
        "$confDir/".DEP_SITE_DOMAIN.'.conf',
        "$confDir/".DEP_SITE_DOMAIN.'.ssl.conf',
    ];

    foreach ($files as $file) {
        runPriv("cp $file $file.bak-".date('Ymd-His'));
        runPriv("sed -i 's/proxy_pass http:\\/\\/127.0.0.1:[0-9]\\+;/proxy_pass http:\\/\\/127.0.0.1:".DEP_APP_PORT.";/' $file");
    }

    runPriv('nginx -t');
    runPriv('systemctl reload nginx');

    writeln('<info>✓  nginx now proxies '.DEP_SITE_DOMAIN.' → 127.0.0.1:'.DEP_APP_PORT.' (backups saved next to the conf files)</info>');
})->desc('One-time: repoint nginx proxy_pass to DEP_APP_PORT (requires root, reloads shared nginx)');

task('restart:app', function (): void {
    runPriv('systemctl restart '.DEP_SERVICE_NAME);
    writeln('<info>✓  '.DEP_SERVICE_NAME.' restarted</info>');
})->desc('Restart the Next.js systemd service');

task('logs:app', function (): void {
    passthru(sshBinRoot().' -t '.DEP_USER_ROOT.'@'.DEP_HOST
        .' '.escapeshellarg('echo '.escapeshellarg(DEP_PASSWORD_ROOT).' | sudo -S -p \'\' journalctl -u '.DEP_SERVICE_NAME.' -f -n 100'));
})->desc('Tail systemd journal for the app');

// ─── STATUS ───────────────────────────────────────────────────────────────────
task('status', function (): void {
    writeln("\n<comment>── Service status ──</comment>");
    writeln(runPriv('systemctl status '.DEP_SERVICE_NAME.' --no-pager -l || true'));

    writeln("\n<comment>── Last deploy ──</comment>");
    writeln(runAs('cd '.DEP_PROJECT_PATH." && cat .next/BUILD_ID 2>/dev/null || echo 'no build found'"));

    writeln("\n<comment>── Site check ──</comment>");
    $timing = trim((string) shell_exec("curl -w '%{time_starttransfer}/%{http_code}' -o /dev/null -s 'https://".DEP_SITE_DOMAIN."/' 2>/dev/null"));
    [$ttfb, $code] = explode('/', $timing.'/') + ['?', '?'];
    writeln('  https://'.DEP_SITE_DOMAIN."  TTFB={$ttfb}s  HTTP={$code}");
})->desc('Show service status and site check');

// ─── SSH ──────────────────────────────────────────────────────────────────────
task('ssh', function (): void {
    passthru(sshBin().' '.DEP_USER.'@'.DEP_HOST);
})->desc('Open interactive SSH session');
