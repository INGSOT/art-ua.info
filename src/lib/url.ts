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
