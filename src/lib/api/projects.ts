import api from "./auth";
import type { ApiLanguage } from "../../i18n/routing";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://save-art.ddev.site";

type LocalizedText = string | { uk: string; en?: string };

function absoluteUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
}

// Зворотне до absoluteUrl: перед відправкою на бекенд вже завантажене (не base64)
// зображення повертаємо у "голий" шлях відносно диску (без домену й без "/storage" —
// саме так шлях зберігається в БД, а Storage::url() сам додає "/storage" при читанні).
// Якщо цього не зробити, "/storage" задвоюється на кожному наступному збереженні.
export function toApiRelativePath(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  // Base64 data URL (свіжозавантажене зображення) — не чіпаємо: алфавіт base64
  // містить "/", тож split("/")-логіка нижче ламає дані, "з'їдаючи" байти на
  // кожному "//" всередині payload'у.
  if (url.startsWith("data:")) return url;
  const relative = url.startsWith(API_BASE) ? url.slice(API_BASE.length) : url;
  const segments = relative.split("/").filter(Boolean);
  while (segments[0] === "storage") {
    segments.shift();
  }
  return segments.join("/");
}

export interface PublicProjectListItem {
  id: number;
  slug: string;
  title: string;
  cover_url: string | null;
  likes_count: number;
  tags: string[];
}

interface RawProjectListItem extends Omit<PublicProjectListItem, "cover_url"> {
  cover_url: string | null;
}

interface ProjectsListResponse {
  data: RawProjectListItem[];
}

export interface CreateProjectPayload {
  status?: "new" | "draft" | "moderation";
  local_id?: string;
  title: { uk: string; en?: string };
  short_description?: { uk?: string; en?: string };
  cover?: string | null;
  art_category?: string;
  art_subcategory?: string;
  tags?: { uk?: string; en?: string };
}

export interface CreateProjectResponse {
  id: number;
  slug: string;
  status: string;
}

// Додаткова інформація про проєкт — блоки заголовок/текст/зображення/посилання
// (точний аналог content_blocks-редактора з save-art).
export interface ArtUaInfoContentBlock {
  type: "heading" | "paragraph" | "image" | "link";
  heading_level?: string;
  heading_text?: { uk?: string; en?: string };
  paragraph_text?: { uk?: string; en?: string };
  image?: string;
  url?: string;
}

// Робота (галерея зображень + посилання на відео), яку показуємо в прев'ю проєкту —
// окреме поле final_result, не плутати з content_blocks (додатковою інформацією).
export interface ArtUaInfoFinalResultItem {
  type: "image" | "link";
  image?: string;
  url?: string;
}

export interface ArtUaInfoParameterAnswer {
  parameter_id: number;
  parameter_value_id?: number | null;
  custom_value?: { uk?: string; en?: string };
}

export interface CreateArtUaInfoProjectPayload {
  status?: "new" | "draft" | "moderation";
  user_type: "personal" | "legal" | "team";
  team_id?: number;
  title: { uk: string; en?: string };
  short_description?: { uk?: string; en?: string };
  art_category?: string;
  art_subcategory?: string;
  parameters?: ArtUaInfoParameterAnswer[];
  cover?: string | null;
  final_result?: ArtUaInfoFinalResultItem[];
  content_blocks?: ArtUaInfoContentBlock[];
  tags?: { uk?: string[]; en?: string[] };
  sold_externally?: boolean;
}

// Оновлення: дозволені статус-переходи — "draft" (зняти опублікований проєкт
// з публікації) та "moderation" (опублікувати чернетку). Будь-які інші
// значення бекенд відхилить.
export type UpdateArtUaInfoProjectPayload = Omit<CreateArtUaInfoProjectPayload, "status"> & {
  status?: "draft" | "moderation";
};

// ---------------------------------------------------------------------------
// Мій проєкт для редагування (GET /v1/art-ua-info/my/projects/{slug} без ?language —
// повертає всі мультимовні поля повністю, {uk, en}, а не локалізований рядок)
// ---------------------------------------------------------------------------

export interface Bilingual {
  uk?: string;
  en?: string;
}

