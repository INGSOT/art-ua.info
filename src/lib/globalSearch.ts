import { artistsData } from "../data/artistsData";
import { organizationsData } from "../data/organizationsData";
import { teamData } from "../data/teamData";
import { projectsData } from "../data/projectsData";
import { servicesData } from "../data/servicesData";
import { catalogsData } from "../data/catalogsData";
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

const PARTICIPANTS_PATH = "/authors";
const PROJECTS_PATH = "/projects";
const SERVICES_PATH = "/services";
const CATALOGS_PATH = "/catalogs";
const NEWS_PATH = "/news_events";

function normalizeQuery(raw: string): string {
  return raw.trim().toLowerCase();
}

/** Лічильник збігів для учасників у режимі «усі» (як на /authors без фільтрів). */
export function countParticipantMatches(normalizedQuery: string): number {
  if (!normalizedQuery) return 0;

  const all = [...artistsData, ...organizationsData, ...teamData];

  return all.filter((participant) => {
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
  }).length;
}

/** Усі послуги з дефолтними фільтрами сторінки — лише текстовий пошук. */
export function countProjectMatches(normalizedQuery: string): number {
  if (!normalizedQuery) return 0;
  return projectsData.filter((project) => {
    const titleMatch = project.title.toLowerCase().includes(normalizedQuery);
    const authorMatch = project.authorName.toLowerCase().includes(normalizedQuery);
    return titleMatch || authorMatch;
  }).length;
}

export function countServiceMatches(normalizedQuery: string): number {
  if (!normalizedQuery) return 0;
  return servicesData.filter((service) => {
    const titleMatch = service.title.toLowerCase().includes(normalizedQuery);
    const descriptionMatch = service.description
      .toLowerCase()
      .includes(normalizedQuery);
    const authorOrTeamMatch = service.authorName
      .toLowerCase()
      .includes(normalizedQuery);
    return titleMatch || descriptionMatch || authorOrTeamMatch;
  }).length;
}

export function countCatalogMatches(normalizedQuery: string): number {
  if (!normalizedQuery) return 0;
  return catalogsData.filter((catalog) => {
    const titleMatch = catalog.title.toLowerCase().includes(normalizedQuery);
    const authorMatch = catalog.authorName.toLowerCase().includes(normalizedQuery);
    return titleMatch || authorMatch;
  }).length;
}

export function countNewsMatches(normalizedQuery: string): number {
  if (!normalizedQuery) return 0;
  return newsData.filter((item) =>
    item.title.toLowerCase().includes(normalizedQuery)
  ).length;
}

/**
 * Підсумок пошуку по всіх розділах (логіка збігу узгоджена зі сторінками списків).
 */
export function getGlobalSearchResults(trimmedQuery: string): GlobalSearchCategoryResult[] {
  const q = normalizeQuery(trimmedQuery);

  return [
    {
      id: "participants",
      label: "Учасники",
      href: PARTICIPANTS_PATH,
      count: countParticipantMatches(q),
    },
    {
      id: "projects",
      label: "Проєкти",
      href: PROJECTS_PATH,
      count: countProjectMatches(q),
    },
    {
      id: "services",
      label: "Послуги",
      href: SERVICES_PATH,
      count: countServiceMatches(q),
    },
    {
      id: "catalogs",
      label: "Каталоги",
      href: CATALOGS_PATH,
      count: countCatalogMatches(q),
    },
    {
      id: "news",
      label: "Новини та події",
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
