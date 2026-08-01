import api from "./auth";

type LocalizedText = string | { uk: string; en?: string };

function localize(value: LocalizedText | null | undefined): string {
  if (!value) return "";
  return typeof value === "string" ? value : value.uk ?? "";
}

export type NewsCategory = "news" | "event";

export interface PublicNewsListItem {
  id: number;
  slug: string;
  category: NewsCategory;
  categoryLabel: string;
  title: string;
  date: string;
  publishedAt: string;
  mainImageUrl: string | null;
}

export interface PublicNewsTextBlock {
  paragraphs: string[];
  imageUrl: string | null;
}

export interface PublicNewsDetail extends PublicNewsListItem {
  textBlocks: PublicNewsTextBlock[];
  createdAt?: string;
  updatedAt?: string;
}

interface RawNewsListItem {
  id: number;
  slug: string;
  category: NewsCategory;
  category_label: string;
  title: LocalizedText | null;
  date: string;
  published_at: string;
  main_image_url: string | null;
}

interface RawNewsTextBlock {
  paragraphs: string[] | { uk: string[]; en?: string[] } | null;
  image?: string | null;
  image_url: string | null;
}

interface RawNewsDetail extends Omit<RawNewsListItem, "title"> {
  title: LocalizedText | null;
  text_blocks: RawNewsTextBlock[] | null;
  created_at?: string;
  updated_at?: string;
}

interface NewsListMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  from?: number | null;
  to?: number | null;
  total: number;
}

interface NewsListResponse {
  data: RawNewsListItem[];
  links?: Record<string, unknown>;
  meta: NewsListMeta;
}

interface NewsDetailResponse {
  data: RawNewsDetail;
  language?: string;
}

export interface NewsListResult {
  items: PublicNewsListItem[];
  meta: NewsListMeta;
}

function mapListItem(raw: RawNewsListItem): PublicNewsListItem {
  return {
    id: raw.id,
    slug: raw.slug,
    category: raw.category,
    categoryLabel: raw.category_label,
    title: localize(raw.title),
    date: raw.date,
    publishedAt: raw.published_at,
    mainImageUrl: raw.main_image_url ?? null,
  };
}

function localizeParagraphs(
  paragraphs: string[] | { uk: string[]; en?: string[] } | null | undefined
): string[] {
  if (!paragraphs) return [];
  if (Array.isArray(paragraphs)) return paragraphs;
  return paragraphs.uk ?? [];
}

function mapDetail(raw: RawNewsDetail): PublicNewsDetail {
  return {
    id: raw.id,
    slug: raw.slug,
    category: raw.category,
    categoryLabel: raw.category_label,
    title: localize(raw.title),
    date: raw.date,
    publishedAt: raw.published_at,
    mainImageUrl: raw.main_image_url ?? null,
    textBlocks: (raw.text_blocks ?? []).map((block) => ({
      paragraphs: localizeParagraphs(block.paragraphs),
      imageUrl: block.image_url ?? null,
    })),
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export const newsAPI = {
  list: async (params: {
    per_page?: number;
    page?: number;
    category?: NewsCategory;
    language: "uk" | "en";
  }): Promise<NewsListResult> => {
    const response = await api.get<NewsListResponse>("/v1/art-ua-info/news", {
      params,
    });
    return {
      items: response.data.data.map(mapListItem),
      meta: response.data.meta,
    };
  },

  get: async (slug: string, language: "uk" | "en"): Promise<PublicNewsDetail> => {
    const response = await api.get<NewsDetailResponse>(`/v1/art-ua-info/news/${slug}`, {
      params: { language },
    });
    return mapDetail(response.data.data);
  },
};

export default newsAPI;