// Теги art-ua-info зберігаються як списки рядків по мовах (не comma-separated
// рядок, як у save-art) — { uk: string[], en: string[] }.
export interface BilingualTags {
  uk?: string[];
  en?: string[];
}

export interface MyProjectContentBlock {
  type: "heading" | "paragraph" | "image" | "link";
  heading_level?: string | null;
  heading_text?: Bilingual | null;
  paragraph_text?: Bilingual | null;
  image?: string | null;
  url?: string | null;
}

export interface MyProjectFinalResultItem {
  type: "image" | "link";
  image?: string | null;
  url?: string | null;
}

export interface MyProjectParameterAnswer {
  parameter_id: number;
  type: "list" | "custom";
  value_id: number | null;
  value: Bilingual | null;
}

export interface MyProjectDetail {
  id: number;
  slug: string;
  source: "save_art" | "art_ua_info";
  status: string;
  statusLabel: string;
  title: Bilingual;
  shortDescription: Bilingual;
  artCategory: string | null;
  artSubcategory: string | null;
  tags: BilingualTags;
  coverUrl: string | null;
  authorType: "personal" | "legal" | "team" | string;
  authorSlug: string | null;
  contentBlocks: MyProjectContentBlock[];
  finalResult: MyProjectFinalResultItem[];
  soldExternally: boolean;
  parameters: MyProjectParameterAnswer[];
  likesCount: number;
  isLiked: boolean;
}

interface RawMyProjectDetail {
  id: number;
  slug: string;
  source: "save_art" | "art_ua_info";
  status: string;
  status_label: string;
  title: Bilingual | null;
  short_description: Bilingual | null;
  art_category: string | null;
  art_subcategory: string | null;
  tags: BilingualTags | null;
  cover_url: string | null;
  author: { type: string; slug: string | null };
  sold_externally: boolean;
  content_blocks: MyProjectContentBlock[] | null;
  final_result: MyProjectFinalResultItem[] | null;
  parameters: MyProjectParameterAnswer[] | null;
  likes_count: number;
  is_liked: boolean;
}

export interface MyProjectListItem {
  id: number;
  slug: string;
  status: string;
  statusLabel: string;
  title: string;
  coverUrl: string | null;
  likesCount: number;
  soldExternally: boolean;
}

interface RawMyProjectListItem {
  id: number;
  slug: string;
  status: string;
  status_label: string;
  title: string;
  cover_url: string | null;
  likes_count: number;
  sold_externally?: boolean;
}

interface MyProjectsListResponse {
  data: RawMyProjectListItem[];
}

function mapMyProjectListItem(project: RawMyProjectListItem): MyProjectListItem {
  return {
    id: project.id,
    slug: project.slug,
    status: project.status,
    statusLabel: project.status_label,
    soldExternally: Boolean(project.sold_externally),
    title: project.title,
    coverUrl: absoluteUrl(project.cover_url),
    likesCount: project.likes_count,
  };
}

export interface ProjectCardAuthor {
  id: number;
  name: string;
  slug: string | null;
  avatarUrl: string | null;
}

export interface ProjectListCardItem {
  id: number;
  slug: string;
  status: string;
  statusLabel: string;
  title: string;
  coverUrl: string | null;
  artCategory: string | null;
  artCategoryLabel: string | null;
  artSubcategory: string | null;
  likesCount: number;
  author: ProjectCardAuthor;
  announcedAt: string | null;
  plannedCompletionAt: string | null;
}

interface RawProjectCardAuthor {
  id: number;
  name: string;
  slug: string | null;
  avatar_url: string | null;
}

interface RawProjectCardItem {
  id: number;
  slug: string;
  status: string;
  status_label: string;
  title: string;
  cover_url: string | null;
  art_category: string | null;
  art_category_label: string | null;
  art_subcategory: string | null;
  likes_count: number;
  author: RawProjectCardAuthor;
  announced_at: string | null;
  planned_completion_at: string | null;
}

export interface ProjectsFilterOption {
  slug: string;
  name: string;
  projects_count?: number;
}

