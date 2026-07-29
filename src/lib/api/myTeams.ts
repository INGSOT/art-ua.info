import api from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://save-art.ddev.site";

function absoluteUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
}

export interface MyTeamMember {
  id: number;
  name: string;
  slug: string;
  avatarUrl: string | null;
}

export interface MyTeam {
  id: number;
  slug: string;
  name: string;
  avatarUrl: string | null;
  website: string | null;
  country: string;
  city: string;
  description: string;
  members: MyTeamMember[];
  isOwner: boolean;
}

interface RawMyTeamMember {
  id: number;
  name: string;
  slug: string;
  avatar_url: string | null;
}

interface RawMyTeam {
  id: number;
  slug: string;
  name: string;
  avatar_url: string | null;
  website: string | null;
  country: string;
  city: string;
  description: string;
  members: RawMyTeamMember[];
  is_owner: boolean;
}

interface MyTeamsResponse {
  data: RawMyTeam[];
}

function mapTeam(raw: RawMyTeam): MyTeam {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    avatarUrl: absoluteUrl(raw.avatar_url),
    website: raw.website,
    country: raw.country,
    city: raw.city,
    description: raw.description,
    members: (raw.members ?? []).map((m) => ({
      id: m.id,
      name: m.name,
      slug: m.slug,
      avatarUrl: absoluteUrl(m.avatar_url),
    })),
    isOwner: raw.is_owner,
  };
}

export interface SaveTeamPayload {
  nameUk: string;
  nameEn?: string;
  avatar?: string | null;
  website?: string;
  countryUk?: string;
  countryEn?: string;
  cityUk?: string;
  cityEn?: string;
  descriptionUk?: string;
  descriptionEn?: string;
  memberIds: number[];
}

function buildPayload(payload: SaveTeamPayload) {
  return {
    name: { uk: payload.nameUk, en: payload.nameEn },
    avatar: payload.avatar ?? undefined,
    website: payload.website || undefined,
    country: { uk: payload.countryUk, en: payload.countryEn },
    city: { uk: payload.cityUk, en: payload.cityEn },
    description: { uk: payload.descriptionUk, en: payload.descriptionEn },
    members: payload.memberIds.map((id) => ({ user_id: id })),
  };
}

export const myTeamsAPI = {
  list: async (): Promise<MyTeam[]> => {
    const response = await api.get<MyTeamsResponse>("/v1/art-ua-info/my/teams", {
      params: { language: "uk" },
    });
    return response.data.data.map(mapTeam);
  },

  create: async (payload: SaveTeamPayload): Promise<MyTeam> => {
    const response = await api.post<{ data: RawMyTeam }>("/v1/art-ua-info/my/teams", buildPayload(payload), {
      params: { language: "uk" },
    });
    return mapTeam(response.data.data);
  },

  update: async (slug: string, payload: SaveTeamPayload): Promise<MyTeam> => {
    const response = await api.put<{ data: RawMyTeam }>(
      `/v1/art-ua-info/my/teams/${slug}`,
      buildPayload(payload),
      { params: { language: "uk" } }
    );
    return mapTeam(response.data.data);
  },

  remove: async (slug: string): Promise<void> => {
    await api.delete(`/v1/art-ua-info/my/teams/${slug}`);
  },

  leave: async (slug: string): Promise<void> => {
    await api.post(`/v1/art-ua-info/my/teams/${slug}/leave`);
  },
};
