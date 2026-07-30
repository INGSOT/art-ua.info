import api from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://save-art.ddev.site";

function absoluteUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
}

export interface PublicCatalog {
  id: number;
  title: string;
  image: string;
  likes: number;
  pdfUrl: string | null;
  artCategorySlug: string | null;
  artSubcategorySlug: string | null;
  publishedAt: string | null;
  authorId: number | null;
  authorName: string;
  authorAvatar: string;
  authorSlug: string | null;
  authorProfession: string | null;
  artCategoryName: string | null;
}

interface RawPublicCatalog {
  id: number;
  title: string;
  image_url: string;
  pdf_url: string | null;
  likes_count: number;
  art_category_slug: string | null;
  art_subcategory_slug: string | null;
  art_category: { slug: string; name: string } | null;
  published_at: string | null;
  author: { id: number; name: string; slug: string; avatar_url: string | null; profession: string | null } | null;
}

export interface CatalogsFilterOption {
  slug: string;
  name: string;
  catalogs_count: number;
}

export interface CatalogsFilterCategory extends CatalogsFilterOption {
  subcategories: CatalogsFilterOption[];
}

export interface CatalogsListFilters {
  categories: CatalogsFilterCategory[];
}

export interface CatalogsListMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CatalogsBrowseResult {
  data: PublicCatalog[];
  meta: CatalogsListMeta;
  filters: CatalogsListFilters;
}

interface RawCatalogsListResponse {
  data: RawPublicCatalog[];
  meta: CatalogsListMeta;
  filters: CatalogsListFilters;
}

interface RawCatalogResponse {
  data: RawPublicCatalog;
}

function mapCatalog(raw: RawPublicCatalog): PublicCatalog {
  return {
    id: raw.id,
    title: raw.title,
    image: absoluteUrl(raw.image_url) ?? "",
    likes: raw.likes_count,
    pdfUrl: absoluteUrl(raw.pdf_url),
    artCategorySlug: raw.art_category_slug,
    artSubcategorySlug: raw.art_subcategory_slug,
    publishedAt: raw.published_at,
    authorId: raw.author?.id ?? null,
    authorName: raw.author?.name ?? "",
    authorAvatar: absoluteUrl(raw.author?.avatar_url) ?? "",
    authorSlug: raw.author?.slug ?? null,
    authorProfession: raw.author?.profession ?? null,
    artCategoryName: raw.art_category?.name ?? null,
  };
}

export const publicCatalogsAPI = {
  /** Список каталогів із пагінацією, фільтрами (art_subcategory/search/sort) та довідником категорій. */
  browse: async (params?: Record<string, string | number>): Promise<CatalogsBrowseResult> => {
    const response = await api.get<RawCatalogsListResponse>("/v1/art-ua-info/catalogs", {
      params: { language: "uk", ...params },
    });
    return {
      data: response.data.data.map(mapCatalog),
      meta: response.data.meta,
      filters: response.data.filters,
    };
  },

  /** Один каталог за id — для сторінки перегляду PDF. */
  show: async (id: number | string): Promise<PublicCatalog> => {
    const response = await api.get<RawCatalogResponse>(`/v1/art-ua-info/catalogs/${id}`, {
      params: { language: "uk" },
    });
    return mapCatalog(response.data.data);
  },
};
