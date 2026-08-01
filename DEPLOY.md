# Deployer (dep) — деплой на сервер

Сервер: **95.67.62.235** (тот же, что и backend) · HestiaCP · Node.js 22.

> ⚠ Это общий сервер с несколькими доменами (art-ua-unfo, fidart, ing, ksimex и др.).
> Домен `art-ua-unfo.dev2025.ingsot.com` временно указывает на этот проект, пока не подключён боевой домен `art-ua.info`.

Путь на сервере: `/home/developer/web/art-ua-unfo.dev2025.ingsot.com/public_html/art-ua.info`
Приложение слушает `127.0.0.1:3002`, nginx для этого домена настроен на проксирование `/` → `127.0.0.1:3001` изначально (шаблон "Node.js/Next.js Proxy", создан вручную через Hestia при заведении домена) — при первой настройке `systemd:install`/`nginx:repoint` proxy_pass переключается на `3002`.

> ⚠ Порт **3001** занят чужим процессом: коллега (`ingsot25`, Sergii) вручную задеплоил превью 2 июля напрямую (`next start -p 3001`, без процесс-менеджера) и он до сих пор молча работает в фоне. Мы его не трогаем — наш управляемый через systemd деплой висит на **3002**, а nginx для домена `art-ua-unfo.dev2025.ingsot.com` перенаправлен на 3002, так что публично виден именно наш деплой.

## Начальная настройка

```bash
cp deploy.local.php.example deploy.local.php
# заполнить DEP_PASSWORD_ROOT (пароль sudo для DEP_USER_ROOT = admin)

composer install

dep ssh production   # проверить SSH-подключение
```

> `dep` = `vendor/bin/dep`. Алиас: `alias dep='vendor/bin/dep'`.
> Один хост (`production`) — можно не указывать в командах.

## Разовая настройка systemd (после первого деплоя кода)

```bash
dep deploy production        # сначала синхронизировать код + собрать билд
dep systemd:install production  # создать /etc/systemd/system/art-ua-info.service (требует root)
dep restart:app production   # запустить сервис
dep nginx:repoint production # переключить nginx proxy_pass с 3001 на DEP_APP_PORT (требует root)
```

`systemd:install` и `nginx:repoint` идемпотентны — можно перезапускать при изменении unit-файла в `deploy.php` (`systemdUnit()`) или порта.

## Деплой

### Полный деплой

```bash
dep deploy production
```

Что делает:
1. `rsync` кода на сервер (без `node_modules`, `.next`, `.git`, `.env` и т.д.)
2. Заливает `.env.production` → `.env` на сервере, если там ещё нет `.env`
3. `npm ci`
4. `npm run build`
5. `systemctl restart art-ua-info` (через sudo)

### Быстрый деплой (без `npm ci`)

```bash
dep deploy:quick production
```

Использовать когда зависимости (`package-lock.json`) не менялись — переиспользует существующий `node_modules`.

## Проверка

```bash
dep status production   # systemd status + BUILD_ID + HTTP-проверка сайта
dep logs:app production # tail -f журнала systemd (Ctrl+C для выхода)
```

## SSH

```bash
dep ssh production
```

## Структура файлов

```
deploy.php                # основной файл Deployer (коммитить)
deploy.local.php          # хост/пути/пароли (gitignored, НЕ коммитить)
deploy.local.php.example  # шаблон (коммитить)
composer.json / composer.lock  # только dev-зависимость deployer/deployer
vendor/                   # gitignored
```

## deploy.local.php — константы

| Константа          | Описание                                                          |
|---------------------|---------------------------------------------------------------------|
| `DEP_HOST`          | IP сервера (тот же, что и backend)                                 |
| `DEP_PORT`          | SSH-порт (22)                                                       |
| `DEP_USER`          | SSH-пользователь (`developer`)                                     |
| `DEP_USER_ROOT`     | Пользователь с sudo (`admin`) — нужен для systemd                  |
| `DEP_PASSWORD_ROOT` | Пароль `DEP_USER_ROOT`                                             |
| `DEP_SSH_KEY`       | Путь к SSH-ключу (пусто = пароль через sshpass)                    |
| `DEP_PROJECT_PATH`  | Абсолютный путь к проекту на сервере                                |
| `DEP_SITE_DOMAIN`   | Домен сайта, используется для HTTP-проверки в `dep status`         |
| `DEP_SERVICE_NAME`  | Имя systemd-юнита (`art-ua-info`)                                   |
| `DEP_APP_PORT`      | Порт, на котором `next start` слушает (`3002` — `3001` занят чужим процессом, см. предупреждение выше) |

## .env.production

Скопировать `.env` и заменить `NEXT_PUBLIC_API_BASE` на прод-адрес backend API (пока backend на этом сервере не развёрнут отдельно для art-ua.info — уточнить актуальный адрес перед первым продовым деплоем).
