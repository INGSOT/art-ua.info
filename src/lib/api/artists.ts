import api from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://save-art.ddev.site";

type LocalizedText = string | { uk: string; en?: string };

function localize(value: LocalizedText | null | undefined): string {
  if (!value) return "";
  return typeof value === "string" ? value : value.uk ?? "";
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
  name: string;
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

interface ArtistsListResponse {
  data: RawArtist[];
  links?: Record<string, unknown>;
  meta?: Record<string, unknown>;
}

interface ArtistResponse {
  data: RawArtist;
}

function mapArtist(raw: RawArtist): PublicArtist {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    avatarUrl: absoluteUrl(raw.avatar_url),
    profession: localize(raw.profession),
    bio: localize(raw.bio),
    city: localize(raw.city),
    country: localize(raw.country),
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

interface RawArtistProject {
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

function mapArtistProject(raw: RawArtistProject): PublicArtistProject {
  return {
    id: raw.id,
    slug: raw.slug,
    title: localize(raw.title),
    shortDescription: localize(raw.short_description),
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

export const artistsAPI = {
  list: async (params?: {
    search?: string;
    per_page?: number;
    page?: number;
  }): Promise<PublicArtist[]> => {
    const response = await api.get<ArtistsListResponse>("/v1/artists", {
      params: { language: "uk", ...params },
    });
    return response.data.data.map(mapArtist);
  },

  get: async (slug: string): Promise<PublicArtist> => {
    const response = await api.get<ArtistResponse>(`/v1/artists/${slug}`, {
      params: { language: "uk" },
    });
    return mapArtist(response.data.data);
  },

  projects: async (
    slug: string,
    params?: { status?: string; per_page?: number; page?: number }
  ): Promise<PublicArtistProject[]> => {
    const response = await api.get<ArtistProjectsResponse>(`/v1/artists/${slug}/projects`, {
      params: { language: "uk", ...params },
    });
    return response.data.data.map(mapArtistProject);
  },
};