export interface ProjectsFilterCategory extends ProjectsFilterOption {
  subcategories: ProjectsFilterOption[];
}

export interface ProjectsFilterParameterValue {
  id: number;
  value: string;
  projects_count?: number;
}

export interface ProjectsFilterParameter {
  id: number;
  name: string;
  values: ProjectsFilterParameterValue[];
}

export interface ProjectsListFilters {
  sort_options: ProjectsFilterOption[];
  categories: ProjectsFilterCategory[];
  statuses: ProjectsFilterOption[];
  parameters: ProjectsFilterParameter[];
}

export interface ProjectsListMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ProjectsBrowseResult {
  data: ProjectListCardItem[];
  meta: ProjectsListMeta;
  filters: ProjectsListFilters;
}

function mapProjectCardItem(raw: RawProjectCardItem): ProjectListCardItem {
  return {
    id: raw.id,
    slug: raw.slug,
    status: raw.status,
    statusLabel: raw.status_label,
    title: raw.title,
    coverUrl: absoluteUrl(raw.cover_url),
    artCategory: raw.art_category,
    artCategoryLabel: raw.art_category_label,
    artSubcategory: raw.art_subcategory,
    likesCount: raw.likes_count,
    author: {
      id: raw.author?.id,
      name: raw.author?.name ?? "",
      slug: raw.author?.slug ?? null,
      avatarUrl: absoluteUrl(raw.author?.avatar_url),
    },
    announcedAt: raw.announced_at,
    plannedCompletionAt: raw.planned_completion_at,
  };
}

