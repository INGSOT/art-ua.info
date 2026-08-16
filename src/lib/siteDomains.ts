// Єдине джерело правди для доменів вітрин платформи.
// Значення керуються через .env, щоб домени можна було міняти в одному
// місці без пошуку по хардкоду в коді.

export const SAVE_ART_DOMAIN = process.env.NEXT_PUBLIC_SAVE_ART_IN_UA_DOMAIN || "save-art.in.ua";
export const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN || "art-ua.info";
// Поки що не використовується на бекенді (вітрини art-ua.com ще немає), але
// готове до підключення, коли з'явиться.
export const ART_UA_COM_DOMAIN = process.env.NEXT_PUBLIC_ART_UA_COM_DOMAIN || "art-ua.com";

export const SAVE_ART_URL = `https://${SAVE_ART_DOMAIN}`;
export const SITE_URL = `https://${SITE_DOMAIN}`;
export const ART_UA_COM_URL = `https://${ART_UA_COM_DOMAIN}`;

// Профіль митця на save-art живе за шляхом /profile/<slug>.
export function saveArtProfileLabel(slug: string): string {
  return `${SAVE_ART_DOMAIN}/profile/${slug}`;
}

export function saveArtProfileUrl(slug: string): string {
  return `${SAVE_ART_URL}/profile/${slug}`;
}

export function siteProfileLabel(slug: string): string {
  return `${SITE_DOMAIN}/${slug}`;
}

export function artUaComProfileUrl(slug: string): string {
  return `${ART_UA_COM_URL}/${slug}`;
}
