import api from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://save-art.ddev.site";

function absoluteUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
}

export type ServiceCurrency = "UAH" | "USD" | "EUR";

export interface PublicService {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string | null;
  artCategorySlug: string | null;
  location: string;
  price: number | null;
  priceFrom: boolean;
  currency: ServiceCurrency | null;
  options: string[];
  performerType: "artist" | "organization" | "team";
  performerId: number | null;
  performerName: string;
  performerSlug: string | null;
  performerAvatar: string | null;
}

interface RawPublicService {
  id: number;
  slug: string;
  title: { uk?: string; en?: string } | string;
  description: { uk?: string; en?: string } | string | null;
  image_url: string | null;
  art_category: { slug: string; name: string } | null;
  location: { uk?: string; en?: string } | string | null;
  price: number | null;
  price_from: boolean;
  currency: ServiceCurrency | null;
  options: string[];
  performer_type: "artist" | "organization" | "team";
  performer: { id: number; name: string; slug: string; avatar_url: string | null } | null;
}

function localized(value: { uk?: string; en?: string } | string | null | undefined): string {
  if (!value) return "";
  return typeof value === "string" ? value : (value.uk ?? value.en ?? "");
}

function mapService(raw: RawPublicService): PublicService {
  return {
    id: raw.id,
    slug: raw.slug,
    title: localized(raw.title),
    description: localized(raw.description),
    image: absoluteUrl(raw.image_url),
    artCategorySlug: raw.art_category?.slug ?? null,
    location: localized(raw.location),
    price: raw.price,
    priceFrom: raw.price_from,
    currency: raw.currency,
    options: raw.options ?? [],
    performerType: raw.performer_type,
    performerId: raw.performer?.id ?? null,
    performerName: raw.performer?.name ?? "",
    performerSlug: raw.performer?.slug ?? null,
    performerAvatar: absoluteUrl(raw.performer?.avatar_url),
  };
}

export interface ServicesFilterOption {
  slug: string;
  name: string;
  services_count: number;
}

export interface ServicesFilterCategory extends ServicesFilterOption {
  subcategories: ServicesFilterOption[];
}

export interface ServicesListFilters {
  categories: ServicesFilterCategory[];
}

export interface ServicesListMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ServicesBrowseResult {
  data: PublicService[];
  meta: ServicesListMeta;
  filters: ServicesListFilters;
}

interface RawServicesListResponse {
  data: RawPublicService[];
  meta: ServicesListMeta;
  filters: ServicesListFilters;
}

interface RawServiceResponse {
  data: RawPublicService;
}

export const publicServicesAPI = {
  /** Список послуг із пагінацією, фільтрами (категорія/ціна/валюта/локація/пошук) та довідником категорій. */
  browse: async (params?: Record<string, string | number>): Promise<ServicesBrowseResult> => {
    const response = await api.get<RawServicesListResponse>("/v1/services", {
      params: { language: "uk", ...params },
    });
    return {
      data: response.data.data.map(mapService),
      meta: response.data.meta,
      filters: response.data.filters,
    };
  },

  show: async (slug: string): Promise<PublicService> => {
    const response = await api.get<RawServiceResponse>(`/v1/services/${slug}`, {
      params: { language: "uk" },
    });
    return mapService(response.data.data);
  },

  /** Підказки міст (серед виконавців, що мають хоча б одну послугу) для автодоповнення пошуку за локацією. */
  locations: async (search: string): Promise<string[]> => {
    const response = await api.get<{ data: string[] }>("/v1/services/locations", {
      params: { language: "uk", search },
    });
    return response.data.data;
  },

  /** Надіслати запит на замовлення послуги — листи виконавцю та замовнику, нічого не зберігається. */
  order: async (slug: string, payload: OrderServicePayload): Promise<void> => {
    await api.post(`/v1/services/${slug}/order`, payload);
  },
};

export interface OrderServicePayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  options?: string[];
}
