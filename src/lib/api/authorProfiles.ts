import api from "./auth";
import type { ApiLanguage } from "../../i18n/routing";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://save-art.ddev.site";

type LocalizedText = string | { uk: string; en?: string };

function localize(value: LocalizedText | null | undefined, language: ApiLanguage): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return language === "en" ? value.en ?? value.uk : value.uk;
}

function absoluteUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
}

export interface ArtistSocial {
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  youtube: string | null;
  linkedin: string | null;
}

export interface PublicArtist {
  id: number;
  slug: string;
  name: string;
  avatarUrl: string | null;
  profession: string;
  bio: string;
  city: string;
  country: string;
  social: ArtistSocial | null;
  projectsCount: number;
  completedProjectsCount: number;
}

interface RawArtist {
  id: number;
  name: LocalizedText;
  slug: string;
  avatar_url: string | null;
  profession: LocalizedText | null;
  bio: LocalizedText | null;
  city: LocalizedText | null;
  country: LocalizedText | null;
  social?: ArtistSocial | null;
  projects_count: number;
  completed_projects_count: number;
  created_at: string;
}

function mapArtist(raw: RawArtist, language: ApiLanguage): PublicArtist {
  return {
    id: raw.id,
    slug: raw.slug,
    name: localize(raw.name, language),
    avatarUrl: absoluteUrl(raw.avatar_url),
    profession: localize(raw.profession, language),
    bio: localize(raw.bio, language),
    city: localize(raw.city, language),
    country: localize(raw.country, language),
    social: raw.social ?? null,
    projectsCount: raw.projects_count ?? 0,
    completedProjectsCount: raw.completed_projects_count ?? 0,
  };
}

export interface PublicArtistProject {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  coverUrl: string | null;
  artCategory: string;
  artCategoryLabel: string;
  artSubcategory: string | null;
  artSubcategoryLabel: string | null;
  status: string;
  statusLabel: string;
  likesCount: number;
  donorsCount: number;
  announcedAt: string | null;
}

export interface RawArtistProject {
  id: number;
  slug: string;
  title: LocalizedText | null;
  short_description: LocalizedText | null;
  cover_url: string | null;
  art_category: string;
  art_category_label: string;
  art_subcategory: string | null;
  art_subcategory_label: string | null;
  status: string;
  status_label: string;
  likes_count: number;
  donors_count: number;
  announced_at: string | null;
}

interface ArtistProjectsResponse {
  data: RawArtistProject[];
  links?: Record<string, unknown>;
  meta?: Record<string, unknown>;
}

export function mapArtistProject(raw: RawArtistProject, language: ApiLanguage): PublicArtistProject {
  return {
    id: raw.id,
    slug: raw.slug,
    title: localize(raw.title, language),
    shortDescription: localize(raw.short_description, language),
    coverUrl: absoluteUrl(raw.cover_url),
    artCategory: raw.art_category,
    artCategoryLabel: raw.art_category_label,
    artSubcategory: raw.art_subcategory,
    artSubcategoryLabel: raw.art_subcategory_label,
    status: raw.status,
    statusLabel: raw.status_label,
    likesCount: raw.likes_count ?? 0,
    donorsCount: raw.donors_count ?? 0,
    announcedAt: raw.announced_at,
  };
}

// Категорії/підкатегорії з authors_count — те саме, що filters.categories на /projects
// (ProjectsFilterCategory), тільки з authors_count замість projects_count.
export interface AuthorsFilterOption {
  slug: string;
  name: string;
  authors_count?: number;
}

export interface AuthorsFilterCategory extends AuthorsFilterOption {
  subcategories: AuthorsFilterOption[];
}

// Характеристики (Parameter) обраної категорії — те саме, що filters.parameters на
// /projects (ProjectsFilterParameter), тільки з authors_count замість projects_count.
export interface AuthorsFilterParameterValue {
  id: number;
  value: string;
  authors_count?: number;
}

export interface AuthorsFilterParameter {
  id: number;
  name: string;
  values: AuthorsFilterParameterValue[];
}

export interface AuthorsListFilters {
  categories: AuthorsFilterCategory[];
  parameters: AuthorsFilterParameter[];
  sort_options: AuthorsFilterOption[];
}

export interface AuthorsListMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface AuthorsBrowseResult {
  data: PublicArtist[];
  meta: AuthorsListMeta;
  filters: AuthorsListFilters;
}

interface ArtistsListResponse {
  data: RawArtist[];
  links?: Record<string, unknown>;
  meta?: AuthorsListMeta;
  filters?: AuthorsListFilters;
}

interface ArtistResponse {
  data: RawArtist;
}

/**
 * Митці й організації art-ua-info зберігаються в одній таблиці users, відрізняються
 * лише profile_type — бекенд віддає їх через симетричні /v1/art-ua-info/{artists,organizations}
 * з однаковою формою відповіді, тож клієнт теж спільний.
 */
export function createAuthorProfileAPI(basePath: "artists" | "organizations") {
  return {
    // Простий список без пагінації/фільтрів — для автокомпліту тощо (сумісний з
    // попередньою поведінкою artistsAPI.list).
    list: async (
      language: ApiLanguage,
      params?: {
        search?: string;
        per_page?: number;
        page?: number;
      }
    ): Promise<PublicArtist[]> => {
      const response = await api.get<ArtistsListResponse>(`/v1/art-ua-info/${basePath}`, {
        params: { language, ...params },
      });
      return response.data.data.map((raw) => mapArtist(raw, language));
    },

    // Список з пагінацією й фільтрами (categories/sort_options) — для /authors,
    // симетрично до projectsAPI.browse на /projects.
    browse: async (
      language: ApiLanguage,
      params?: Record<string, string | number>
    ): Promise<AuthorsBrowseResult> => {
      const response = await api.get<ArtistsListResponse>(`/v1/art-ua-info/${basePath}`, {
        params: { language, ...params },
      });
      return {
        data: response.data.data.map((raw) => mapArtist(raw, language)),
        meta: response.data.meta ?? { current_page: 1, last_page: 1, per_page: response.data.data.length, total: response.data.data.length },
        filters: response.data.filters ?? { categories: [], parameters: [], sort_options: [] },
      };
    },

    get: async (slug: string, language: ApiLanguage): Promise<PublicArtist> => {
      const response = await api.get<ArtistResponse>(`/v1/art-ua-info/${basePath}/${slug}`, {
        params: { language },
      });
      return mapArtist(response.data.data, language);
    },

    projects: async (
      slug: string,
      language: ApiLanguage,
      params?: { status?: string; per_page?: number; page?: number }
    ): Promise<PublicArtistProject[]> => {
      const response = await api.get<ArtistProjectsResponse>(
        `/v1/art-ua-info/${basePath}/${slug}/projects`,
        {
          params: { language, ...params },
        }
      );
      return response.data.data.map((raw) => mapArtistProject(raw, language));
    },
  };
}
