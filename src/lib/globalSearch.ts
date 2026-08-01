import { artistsAPI } from "./api/artists";
import { organizationsAPI } from "./api/organizations";
import { teamsAPI } from "./api/teams";
import { projectsAPI } from "./api/projects";
import { publicServicesAPI } from "./api/publicServices";
import { publicCatalogsAPI } from "./api/publicCatalogs";
import { newsAPI, type PublicNewsListItem } from "./api/news";
import type { ApiLanguage } from "../i18n/routing";

export type GlobalSearchCategoryId =
  | "participants"
  | "projects"
  | "services"
  | "catalogs"
  | "news";

export interface GlobalSearchCategoryResult {
  id: GlobalSearchCategoryId;
  label: string;
  /** pathname без query */
  href: string;
  count: number;
}

export interface GlobalSearchSuggestion {
  id: string;
  /** Головний текст (назва / ім’я) */
  primary: string;
  /** Розділ сайту */
  categoryLabel: string;
  /** Повний URL з параметром search */
  href: string;
}

const PARTICIPANTS_PATH = "/authors";
const PROJECTS_PATH = "/projects";
const SERVICES_PATH = "/services";
const CATALOGS_PATH = "/catalogs";
const NEWS_PATH = "/news-events";

const LABEL_PARTICIPANTS = "Учасники";
const LABEL_PROJECTS = "Проєкти";
const LABEL_SERVICES = "Послуги";
const LABEL_CATALOGS = "Каталоги";
const LABEL_NEWS = "Новини та події";

/** Скільки підказок тягнути з бекенда на кожен розділ (участники — по стільки з кожного підтипу). */
const SUGGESTIONS_PER_CATEGORY = 5;

export function buildSearchUrl(pathname: string, query: string): string {
  const trimmed = query.trim();
  if (!trimmed) return pathname;
  const params = new URLSearchParams();
  params.set("search", trimmed);
  return `${pathname}?${params.toString()}`;
}

function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  return promise.catch(() => fallback);
}

// Новини не підтримують серверний пошук (лише per_page/page/category) — сторінка
// /news-events так само тягне повний список і фільтрує заголовок на клієнті.
// Кешуємо один раз на мову, щоб не перезавантажувати сотні новин на кожен keystroke.
const newsCachePromises = new Map<ApiLanguage, Promise<PublicNewsListItem[]>>();
function loadAllNews(language: ApiLanguage): Promise<PublicNewsListItem[]> {
  let promise = newsCachePromises.get(language);
  if (!promise) {
    promise = newsAPI
      .list({ per_page: 200, language })
      .then((result) => result.items)
      .catch((error) => {
        newsCachePromises.delete(language);
        throw error;
      });
    newsCachePromises.set(language, promise);
  }
  return promise;
}

function matchNews(items: PublicNewsListItem[], normalizedQuery: string): PublicNewsListItem[] {
  return items.filter((item) => item.title.toLowerCase().includes(normalizedQuery));
}

interface ParticipantHit {
  key: string;
  name: string;
}

/** Митці, організації й команди — окремі ендпоінти, але в пошуку об'єднані в один розділ "Учасники". */
async function fetchParticipants(
  search: string,
  perPage: number,
  language: ApiLanguage
): Promise<{ hits: ParticipantHit[]; total: number }> {
  const [artists, organizations, teams] = await Promise.all([
    safe(artistsAPI.browse(language, { search, per_page: perPage }), { data: [], meta: { current_page: 1, last_page: 1, per_page: perPage, total: 0 }, filters: { categories: [], parameters: [], sort_options: [] } }),
    safe(organizationsAPI.browse(language, { search, per_page: perPage }), { data: [], meta: { current_page: 1, last_page: 1, per_page: perPage, total: 0 }, filters: { categories: [], parameters: [], sort_options: [] } }),
    safe(teamsAPI.browse(language, { search, per_page: perPage }), { data: [], meta: { current_page: 1, last_page: 1, per_page: perPage, total: 0 } }),
  ]);

  const hits: ParticipantHit[] = [
    ...artists.data.map((a) => ({ key: `artist-${a.id}`, name: a.name })),
    ...organizations.data.map((o) => ({ key: `organization-${o.id}`, name: o.name })),
    ...teams.data.map((t) => ({ key: `team-${t.id}`, name: t.name })),
  ];

  return {
    hits,
    total: artists.meta.total + organizations.meta.total + teams.meta.total,
  };
}

/**
 * Підказки для глобального пошуку: реальні збіги з бекенда з посиланням на відповідну
 * сторінку з `?search=…` (текст пошуку — назва сутності, щоб на сторінці списку залишився
 * релевантний набір).
 */
