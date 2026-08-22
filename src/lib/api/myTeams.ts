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
  region: string;
  zip: string;
  description: string;
  specialization: string;
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
  region: string;
  zip: string;
  description: string;
  specialization: string;
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
    region: raw.region,
    zip: raw.zip,
    description: raw.description,
    specialization: raw.specialization,
    members: (raw.members ?? []).map((m) => ({
      id: m.id,
      name: m.name,
      slug: m.slug,
      avatarUrl: absoluteUrl(m.avatar_url),
    })),
    isOwner: raw.is_owner,
  };
}

export const myTeamsAPI = {
  list: async (): Promise<MyTeam[]> => {
    const response = await api.get<MyTeamsResponse>("/v1/art-ua-info/my/teams", {
      params: { language: "uk" },
    });
    return response.data.data.map(mapTeam);
  },
};
