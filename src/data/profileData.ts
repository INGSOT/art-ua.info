import type { ArtistData } from "./artistsData";
import { artistsData } from "./artistsData";
import { organizationsData } from "./organizationsData";
import {
  getProjectsByAuthorId,
  type ProjectDescriptionData,
  type ProjectDetails,
} from "./projectsData";
import { teamData } from "./teamData";

// About Me
export interface Team {
  name: string;
  icon: string;
  slug: string;
}

export interface AboutMeButton {
  id: string;
  label: string;
}

export interface AboutMeData {
  name: string;
  artistType: string;
  description: string;
  avatar: string;
  teams: Team[];
  buttons: AboutMeButton[];
}

// My Projects
export interface MyProject {
  id: number;
  image: string;
  title: string;
  likes: number;
}

export interface ProjectFilterButton {
  id: string;
  text: string;
}

export const projectFilterButtons: ProjectFilterButton[] = [
  { id: "all", text: "Усі категорії" },
  { id: "newest", text: "Новіші" },
];

export const projectEmptyState = {
  message: "Тут ще нічого немає",
  subMessage: "Додайте свою першу роботу.",
  createButtonText: "Створити",
};

export const profileTexts = {
  editProfileButton: "Редагувати профіль",
};

// Profile Information
export interface ProfileSocialLink {
  icon: string;
  alt: string;
  url: string;
}

export interface ProfileInfo {
  website: string;
  socialLinks: ProfileSocialLink[];
  location: {
    country: string;
    city: string;
  };
  description: string[];
}

// My Catalogs
export interface MyCatalog {
  id: number;
  image: string;
  title: string;
  likes: number;
}

export interface CatalogsTexts {
  addCatalogButton: string;
  addCatalogButtonIconAlt: string;
  tooltip: string;
  deleteIconAlt: string;
  likeIconAlt: string;
}

export const catalogsTexts: CatalogsTexts = {
  addCatalogButton: "Додати каталог",
  addCatalogButtonIconAlt: "Plus",
  tooltip: "Зробити основним (для відображення на головній та сторінці митців).",
  deleteIconAlt: "Delete",
  likeIconAlt: "Like",
};

// Add Catalog Modal
export interface AddCatalogTexts {
  title: string;
  closeAlt: string;
  imageUploadText: string;
  imageRemoveAlt: string;
  catalogUploadText: string;
  catalogRemoveAlt: string;
  uploadIconAlt: string;
  addButton: string;
}

export const addCatalogTexts: AddCatalogTexts = {
  title: "Новий каталог",
  closeAlt: "Close",
  imageUploadText: "Додайте обкладинку.\nДобре будуть виглядати зображення зі співвідношенням 4х3.",
  imageRemoveAlt: "Remove",
  catalogUploadText: "Завантажте каталог",
  catalogRemoveAlt: "Remove catalog",
  uploadIconAlt: "Upload",
  addButton: "Додати",
};

// Delete Catalog Modal
export interface DeleteCatalogTexts {
  title: string;
  closeAlt: string;
  description: string;
  deleteButton: string;
  cancelButton: string;
}

export const deleteCatalogTexts: DeleteCatalogTexts = {
  title: "Ви видаляєте каталог",
  closeAlt: "Close",
  description: "Ви впевнені, що хочете видалити цей каталог?\nЦю дію неможливо буде відмінити.",
  deleteButton: "Так, видалити",
  cancelButton: "Ні, залишити",
};

// My Services
export interface MyService {
  id: number;
  image: string;
  buttonLabel: string;
  title: string;
}

export interface ServicesTexts {
  addServiceButton: string;
  editServiceButton: string;
}

export const servicesTexts: ServicesTexts = {
  addServiceButton: "Додати послугу",
  editServiceButton: "Редагувати послугу",
};

// Teams
export type TeamCardType = "own" | "other";

export interface TeamMember {
  name: string;
  avatar: string;
}

export interface ProfileTeam {
  id: number;
  type: TeamCardType;
  avatar: string;
  name: string;
  description: string;
  members: TeamMember[];
}

