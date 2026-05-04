import type { ArtistData } from "./artistsData";
import { artistsData } from "./artistsData";
import { organizationsData } from "./organizationsData";
import { authorProfileInfoData } from "./profileInfoData";
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

/** Колекція текстів і локацій для вкладки «Інформація» (по authorId), див. `profileInfoData.ts`. */
export { authorProfileInfoData };

const profileInfoByAuthorId = new Map<number, ProfileInfo>(
  authorProfileInfoData.map((row) => [
    row.authorId,
    {
      website: row.website,
      location: { ...row.location },
      description: [...row.description],
      socialLinks: row.socialLinks.map((l) => ({ ...l })),
    },
  ]),
);

function getProfileInfoForAuthor(artistId: number): ProfileInfo {
  const info = profileInfoByAuthorId.get(artistId);
  if (!info) {
    throw new Error(
      `profileInfoData: немає запису для authorId=${artistId}. Додайте відповідний об'єкт у authorProfileInfoData.`,
    );
  }
  return {
    website: info.website,
    location: { ...info.location },
    description: [...info.description],
    socialLinks: info.socialLinks.map((l) => ({ ...l })),
  };
}

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
    profileInfo: getProfileInfoForAuthor(artist.id),
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
