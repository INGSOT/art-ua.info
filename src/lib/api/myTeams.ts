import api from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://save-art.ddev.site";

function absoluteUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
}

// Зворотне до absoluteUrl: перед відправкою на бекенд вже завантажене (не base64)
// зображення повертаємо у "голий" шлях відносно диску (без домену й без "/storage" —
// саме так шлях зберігається в БД, а Storage::url() сам додає "/storage" при читанні).
// Якщо цього не зробити, домен/"/storage" задвоюється на кожному наступному збереженні,
// а бекенд не зможе розпізнати "це той самий аватар" і видалити старий файл при заміні.
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

interface LocalizedText {
  uk?: string;
  en?: string;
}

// Без параметра language бекенд повертає повний {uk, en} об'єкт замість
// локалізованого рядка (див. LocalizesFields::localizeField) — потрібно для
// форми редагування, де мають заповнюватись обидва мовних поля.
export interface MyTeamBilingual {
  id: number;
  slug: string;
  avatarUrl: string | null;
  website: string | null;
  name: LocalizedText;
  country: LocalizedText;
  city: LocalizedText;
  region: LocalizedText;
  zip: LocalizedText;
  description: LocalizedText;
  specialization: LocalizedText;
  members: MyTeamMember[];
  isOwner: boolean;
}

interface RawMyTeamBilingual {
  id: number;
  slug: string;
  avatar_url: string | null;
  website: string | null;
  name: LocalizedText;
  country: LocalizedText;
  city: LocalizedText;
  region: LocalizedText;
  zip: LocalizedText;
  description: LocalizedText;
  specialization: LocalizedText;
  members: RawMyTeamMember[];
  is_owner: boolean;
}

interface MyTeamsBilingualResponse {
  data: RawMyTeamBilingual[];
}

interface SearchMembersResponse {
  data: RawMyTeamMember[];
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

function mapTeamBilingual(raw: RawMyTeamBilingual): MyTeamBilingual {
  return {
    id: raw.id,
    slug: raw.slug,
    avatarUrl: absoluteUrl(raw.avatar_url),
    website: raw.website,
    name: raw.name ?? {},
    country: raw.country ?? {},
    city: raw.city ?? {},
    region: raw.region ?? {},
    zip: raw.zip ?? {},
    description: raw.description ?? {},
    specialization: raw.specialization ?? {},
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
  regionUk?: string;
  regionEn?: string;
  zipUk?: string;
  zipEn?: string;
  descriptionUk?: string;
  descriptionEn?: string;
  specializationUk?: string;
  specializationEn?: string;
  memberIds: number[];
}

function buildPayload(payload: SaveTeamPayload) {
  return {
    name: { uk: payload.nameUk, en: payload.nameEn },
    avatar: toApiRelativePath(payload.avatar),
    website: payload.website || undefined,
    country: { uk: payload.countryUk, en: payload.countryEn },
    city: { uk: payload.cityUk, en: payload.cityEn },
    region: { uk: payload.regionUk, en: payload.regionEn },
    zip: { uk: payload.zipUk, en: payload.zipEn },
    description: { uk: payload.descriptionUk, en: payload.descriptionEn },
    specialization: { uk: payload.specializationUk, en: payload.specializationEn },
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

  // Для форми редагування — без language бекенд не схлопує name/country/city/
  // region/zip/description/specialization до одного рядка, а поверне обидва
  // мовних варіанти (потрібно, щоб не втрачати вже заповнені EN-поля).
  getForEdit: async (slug: string): Promise<MyTeamBilingual | null> => {
    const response = await api.get<MyTeamsBilingualResponse>("/v1/art-ua-info/my/teams");
    const team = response.data.data.find((t) => t.slug === slug);
    return team ? mapTeamBilingual(team) : null;
  },

  remove: async (slug: string): Promise<void> => {
    await api.delete(`/v1/art-ua-info/my/teams/${slug}`);
  },

  leave: async (slug: string): Promise<void> => {
    await api.post(`/v1/art-ua-info/my/teams/${slug}/leave`);
  },

  // Приватний пошук користувачів для додавання в команду (за ПІБ або email) —
  // на відміну від публічного artistsAPI.list не вимагає опублікованих проєктів.
  searchMembers: async (search: string): Promise<MyTeamMember[]> => {
    const response = await api.get<SearchMembersResponse>("/v1/art-ua-info/my/teams/search-members", {
      params: { search, language: "uk" },
    });
    return response.data.data.map((m) => ({
      id: m.id,
      name: m.name,
      slug: m.slug,
      avatarUrl: absoluteUrl(m.avatar_url),
    }));
  },
};