export const projectsAPI = {
  myList: async (
    language: ApiLanguage,
    params?: Record<string, string | number>
  ): Promise<MyProjectListItem[]> => {
    const response = await api.get<MyProjectsListResponse>("/v1/art-ua-info/my/projects", {
      params: { language, ...params },
    });
    return response.data.data.map(mapMyProjectListItem);
  },

  // Завершені art-ua-info-проєкти — GET /v1/art-ua-info/my/projects/completed.
  myCompletedList: async (
    language: ApiLanguage,
    params?: Record<string, string | number>
  ): Promise<MyProjectListItem[]> => {
    const response = await api.get<MyProjectsListResponse>(
      "/v1/art-ua-info/my/projects/completed",
      {
        params: { language, ...params },
      }
    );
    return response.data.data.map(mapMyProjectListItem);
  },

  list: async (
    language: ApiLanguage,
    params?: Record<string, string | number>
  ): Promise<PublicProjectListItem[]> => {
    const response = await api.get<ProjectsListResponse>("/v1/art-ua-info/projects", {
      params: { language, ...params },
    });
    return response.data.data.map((project) => ({
      ...project,
      cover_url: project.cover_url ? `${API_BASE}${project.cover_url}` : null,
    }));
  },

  // Список публічних проєктів із пагінацією, фільтрами (art_category/art_subcategory/status)
  // та довідником для UI (categories/statuses/sort_options) — для сторінки /projects.
  browse: async (
    language: ApiLanguage,
    params?: Record<string, string | number>
  ): Promise<ProjectsBrowseResult> => {
    const response = await api.get<{
      data: RawProjectCardItem[];
      meta: ProjectsListMeta;
      filters: ProjectsListFilters;
    }>("/v1/art-ua-info/projects", {
      params: { language, ...params },
    });
    return {
      data: response.data.data.map(mapProjectCardItem),
      meta: response.data.meta,
      filters: response.data.filters,
    };
  },

  show: async (slug: string, language: ApiLanguage): Promise<PublicProjectDetail> => {
    const response = await api.get<{ data: RawProjectDetail }>(
      `/v1/art-ua-info/projects/${slug}`,
      {
        params: { language },
      }
    );
    return mapProjectDetail(response.data.data, language);
  },

  donors: async (
    slug: string,
    params?: { per_page?: number; page?: number }
  ): Promise<ProjectDonor[]> => {
    const response = await api.get<ProjectDonorsResponse>(
      `/v1/art-ua-info/projects/${slug}/donors`,
      {
        params,
      }
    );
    return response.data.data;
  },

  createArtUaInfoProject: async (
    payload: CreateArtUaInfoProjectPayload
  ): Promise<CreateProjectResponse> => {
    const response = await api.post<{ data: CreateProjectResponse }>(
      "/v1/art-ua-info/projects",
      payload
    );
    return response.data.data;
  },

  updateArtUaInfoProject: async (
    slug: string,
    payload: UpdateArtUaInfoProjectPayload
  ): Promise<CreateProjectResponse> => {
    const response = await api.put<{ data: CreateProjectResponse }>(
      `/v1/art-ua-info/projects/${slug}`,
      payload
    );
    return response.data.data;
  },

  myDelete: async (slug: string): Promise<void> => {
    await api.delete(`/v1/art-ua-info/my/projects/${slug}`);
  },

  // Project::getRouteKeyName() === 'slug', тож {project} у роуті лайка
  // резолвиться по slug, а не по числовому id.
  like: async (projectSlug: string): Promise<LikeResponse> => {
    const response = await api.post<LikeResponse>(`/v1/art-ua-info/projects/${projectSlug}/like`);
    return response.data;
  },

  unlike: async (projectSlug: string): Promise<LikeResponse> => {
    const response = await api.delete<LikeResponse>(
      `/v1/art-ua-info/projects/${projectSlug}/like`
    );
    return response.data;
  },

  // Повні (нелокалізовані, {uk, en}) дані власного проєкту для форми редагування —
  // GET /v1/art-ua-info/my/projects/{slug} без ?language.
  myShow: async (slug: string): Promise<MyProjectDetail> => {
    const response = await api.get<{ data: RawMyProjectDetail }>(
      `/v1/art-ua-info/my/projects/${slug}`
    );
    const raw = response.data.data;
    return {
      id: raw.id,
      slug: raw.slug,
      source: raw.source,
      status: raw.status,
      statusLabel: raw.status_label,
      title: raw.title ?? {},
      shortDescription: raw.short_description ?? {},
      artCategory: raw.art_category,
      artSubcategory: raw.art_subcategory,
      tags: { uk: raw.tags?.uk ?? [], en: raw.tags?.en ?? [] },
      coverUrl: absoluteUrl(raw.cover_url),
      authorType: raw.author?.type ?? "personal",
      authorSlug: raw.author?.slug ?? null,
      contentBlocks: (raw.content_blocks ?? []).map((block) =>
        block.type === "image" ? { ...block, image: absoluteUrl(block.image) } : block
      ),
      finalResult: (raw.final_result ?? []).map((item) =>
        item.type === "image" ? { ...item, image: absoluteUrl(item.image) } : item
      ),
      soldExternally: Boolean(raw.sold_externally),
      parameters: raw.parameters ?? [],
      likesCount: raw.likes_count ?? 0,
      isLiked: Boolean(raw.is_liked),
    };
  },
};

// ---------------------------------------------------------------------------
// Project detail (GET /v1/art-ua-info/projects/{slug})
// ---------------------------------------------------------------------------

export interface ProjectAuthor {
  id: number;
  name: string;
  slug: string | null;
  avatarUrl: string | null;
  profession: string;
  type: "personal" | "legal" | string;
}

export interface ProjectStage {
  id: number;
  order: number;
  status: string;
  statusLabel: string;
  title: string;
  description: string;
  daysPlanned: number | null;
  budgetPlanned: number | null;
  budgetActual: number | null;
  startedAt: string | null;
  completedAt: string | null;
  isCompleted: boolean;
  isInProgress: boolean;
}

export interface ProjectBonus {
  id: number;
  order: number;
  title: string;
  description: string;
  minDonation: number;
  maxDonation: number | null;
  quantity: number | null;
  quantityClaimed: number;
  remaining: number | null;
  isAvailable: boolean;
  isUnlimited: boolean;
}

export interface ProjectParameterValue {
  parameterId: number;
  parameter: string;
  type: string;
  valueId: number | null;
  value: string | null;
}

