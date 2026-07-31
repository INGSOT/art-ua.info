import api from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://save-art.ddev.site";

function absoluteUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
}

// Зворотне до absoluteUrl: перед відправкою на бекенд вже завантажене (не base64)
// зображення повертаємо у "голий" шлях відносно диску (без домену й без "/storage" —
// саме так шлях зберігається в БД, а Storage::url() сам додає "/storage" при читанні).
// Якщо цього не зробити, домен/"/storage" задвоюється на кожному наступному збереженні.
function toApiRelativePath(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("data:")) return url;
  const relative = url.startsWith(API_BASE) ? url.slice(API_BASE.length) : url;
  const segments = relative.split("/").filter(Boolean);
  while (segments[0] === "storage") {
    segments.shift();
  }
  return segments.join("/");
}

export interface MyService {
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  price: number | null;
  currency: string | null;
  options: string[];
}

interface RawMyService {
  slug: string;
  title: string;
  description: string;
  image_url: string | null;
  price: number | null;
  currency: string | null;
  options: string[];
}

interface MyServicesResponse {
  data: RawMyService[];
}

function mapService(raw: RawMyService): MyService {
  return {
    slug: raw.slug,
    title: raw.title,
    description: raw.description,
    imageUrl: absoluteUrl(raw.image_url),
    price: raw.price,
    currency: raw.currency,
    options: raw.options,
  };
}

export interface MyServiceDetail {
  slug: string;
  titleUk: string;
  titleEn: string;
  descriptionUk: string;
  descriptionEn: string;
  imageUrl: string | null;
  artCategory: string | null;
  artSubcategory: string | null;
  categoryLabel: string | null;
  price: number | null;
  priceFrom: boolean;
  currency: string | null;
  options: { nameUk: string; nameEn: string }[];
}

interface RawLocalized {
  uk?: string;
  en?: string;
}

interface RawMyServiceDetail {
  slug: string;
  title: RawLocalized | null;
  description: RawLocalized | null;
  image_url: string | null;
  art_category_slug: string | null;
  art_subcategory_slug: string | null;
  art_category: { slug: string; name: string } | null;
  price: number | null;
  price_from: boolean;
  currency: string | null;
  options: RawLocalized[];
}

function mapServiceDetail(raw: RawMyServiceDetail): MyServiceDetail {
  return {
    slug: raw.slug,
    titleUk: raw.title?.uk ?? "",
    titleEn: raw.title?.en ?? "",
    descriptionUk: raw.description?.uk ?? "",
    descriptionEn: raw.description?.en ?? "",
    imageUrl: absoluteUrl(raw.image_url),
    artCategory: raw.art_category_slug,
    artSubcategory: raw.art_subcategory_slug,
    categoryLabel: raw.art_category?.name ?? null,
    price: raw.price,
    priceFrom: raw.price_from,
    currency: raw.currency,
    options: (raw.options ?? []).map((option) => ({
      nameUk: option.uk ?? "",
      nameEn: option.en ?? "",
    })),
  };
}

export interface SaveServicePayload {
  titleUk: string;
  titleEn?: string;
  descriptionUk?: string;
  descriptionEn?: string;
  image?: string | null;
  artCategory: string;
  artSubcategory?: string | null;
  price?: number | null;
  priceFrom?: boolean;
  currency?: "UAH" | "USD" | "EUR" | null;
  options: { nameUk: string; nameEn?: string }[];
}

function buildPayload(payload: SaveServicePayload) {
  return {
    title: { uk: payload.titleUk, en: payload.titleEn },
    description: { uk: payload.descriptionUk, en: payload.descriptionEn },
    image: toApiRelativePath(payload.image),
    art_category: payload.artCategory,
    art_subcategory: payload.artSubcategory ?? undefined,
    // payload.price може бути null (означає "ціна договірна") — важливо не
    // перетворювати його на undefined через "??", інакше поле випаде з
    // запиту й бекенд не очистить попереднє значення ціни.
    price: payload.price,
    price_from: payload.priceFrom ?? false,
    currency: payload.currency ?? undefined,
    options: payload.options
      .filter((option) => option.nameUk.trim())
      .map((option) => ({ name: { uk: option.nameUk, en: option.nameEn } })),
  };
}

export const myServicesAPI = {
  list: async (): Promise<MyService[]> => {
    const response = await api.get<MyServicesResponse>("/v1/art-ua-info/my/services", {
      params: { language: "uk" },
    });
    return response.data.data.map(mapService);
  },

  show: async (slug: string): Promise<MyServiceDetail> => {
    const response = await api.get<{ data: RawMyServiceDetail }>(
      `/v1/art-ua-info/my/services/${slug}`
    );
    return mapServiceDetail(response.data.data);
  },

  create: async (payload: SaveServicePayload): Promise<MyService> => {
    const response = await api.post<{ data: RawMyService }>(
      "/v1/art-ua-info/my/services",
      buildPayload(payload),
      { params: { language: "uk" } }
    );
    return mapService(response.data.data);
  },

  // Послуги команди — видно й керується тільки учасниками (перевіряється на бекенді).
  listForTeam: async (teamSlug: string): Promise<MyService[]> => {
    const response = await api.get<MyServicesResponse>(
      `/v1/art-ua-info/my/teams/${teamSlug}/services`,
      { params: { language: "uk" } }
    );
    return response.data.data.map(mapService);
  },

  createForTeam: async (teamSlug: string, payload: SaveServicePayload): Promise<MyService> => {
    const response = await api.post<{ data: RawMyService }>(
      `/v1/art-ua-info/my/teams/${teamSlug}/services`,
      buildPayload(payload),
      { params: { language: "uk" } }
    );
    return mapService(response.data.data);
  },

  update: async (slug: string, payload: SaveServicePayload): Promise<MyService> => {
    const response = await api.put<{ data: RawMyService }>(
      `/v1/art-ua-info/my/services/${slug}`,
      buildPayload(payload),
      { params: { language: "uk" } }
    );
    return mapService(response.data.data);
  },

  remove: async (slug: string): Promise<void> => {
    await api.delete(`/v1/art-ua-info/my/services/${slug}`);
  },
};
