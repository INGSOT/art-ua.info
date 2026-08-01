import api from "./auth";
import {
  mapArtistProject,
  type AuthorsListMeta,
  type PublicArtistProject,
  type RawArtistProject,
} from "./authorProfiles";
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

export interface TeamMemberSummary {
  id: number;
  slug: string;
  name: string;
  avatarUrl: string | null;
}

export interface TeamSocialLink {
  icon: string;
  alt: string;
  url: string;
}

const SOCIAL_ICONS: Record<string, { alt: string; icon: string }> = {
  website: { alt: "Website", icon: "/planet.svg" },
  facebook: { alt: "Facebook", icon: "/socials/facebook_yellow.svg" },
  instagram: { alt: "Instagram", icon: "/socials/instagram_yellow.svg" },
  linkedin: { alt: "LinkedIn", icon: "/socials/linked_in_yellow.svg" },
  youtube: { alt: "YouTube", icon: "/socials/youtube_yellow.svg" },
  pinterest: { alt: "Pinterest", icon: "/socials/pinterest_yellow.svg" },
  deviantart: { alt: "DeviantArt", icon: "/socials/deviantart_yellow.svg" },
  twitter: { alt: "X", icon: "/socials/x_yellow.svg" },
  x: { alt: "X", icon: "/socials/x_yellow.svg" },
};

interface RawSocialLink {
  platform?: string;
  url?: string;
}

function mapSocialLinks(raw: RawSocialLink[] | null | undefined): TeamSocialLink[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      const platform = entry.platform?.toLowerCase();
      const meta = platform ? SOCIAL_ICONS[platform] : undefined;
      if (!entry.url || !meta) return null;
      return { icon: meta.icon, alt: meta.alt, url: entry.url };
    })
    .filter((link): link is TeamSocialLink => link !== null);
}

export interface PublicTeam {
  id: number;
  slug: string;
  name: string;
  avatarUrl: string | null;
  website: string | null;
  country: string;
  city: string;
  description: string;
  specialization: string;
  socialLinks: TeamSocialLink[];
  membersCount: number;
  memberAvatars: string[];
  members: TeamMemberSummary[];
}

interface RawTeamMember {
  id: number;
  name: LocalizedText;
  slug: string;
  avatar_url: string | null;
}

interface RawTeam {
  id: number;
  slug: string;
  name: LocalizedText;
  avatar_url: string | null;
  website: string | null;
  country: LocalizedText | null;
  city: LocalizedText | null;
  description: LocalizedText | null;
  specialization: LocalizedText | null;
  social_links: RawSocialLink[] | null;
  members_count: number;
  member_avatars: string[];
  members: RawTeamMember[] | null;
}

interface TeamsListResponse {
  data: RawTeam[];
  links?: Record<string, unknown>;
  meta?: AuthorsListMeta;
}

export interface TeamsBrowseResult {
  data: PublicTeam[];
  meta: AuthorsListMeta;
}

interface TeamResponse {
  data: RawTeam;
}

interface TeamProjectsResponse {
  data: RawArtistProject[];
  links?: Record<string, unknown>;
  meta?: Record<string, unknown>;
}

function mapTeam(raw: RawTeam, language: ApiLanguage): PublicTeam {
  return {
    id: raw.id,
    slug: raw.slug,
    name: localize(raw.name, language),
    avatarUrl: absoluteUrl(raw.avatar_url),
    website: raw.website,
    country: localize(raw.country, language),
    city: localize(raw.city, language),
    description: localize(raw.description, language),
    specialization: localize(raw.specialization, language),
    socialLinks: mapSocialLinks(raw.social_links),
    membersCount: raw.members_count ?? 0,
    memberAvatars: (raw.member_avatars ?? []).map((avatar) => absoluteUrl(avatar) ?? avatar),
    members: (raw.members ?? []).map((member) => ({
      id: member.id,
      slug: member.slug,
      name: localize(member.name, language),
      avatarUrl: absoluteUrl(member.avatar_url),
    })),
  };
}

export const teamsAPI = {
  list: async (
    language: ApiLanguage,
    params?: {
      search?: string;
      per_page?: number;
      page?: number;
    }
  ): Promise<PublicTeam[]> => {
    const response = await api.get<TeamsListResponse>("/v1/art-ua-info/teams", {
      params: { language, ...params },
    });
    return response.data.data.map((raw) => mapTeam(raw, language));
  },

  // З пагінацією (meta) — для /authors, симетрично до artistsAPI.browse.
  browse: async (
    language: ApiLanguage,
    params?: {
      search?: string;
      per_page?: number;
      page?: number;
    }
  ): Promise<TeamsBrowseResult> => {
    const response = await api.get<TeamsListResponse>("/v1/art-ua-info/teams", {
      params: { language, ...params },
    });
    return {
      data: response.data.data.map((raw) => mapTeam(raw, language)),
      meta: response.data.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: response.data.data.length,
        total: response.data.data.length,
      },
    };
  },

  get: async (slug: string, language: ApiLanguage): Promise<PublicTeam> => {
    const response = await api.get<TeamResponse>(`/v1/art-ua-info/teams/${slug}`, {
      params: { language },
    });
    return mapTeam(response.data.data, language);
  },

  projects: async (
    slug: string,
    language: ApiLanguage,
    params?: { per_page?: number; page?: number }
  ): Promise<PublicArtistProject[]> => {
    const response = await api.get<TeamProjectsResponse>(
      `/v1/art-ua-info/teams/${slug}/projects`,
      {
        params: { language, ...params },
      }
    );
    return response.data.data.map((raw) => mapArtistProject(raw, language));
  },
};