export interface ProjectContentBlock {
  type: string;
  headingLevel?: string;
  headingText?: string;
  paragraphText?: string;
  image?: string | null;
  imageAlt?: string;
  imageCaption?: string;
  url?: string | null;
}

export interface LikeResponse {
  message: string;
  is_liked: boolean;
  likes_count: number;
}

export interface PublicProjectDetail {
  id: number;
  slug: string;
  code: string;
  source: "save_art" | "art_ua_info";
  status: string;
  statusLabel: string;
  title: string;
  shortDescription: string;
  coverUrl: string | null;
  artCategory: string | null;
  artCategoryLabel: string | null;
  artSubcategory: string | null;
  artSubcategoryLabel: string | null;
  tags: string[];
  currency: string | null;
  budgetGoal: number | null;
  budgetCollected: number;
  progressPercentage: number;
  estimatedDays: number | null;
  likesCount: number;
  donorsCount: number;
  isLiked: boolean;
  announcedAt: string | null;
  plannedCompletionAt: string | null;
  completedAt: string | null;
  author: ProjectAuthor;
  additionalInfo: string;
  contentBlocks: ProjectContentBlock[];
  finalResult: { type: "image" | "link"; image: string | null; url: string | null }[];
  stages: ProjectStage[];
  bonuses: ProjectBonus[];
  parameters: ProjectParameterValue[];
  canDonate: boolean;
  createdAt: string;
}

interface RawProjectAuthor {
  id: number;
  name: LocalizedText | null;
  slug: string | null;
  avatar_url: string | null;
  profession: LocalizedText | null;
  type: string;
}

interface RawProjectStage {
  id: number;
  order: number;
  status: string;
  status_label: string;
  title: LocalizedText | null;
  description: LocalizedText | null;
  days_planned: number | null;
  budget_planned: number | null;
  budget_actual: number | null;
  started_at: string | null;
  completed_at: string | null;
  is_completed: boolean;
  is_in_progress: boolean;
}

interface RawProjectBonus {
  id: number;
  order: number;
  title: LocalizedText | null;
  description: LocalizedText | null;
  min_donation: number;
  max_donation: number | null;
  quantity: number | null;
  quantity_claimed: number;
  remaining: number | null;
  is_available: boolean;
  is_unlimited: boolean;
}

interface RawProjectParameter {
  parameter_id: number;
  parameter: LocalizedText | null;
  type: string;
  value_id: number | null;
  value: LocalizedText | null;
}

interface RawProjectContentBlock {
  type: string;
  heading_level?: string;
  heading_text?: LocalizedText | null;
  paragraph_text?: LocalizedText | null;
  image?: string | null;
  image_alt?: LocalizedText | null;
  image_caption?: LocalizedText | null;
  url?: string | null;
}

interface RawProjectDetail {
  id: number;
  slug: string;
  code: string;
  source: "save_art" | "art_ua_info";
  status: string;
  status_label: string;
  title: LocalizedText | null;
  short_description: LocalizedText | null;
  cover_url: string | null;
  art_category: string | null;
  art_category_label: string | null;
  art_subcategory: string | null;
  art_subcategory_label: string | null;
  // save-art зберігає теги як comma-separated LocalizedText, art-ua-info — як
  // список рядків per мова; з ?language=uk бекенд вже повертає локалізоване
  // значення — рядок або масив відповідно.
  tags: LocalizedText | string[] | null;
  currency: string | null;
  budget_goal: number | null;
  budget_collected: number;
  progress_percentage: number;
  estimated_days: number | null;
  likes_count: number;
  donors_count: number;
  is_liked: boolean;
  announced_at: string | null;
  planned_completion_at: string | null;
  completed_at: string | null;
  author: RawProjectAuthor;
  additional_info: LocalizedText | null;
  content_blocks: RawProjectContentBlock[] | null;
  final_result: { type: "image" | "link"; image?: string | null; url?: string | null }[] | null;
  stages: RawProjectStage[];
  bonuses: RawProjectBonus[];
  parameters: RawProjectParameter[];
  can_donate: boolean;
  created_at: string;
}

function localize(value: LocalizedText | null | undefined, language: ApiLanguage): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return language === "en" ? value.en ?? value.uk : value.uk;
}

