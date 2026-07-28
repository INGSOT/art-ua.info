import api from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://save-art.ddev.site";

type LocalizedText = string | { uk: string; en?: string };

function absoluteUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
}

export interface PublicProjectListItem {
  id: number;
  slug: string;
  title: string;
  cover_url: string | null;
  likes_count: number;
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

export interface MyProjectListItem {
  id: number;
  slug: string;
  status: string;
  statusLabel: string;
  title: string;
  coverUrl: string | null;
  likesCount: number;
}

interface RawMyProjectListItem {
  id: number;
  slug: string;
  status: string;
  status_label: string;
  title: string;
  cover_url: string | null;
  likes_count: number;
}

interface MyProjectsListResponse {
  data: RawMyProjectListItem[];
}

export const projectsAPI = {
  myList: async (params?: Record<string, string | number>): Promise<MyProjectListItem[]> => {
    const response = await api.get<MyProjectsListResponse>("/v1/my/projects", {
      params: { language: "uk", ...params },
    });
    return response.data.data.map((project) => ({
      id: project.id,
      slug: project.slug,
      status: project.status,
      statusLabel: project.status_label,
      title: project.title,
      coverUrl: absoluteUrl(project.cover_url),
      likesCount: project.likes_count,
    }));
  },

  list: async (params?: Record<string, string | number>): Promise<PublicProjectListItem[]> => {
    const response = await api.get<ProjectsListResponse>("/v1/projects", {
      params: { language: "uk", ...params },
    });
    return response.data.data.map((project) => ({
      ...project,
      cover_url: project.cover_url ? `${API_BASE}${project.cover_url}` : null,
    }));
  },

  show: async (slug: string): Promise<PublicProjectDetail> => {
    const response = await api.get<{ data: RawProjectDetail }>(`/v1/projects/${slug}`, {
      params: { language: "uk" },
    });
    return mapProjectDetail(response.data.data);
  },

  donors: async (
    slug: string,
    params?: { per_page?: number; page?: number }
  ): Promise<ProjectDonor[]> => {
    const response = await api.get<ProjectDonorsResponse>(`/v1/projects/${slug}/donors`, {
      params,
    });
    return response.data.data;
  },

  myCreate: async (payload: CreateProjectPayload): Promise<CreateProjectResponse> => {
    const response = await api.post<{ data: CreateProjectResponse }>("/v1/my/projects", payload);
    return response.data.data;
  },
};

// ---------------------------------------------------------------------------
// Project detail (GET /v1/projects/{slug})
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
}

export interface PublicProjectDetail {
  id: number;
  slug: string;
  code: string;
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
}

interface RawProjectDetail {
  id: number;
  slug: string;
  code: string;
  status: string;
  status_label: string;
  title: LocalizedText | null;
  short_description: LocalizedText | null;
  cover_url: string | null;
  art_category: string | null;
  art_category_label: string | null;
  art_subcategory: string | null;
  art_subcategory_label: string | null;
  tags: LocalizedText | null;
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
  stages: RawProjectStage[];
  bonuses: RawProjectBonus[];
  parameters: RawProjectParameter[];
  can_donate: boolean;
  created_at: string;
}

function localize(value: LocalizedText | null | undefined): string {
  if (!value) return "";
  return typeof value === "string" ? value : value.uk ?? "";
}

function mapProjectDetail(raw: RawProjectDetail): PublicProjectDetail {
  return {
    id: raw.id,
    slug: raw.slug,
    code: raw.code,
    status: raw.status,
    statusLabel: raw.status_label,
    title: localize(raw.title),
    shortDescription: localize(raw.short_description),
    coverUrl: absoluteUrl(raw.cover_url),
    artCategory: raw.art_category,
    artCategoryLabel: raw.art_category_label,
    artSubcategory: raw.art_subcategory,
    artSubcategoryLabel: raw.art_subcategory_label,
    tags: localize(raw.tags)
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
      name: localize(raw.author?.name) || "",
      slug: raw.author?.slug ?? null,
      avatarUrl: absoluteUrl(raw.author?.avatar_url),
      profession: localize(raw.author?.profession),
      type: raw.author?.type ?? "personal",
    },
    additionalInfo: localize(raw.additional_info),
    contentBlocks: (raw.content_blocks ?? []).map((block) => ({
      type: block.type,
      headingLevel: block.heading_level,
      headingText: localize(block.heading_text),
      paragraphText: localize(block.paragraph_text),
      image: absoluteUrl(block.image),
      imageAlt: localize(block.image_alt),
      imageCaption: localize(block.image_caption),
    })),
    stages: (raw.stages ?? []).map((stage) => ({
      id: stage.id,
      order: stage.order,
      status: stage.status,
      statusLabel: stage.status_label,
      title: localize(stage.title),
      description: localize(stage.description),
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
      title: localize(bonus.title),
      description: localize(bonus.description),
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
      parameter: localize(param.parameter),
      type: param.type,
      valueId: param.value_id,
      value: param.value !== null && param.value !== undefined ? localize(param.value) : null,
    })),
    canDonate: !!raw.can_donate,
    createdAt: raw.created_at,
  };
}

// ---------------------------------------------------------------------------
// Project donors (GET /v1/projects/{slug}/donors)
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