const DEFAULT_SOCIAL_LINKS: ProfileSocialLink[] = [
  { icon: "/socials/deviantart_yellow.svg", alt: "DeviantArt", url: "https://deviantart.com" },
  { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest", url: "https://pinterest.com" },
  { icon: "/socials/youtube_yellow.svg", alt: "YouTube", url: "https://youtube.com" },
  { icon: "/socials/instagram_yellow.svg", alt: "Instagram", url: "https://instagram.com" },
  { icon: "/socials/facebook_yellow.svg", alt: "Facebook", url: "https://facebook.com" },
  { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn", url: "https://linkedin.com" },
  { icon: "/socials/x_yellow.svg", alt: "X", url: "https://x.com" },
];

const LAUSHKIN_PROFILE_SLUG = "serhii-laushkin";

const LAUSHKIN_INFO_DESCRIPTION: string[] = [
  "Пан Сергій відомий як майстер графіки, Він створює жанрові символікоалегоричні картини, пейзажі, інсталяції. Для творчості Сергія Павловича характерні узагальнено-символічний характер образів, ліризм, м'яка розкута мальовнича манера.",
  "Нерідко у центрі уваги — людина, її внутрішній світ, складні емоційні переживання та філософські роздуми.",
  "Творчість Сергія Лаушкіна, має за підмурівок напрацьовані традиції багатьох поколінь, творчо переосмислені митцем, та є цілком індивідуальною, тобто справжньою.",
];

const LOCATIONS: ReadonlyArray<{ country: string; city: string }> = [
  { country: "Україна", city: "Київ" },
  { country: "Україна", city: "Львів" },
  { country: "Україна", city: "Одеса" },
  { country: "Україна", city: "Харків" },
  { country: "Україна", city: "Дніпро" },
  { country: "Україна", city: "Кривий Ріг" },
  { country: "Україна", city: "Запоріжжя" },
  { country: "Україна", city: "Вінниця" },
  { country: "Україна", city: "Полтава" },
  { country: "Україна", city: "Чернігів" },
  { country: "Україна", city: "Івано-Франківськ" },
  { country: "Україна", city: "Тернопіль" },
  { country: "Україна", city: "Ужгород" },
  { country: "Україна", city: "Суми" },
  { country: "Україна", city: "Черкаси" },
];

function getTeamsForArtist(artistId: number) {
  return teamData.filter((team) => team.members.some((member) => member.artistId === artistId));
}

function buildAboutMe(artist: ArtistData, usernameSlug: string): AboutMeData {
  const tagLine = artist.tags.slice(0, 3).join(" · ");
  const artistTeams = getTeamsForArtist(artist.id);
  return {
    name: artist.artistName,
    artistType: artist.artistType,
    description: `${artist.artistType}. ${tagLine}.`,
    avatar: artist.artistPhoto,
    teams: artistTeams.map((team) => ({
      name: team.name,
      icon: team.avatar,
      slug: team.username,
    })),
    buttons: [
      { id: "save-art", label: `save-art.in.ua/${usernameSlug}` },
      { id: "art-ua", label: `art-ua.info/${usernameSlug}` },
    ],
  };
}

function buildProfileTeams(artistId: number): ProfileTeam[] {
  const artistTeams = getTeamsForArtist(artistId);
  return artistTeams.map((team, index) => ({
    id: Number(team.id),
    type: index === 0 ? "own" : "other",
    avatar: team.avatar,
    name: team.name,
    description: team.info.description[0] ?? team.category,
    members: team.members,
  }));
}

function buildProfileInfo(artist: ArtistData, usernameSlug: string): ProfileInfo {
  const loc =
    artist.slug === LAUSHKIN_PROFILE_SLUG
      ? { country: "Україна", city: "Кам'янське" }
      : LOCATIONS[(artist.id - 1) % LOCATIONS.length];
  const t = artist.artistType.toLowerCase();
  const description =
    artist.slug === LAUSHKIN_PROFILE_SLUG
      ? LAUSHKIN_INFO_DESCRIPTION
      : [
          `${artist.artistName} — ${t}, працює з темами: ${artist.tags.join(", ")}.`,
          `У портфоліо — серії, створені в різних містах України; місто ${loc.city} залишається одним із робочих центрів.`,
          "Культурна спадщина України в контексті нових історичних подій набуває особливої актуальності; мистецтво фіксує злам епохи та глибину емоційного фону.",
          `Зараз ${artist.artistName.split(" ")[0]} зосереджується на проєктах, де ${artist.artSubCategory} перетинається з публічною розмовою та документуванням сучасності.`,
        ];
  return {
    website: `${usernameSlug}.studio`,
    socialLinks: DEFAULT_SOCIAL_LINKS.map((l) => ({ ...l })),
    location: { ...loc },
    description,
  };
}

export interface AuthorProfileBundle {
  id: number;
  slug: string;
  aboutMe: AboutMeData;
  profileInfo: ProfileInfo;
  profileTeams: ProfileTeam[];
  projectDetails: ProjectDetails;
  projectDescriptionData: ProjectDescriptionData;
}

function buildAuthorProfile(artist: ArtistData): AuthorProfileBundle {
  const usernameSlug = artist.slug;
  const authorProjects = getProjectsByAuthorId(artist.id);
  const fallbackProject = authorProjects[0] ?? getProjectsByAuthorId(1)[0];
  if (!fallbackProject) {
    throw new Error("projectsData має містити хоча б один проєкт");
  }
  return {
    id: artist.id,
    slug: usernameSlug,
    aboutMe: buildAboutMe(artist, usernameSlug),
    profileInfo: buildProfileInfo(artist, usernameSlug),
    profileTeams: buildProfileTeams(artist.id),
    projectDetails: fallbackProject.projectDetails,
    projectDescriptionData: fallbackProject.projectDescriptionData,
  };
}

const authorParticipantsData: ArtistData[] = [...artistsData, ...organizationsData];

/** Повний публічний профіль автора (відповідає запису в artistsData та organizationsData). */
export const authorProfiles: AuthorProfileBundle[] = authorParticipantsData.map((a) =>
  buildAuthorProfile(a),
);

export const DEFAULT_AUTHOR_PROFILE_ID = 1;
export const DEFAULT_AUTHOR_PROFILE_SLUG = artistsData[0]?.slug ?? "olena-kravets";

export function getAuthorProfileById(
  id: number | string | null | undefined,
): AuthorProfileBundle {
  const n =
    typeof id === "string"
      ? parseInt(id, 10)
      : id === null || id === undefined
        ? NaN
        : Number(id);
  const resolved =
    Number.isFinite(n) && authorProfiles.some((p) => p.id === n)
      ? (n as number)
      : DEFAULT_AUTHOR_PROFILE_ID;
  const found = authorProfiles.find((p) => p.id === resolved);
  return found ?? authorProfiles[0];
}

export function getAuthorProfileBySlug(
  slug: string | null | undefined,
): AuthorProfileBundle {
  const normalized = (slug ?? "").trim().toLowerCase();
  if (!normalized) {
    return getAuthorProfileById(DEFAULT_AUTHOR_PROFILE_ID);
  }

  const found = authorProfiles.find((p) => p.slug.toLowerCase() === normalized);
  return found ?? getAuthorProfileById(DEFAULT_AUTHOR_PROFILE_ID);
}

export function getAuthorSlugById(id: number): string {
  return authorProfiles.find((p) => p.id === id)?.slug ?? DEFAULT_AUTHOR_PROFILE_SLUG;
}

/** Дані редактора /profile за замовчуванням (перший митець у каталозі). */
const defaultEditorProfile = getAuthorProfileById(DEFAULT_AUTHOR_PROFILE_ID);

export const aboutMeData = defaultEditorProfile.aboutMe;
export const profileInfo = defaultEditorProfile.profileInfo;
export const profileTeams = defaultEditorProfile.profileTeams;
export const projectDetails = defaultEditorProfile.projectDetails;
export const projectDescriptionData = defaultEditorProfile.projectDescriptionData;