function mapProjectDetail(raw: RawProjectDetail, language: ApiLanguage): PublicProjectDetail {
  return {
    id: raw.id,
    slug: raw.slug,
    code: raw.code,
    source: raw.source,
    status: raw.status,
    statusLabel: raw.status_label,
    title: localize(raw.title, language),
    shortDescription: localize(raw.short_description, language),
    coverUrl: absoluteUrl(raw.cover_url),
    artCategory: raw.art_category,
    artCategoryLabel: raw.art_category_label,
    artSubcategory: raw.art_subcategory,
    artSubcategoryLabel: raw.art_subcategory_label,
    tags: Array.isArray(raw.tags)
      ? raw.tags
      : localize(raw.tags, language)
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
    currency: raw.currency,
    budgetGoal: raw.budget_goal,
    budgetCollected: raw.budget_collected ?? 0,
    progressPercentage: raw.progress_percentage ?? 0,
    estimatedDays: raw.estimated_days,
    likesCount: raw.likes_count ?? 0,
    donorsCount: raw.donors_count ?? 0,
    isLiked: !!raw.is_liked,
    announcedAt: raw.announced_at,
    plannedCompletionAt: raw.planned_completion_at,
    completedAt: raw.completed_at,
    author: {
      id: raw.author?.id,
      name: localize(raw.author?.name, language) || "",
      slug: raw.author?.slug ?? null,
      avatarUrl: absoluteUrl(raw.author?.avatar_url),
      profession: localize(raw.author?.profession, language),
      type: raw.author?.type ?? "personal",
    },
    additionalInfo: localize(raw.additional_info, language),
    contentBlocks: (raw.content_blocks ?? []).map((block) => ({
      type: block.type,
      headingLevel: block.heading_level,
      headingText: localize(block.heading_text, language),
      paragraphText: localize(block.paragraph_text, language),
      image: absoluteUrl(block.image),
      imageAlt: localize(block.image_alt, language),
      imageCaption: localize(block.image_caption, language),
      url: block.url,
    })),
    finalResult: (raw.final_result ?? []).map((item) => ({
      type: item.type,
      image: absoluteUrl(item.image),
      url: item.url ?? null,
    })),
    stages: (raw.stages ?? []).map((stage) => ({
      id: stage.id,
      order: stage.order,
      status: stage.status,
      statusLabel: stage.status_label,
      title: localize(stage.title, language),
      description: localize(stage.description, language),
      daysPlanned: stage.days_planned,
      budgetPlanned: stage.budget_planned,
      budgetActual: stage.budget_actual,
      startedAt: stage.started_at,
      completedAt: stage.completed_at,
      isCompleted: stage.is_completed,
      isInProgress: stage.is_in_progress,
    })),
    bonuses: (raw.bonuses ?? []).map((bonus) => ({
      id: bonus.id,
      order: bonus.order,
      title: localize(bonus.title, language),
      description: localize(bonus.description, language),
      minDonation: bonus.min_donation,
      maxDonation: bonus.max_donation,
      quantity: bonus.quantity,
      quantityClaimed: bonus.quantity_claimed,
      remaining: bonus.remaining,
      isAvailable: bonus.is_available,
      isUnlimited: bonus.is_unlimited,
    })),
    parameters: (raw.parameters ?? []).map((param) => ({
      parameterId: param.parameter_id,
      parameter: localize(param.parameter, language),
      type: param.type,
      valueId: param.value_id,
      value: param.value !== null && param.value !== undefined ? localize(param.value, language) : null,
    })),
    canDonate: !!raw.can_donate,
    createdAt: raw.created_at,
  };
}

// ---------------------------------------------------------------------------
// Project donors (GET /v1/art-ua-info/projects/{slug}/donors)
// ---------------------------------------------------------------------------

export interface ProjectDonor {
  id: number;
  name: string;
  amount: number;
  currency: string;
  is_anonymous: boolean;
  donated_at: string | null;
}

interface ProjectDonorsResponse {
  data: ProjectDonor[];
  meta?: Record<string, unknown>;
}
