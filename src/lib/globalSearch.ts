import type { ArtistData } from "../data/artistsData";
import { artistsData } from "../data/artistsData";
import { organizationsData } from "../data/organizationsData";
import type { TeamProfile } from "../data/teamData";
import { teamData } from "../data/teamData";
import type { Project } from "../data/projectsData";
import { projectsData } from "../data/projectsData";
import type { ServiceItemData } from "../data/servicesData";
import { servicesData } from "../data/servicesData";
import type { Catalog } from "../data/catalogsData";
import { catalogsData } from "../data/catalogsData";
import type { NewsItem } from "../data/newsData";
import { newsData } from "../data/newsData";

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
const NEWS_PATH = "/news_events";

const LABEL_PARTICIPANTS = "Учасники";
const LABEL_PROJECTS = "Проєкти";
const LABEL_SERVICES = "Послуги";
const LABEL_CATALOGS = "Каталоги";
const LABEL_NEWS = "Новини та події";

/** Максимум підказок загалом (щоб список не перевантажував DOM). */
const MAX_SUGGESTIONS = 60;

function normalizeQuery(raw: string): string {
  return raw.trim().toLowerCase();
}

type Participant = ArtistData | TeamProfile;

function participantMatchesQuery(participant: Participant, normalizedQuery: string): boolean {
  if (!normalizedQuery) return false;
  const name =
    "artistName" in participant ? participant.artistName : participant.name;
  const role =
    "artistType" in participant ? participant.artistType : participant.category;
  const nameMatch = name.toLowerCase().includes(normalizedQuery);
  const typeMatch = role.toLowerCase().includes(normalizedQuery);
  const tagsMatch = participant.tags.some((tag) =>
    tag.toLowerCase().includes(normalizedQuery)
  );
  return nameMatch || typeMatch || tagsMatch;
}

function projectMatchesQuery(project: Project, normalizedQuery: string): boolean {
  if (!normalizedQuery) return false;
  const titleMatch = project.title.toLowerCase().includes(normalizedQuery);
  const authorMatch = project.authorName.toLowerCase().includes(normalizedQuery);
  return titleMatch || authorMatch;
}

function serviceMatchesQuery(service: ServiceItemData, normalizedQuery: string): boolean {
  if (!normalizedQuery) return false;
  const titleMatch = service.title.toLowerCase().includes(normalizedQuery);
  const descriptionMatch = service.description.toLowerCase().includes(normalizedQuery);
  const authorOrTeamMatch = service.authorName.toLowerCase().includes(normalizedQuery);
  return titleMatch || descriptionMatch || authorOrTeamMatch;
}

function catalogMatchesQuery(catalog: Catalog, normalizedQuery: string): boolean {
  if (!normalizedQuery) return false;
  const titleMatch = catalog.title.toLowerCase().includes(normalizedQuery);
  const authorMatch = catalog.authorName.toLowerCase().includes(normalizedQuery);
  return titleMatch || authorMatch;
}

function newsMatchesQuery(item: NewsItem, normalizedQuery: string): boolean {
  if (!normalizedQuery) return false;
  return item.title.toLowerCase().includes(normalizedQuery);
}

function participantStableId(p: Participant): string {
  return "artistName" in p ? `artist-${p.id}` : `team-${p.id}`;
}

function participantDisplayName(p: Participant): string {
  return "artistName" in p ? p.artistName : p.name;
}

/** Лічильник збігів для учасників у режимі «усі» (як на /authors без фільтрів). */
export function countParticipantMatches(normalizedQuery: string): number {
  if (!normalizedQuery) return 0;
  const all = [...artistsData, ...organizationsData, ...teamData] as Participant[];
  return all.filter((p) => participantMatchesQuery(p, normalizedQuery)).length;
}

export function countProjectMatches(normalizedQuery: string): number {
  if (!normalizedQuery) return 0;
  return projectsData.filter((p) => projectMatchesQuery(p, normalizedQuery)).length;
}

export function countServiceMatches(normalizedQuery: string): number {
  if (!normalizedQuery) return 0;
  return servicesData.filter((s) => serviceMatchesQuery(s, normalizedQuery)).length;
}

