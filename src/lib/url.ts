// Порт save-art/src/utils/url.js (getImageUrl) — картинки з backend storage
// завжди тягнемо з NEXT_PUBLIC_API_BASE, бо backend повертає відносний
// шлях (/storage/...) або URL зі своїм доменом, який відрізняється від
// домену фронтенда.

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "");

export function getImageUrl(path?: string | null): string | null {
  if (!path) return null;

  if (path.startsWith("data:")) {
    return path;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      const pathname = new URL(path).pathname;
      if (pathname.startsWith("/storage/") && API_BASE) {
        return `${API_BASE}${pathname}`;
      }
      return path;
    } catch {
      return path;
    }
  }

  if (path.startsWith("/")) {
    return API_BASE ? `${API_BASE}${path}` : path;
  }

  const withStorage = path.startsWith("storage/") ? path : `storage/${path.replace(/^storage\/?/, "")}`;
  return API_BASE ? `${API_BASE}/${withStorage}` : `/${withStorage}`;
}

// Поле "Сайт" зберігається як довільний рядок без валідації протоколу на бекенді —
// без нього <a href> трактує адресу як відносний шлях і посилання веде в нікуди.
export function withHttpProtocol(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

// Прямі посилання на розділи Filament-панелі "profile" бекенду — використовуються
// як href (для звичайної навігації/відкриття в новій вкладці), поки клік не
// перехоплений на SSO-редирект (див. redirectToProfile у lib/api/auth.ts).
// Порт save-art/src/utils/url.js (getEditProfileUrl, getProfileProjectsUrl тощо).
export const getEditProfileUrl = (): string => `${API_BASE}/profile/profile`;
export const getProfileProjectsUrl = (): string => `${API_BASE}/profile/projects`;
export const getProfileCatalogsUrl = (): string => `${API_BASE}/profile/catalogs`;
export const getProfileServicesUrl = (): string => `${API_BASE}/profile/services`;
export const getProfileTeamsUrl = (): string => `${API_BASE}/profile/teams`;
export const getProfileNotificationsUrl = (): string => `${API_BASE}/profile/notifications`;
