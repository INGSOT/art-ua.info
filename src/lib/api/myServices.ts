import api from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://save-art.ddev.site";

function absoluteUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
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
  price: number | null;
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
  price: number | null;
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
    price: raw.price,
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
  price?: number | null;
  currency?: "UAH" | "USD" | "EUR" | null;
  options: { nameUk: string; nameEn?: string }[];
}

function buildPayload(payload: SaveServicePayload) {
  return {
    title: { uk: payload.titleUk, en: payload.titleEn },
    description: { uk: payload.descriptionUk, en: payload.descriptionEn },
    image: payload.image ?? undefined,
    price: payload.price ?? undefined,
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