export async function getGlobalSearchSuggestions(
  rawQuery: string,
  language: ApiLanguage
): Promise<GlobalSearchSuggestion[]> {
  const trimmed = rawQuery.trim();
  if (!trimmed) return [];
  const normalized = trimmed.toLowerCase();

  const [participants, projects, services, catalogs, news] = await Promise.all([
    fetchParticipants(trimmed, SUGGESTIONS_PER_CATEGORY, language),
    safe(projectsAPI.browse(language, { search: trimmed, per_page: SUGGESTIONS_PER_CATEGORY }), { data: [], meta: { current_page: 1, last_page: 1, per_page: 0, total: 0 }, filters: { sort_options: [], categories: [], statuses: [], parameters: [] } }),
    safe(publicServicesAPI.browse(language, { search: trimmed, per_page: SUGGESTIONS_PER_CATEGORY }), { data: [], meta: { current_page: 1, last_page: 1, per_page: 0, total: 0 }, filters: { categories: [] } }),
    safe(publicCatalogsAPI.browse(language, { search: trimmed, per_page: SUGGESTIONS_PER_CATEGORY }), { data: [], meta: { current_page: 1, last_page: 1, per_page: 0, total: 0 }, filters: { categories: [] } }),
    safe(
      loadAllNews(language).then((items) => matchNews(items, normalized).slice(0, SUGGESTIONS_PER_CATEGORY)),
      []
    ),
  ]);

  const out: GlobalSearchSuggestion[] = [];

  participants.hits.slice(0, SUGGESTIONS_PER_CATEGORY).forEach((p) => {
    out.push({
      id: `participant-${p.key}`,
      primary: p.name,
      categoryLabel: LABEL_PARTICIPANTS,
      href: buildSearchUrl(PARTICIPANTS_PATH, p.name),
    });
  });

  projects.data.forEach((project) => {
    out.push({
      id: `project-${project.id}`,
      primary: project.title,
      categoryLabel: LABEL_PROJECTS,
      href: buildSearchUrl(PROJECTS_PATH, project.title),
    });
  });

  services.data.forEach((service) => {
    out.push({
      id: `service-${service.id}`,
      primary: service.title,
      categoryLabel: LABEL_SERVICES,
      href: buildSearchUrl(SERVICES_PATH, service.title),
    });
  });

  catalogs.data.forEach((catalog) => {
    out.push({
      id: `catalog-${catalog.id}`,
      primary: catalog.title,
      categoryLabel: LABEL_CATALOGS,
      href: buildSearchUrl(CATALOGS_PATH, catalog.title),
    });
  });

  news.forEach((item) => {
    out.push({
      id: `news-${item.id}`,
      primary: item.title,
      categoryLabel: LABEL_NEWS,
      href: buildSearchUrl(NEWS_PATH, item.title),
    });
  });

  return out;
}

/**
 * Підсумок пошуку по всіх розділах — реальна кількість збігів з бекенда
 * (per_page: 1, бо потрібен лише meta.total, а не самі елементи).
 */
export async function getGlobalSearchResults(
  rawQuery: string,
  language: ApiLanguage
): Promise<GlobalSearchCategoryResult[]> {
  const trimmed = rawQuery.trim();
  const empty: GlobalSearchCategoryResult[] = [
    { id: "participants", label: LABEL_PARTICIPANTS, href: PARTICIPANTS_PATH, count: 0 },
    { id: "projects", label: LABEL_PROJECTS, href: PROJECTS_PATH, count: 0 },
    { id: "services", label: LABEL_SERVICES, href: SERVICES_PATH, count: 0 },
    { id: "catalogs", label: LABEL_CATALOGS, href: CATALOGS_PATH, count: 0 },
    { id: "news", label: LABEL_NEWS, href: NEWS_PATH, count: 0 },
  ];
  if (!trimmed) return empty;
  const normalized = trimmed.toLowerCase();

  const [participants, projects, services, catalogs, newsCount] = await Promise.all([
    fetchParticipants(trimmed, 1, language),
    safe(projectsAPI.browse(language, { search: trimmed, per_page: 1 }), { data: [], meta: { current_page: 1, last_page: 1, per_page: 0, total: 0 }, filters: { sort_options: [], categories: [], statuses: [], parameters: [] } }),
    safe(publicServicesAPI.browse(language, { search: trimmed, per_page: 1 }), { data: [], meta: { current_page: 1, last_page: 1, per_page: 0, total: 0 }, filters: { categories: [] } }),
    safe(publicCatalogsAPI.browse(language, { search: trimmed, per_page: 1 }), { data: [], meta: { current_page: 1, last_page: 1, per_page: 0, total: 0 }, filters: { categories: [] } }),
    safe(loadAllNews(language).then((items) => matchNews(items, normalized).length), 0),
  ]);

  return [
    { id: "participants", label: LABEL_PARTICIPANTS, href: PARTICIPANTS_PATH, count: participants.total },
    { id: "projects", label: LABEL_PROJECTS, href: PROJECTS_PATH, count: projects.meta.total },
    { id: "services", label: LABEL_SERVICES, href: SERVICES_PATH, count: services.meta.total },
    { id: "catalogs", label: LABEL_CATALOGS, href: CATALOGS_PATH, count: catalogs.meta.total },
    { id: "news", label: LABEL_NEWS, href: NEWS_PATH, count: newsCount },
  ];
}