export function countCatalogMatches(normalizedQuery: string): number {
  if (!normalizedQuery) return 0;
  return catalogsData.filter((c) => catalogMatchesQuery(c, normalizedQuery)).length;
}

export function countNewsMatches(normalizedQuery: string): number {
  if (!normalizedQuery) return 0;
  return newsData.filter((n) => newsMatchesQuery(n, normalizedQuery)).length;
}

/**
 * Підказки для глобального пошуку: конкретні збіги з посиланням на відповідну сторінку
 * з `?search=…` (текст пошуку — назва сутності, щоб на сторінці списку залишився релевантний набір).
 */
export function getGlobalSearchSuggestions(trimmedQuery: string): GlobalSearchSuggestion[] {
  const n = normalizeQuery(trimmedQuery);
  if (!n) return [];

  const out: GlobalSearchSuggestion[] = [];

  const participants = [...artistsData, ...organizationsData, ...teamData] as Participant[];
  for (const p of participants) {
    if (!participantMatchesQuery(p, n)) continue;
    const name = participantDisplayName(p);
    out.push({
      id: `participant-${participantStableId(p)}`,
      primary: name,
      categoryLabel: LABEL_PARTICIPANTS,
      href: buildSearchUrl(PARTICIPANTS_PATH, name),
    });
  }

  for (const project of projectsData) {
    if (!projectMatchesQuery(project, n)) continue;
    out.push({
      id: `project-${project.id}`,
      primary: project.title,
      categoryLabel: LABEL_PROJECTS,
      href: buildSearchUrl(PROJECTS_PATH, project.title),
    });
  }

  for (const service of servicesData) {
    if (!serviceMatchesQuery(service, n)) continue;
    out.push({
      id: `service-${service.id}`,
      primary: service.title,
      categoryLabel: LABEL_SERVICES,
      href: buildSearchUrl(SERVICES_PATH, service.title),
    });
  }

  for (const catalog of catalogsData) {
    if (!catalogMatchesQuery(catalog, n)) continue;
    out.push({
      id: `catalog-${catalog.id}`,
      primary: catalog.title,
      categoryLabel: LABEL_CATALOGS,
      href: buildSearchUrl(CATALOGS_PATH, catalog.title),
    });
  }

  for (const item of newsData) {
    if (!newsMatchesQuery(item, n)) continue;
    out.push({
      id: `news-${item.id}`,
      primary: item.title,
      categoryLabel: LABEL_NEWS,
      href: buildSearchUrl(NEWS_PATH, item.title),
    });
  }

  return out.slice(0, MAX_SUGGESTIONS);
}

/**
 * Підсумок пошуку по всіх розділах (логіка збігу узгоджена зі сторінками списків).
 */
export function getGlobalSearchResults(trimmedQuery: string): GlobalSearchCategoryResult[] {
  const q = normalizeQuery(trimmedQuery);

  return [
    {
      id: "participants",
      label: LABEL_PARTICIPANTS,
      href: PARTICIPANTS_PATH,
      count: countParticipantMatches(q),
    },
    {
      id: "projects",
      label: LABEL_PROJECTS,
      href: PROJECTS_PATH,
      count: countProjectMatches(q),
    },
    {
      id: "services",
      label: LABEL_SERVICES,
      href: SERVICES_PATH,
      count: countServiceMatches(q),
    },
    {
      id: "catalogs",
      label: LABEL_CATALOGS,
      href: CATALOGS_PATH,
      count: countCatalogMatches(q),
    },
    {
      id: "news",
      label: LABEL_NEWS,
      href: NEWS_PATH,
      count: countNewsMatches(q),
    },
  ];
}

export function buildSearchUrl(pathname: string, query: string): string {
  const trimmed = query.trim();
  if (!trimmed) return pathname;
  const params = new URLSearchParams();
  params.set("search", trimmed);
  return `${pathname}?${params.toString()}`;
}

/** Перший розділ з ненульовим результатом (порядок як у getGlobalSearchResults). */
export function getFirstCategoryWithResults(
  trimmedQuery: string
): GlobalSearchCategoryResult | undefined {
  return getGlobalSearchResults(trimmedQuery).find((r) => r.count > 0);
}
