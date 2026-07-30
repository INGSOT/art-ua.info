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
import { ART_UA_COM_DOMAIN, SAVE_ART_DOMAIN, artUaComProfileUrl, saveArtProfileUrl } from "../lib/siteDomains";

// About Me
export interface Team {
  name: string;
  icon: string;
  slug: string;
}

export interface AboutMeButton {
  id: string;
  label: string;
  href: string;
  external?: boolean;
}

export interface AboutMeData {
  name: string;
  artistType: string;
  description: string;
  avatar: string;
  teams: Team[];
  buttons: AboutMeButton[];
  legalEntity?: { name: string; avatar: string } | null;
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

export const draftsEmptyState = {
  message: "У вас ще немає чернеток",
  subMessage: "Незавершені та неопубліковані проєкти зʼявляться тут.",
  createButtonText: "Створити проєкт",
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
  editIconAlt: string;
  deleteIconAlt: string;
  likeIconAlt: string;
}

export const catalogsTexts: CatalogsTexts = {
  addCatalogButton: "Додати каталог",
  addCatalogButtonIconAlt: "Plus",
  tooltip: "Зробити основним (для відображення на головній та сторінці митців).",
  editIconAlt: "Edit",
  deleteIconAlt: "Delete",
  likeIconAlt: "Like",
};

export const catalogEmptyState = {
  message: "Тут ще нічого немає",
  subMessage: "Додайте свій перший каталог.",
  createButtonText: "Додати каталог",
};

// Add Catalog Modal
export interface AddCatalogTexts {
  title: string;
  editTitle: string;
  closeAlt: string;
  titleUkLabel: string;
  titleUkPlaceholder: string;
  titleEnLabel: string;
  titleEnPlaceholder: string;
  categoryLabel: string;
  categoryPlaceholder: string;
  imageUploadText: string;
  imageRemoveAlt: string;
  catalogUploadText: string;
  catalogRemoveAlt: string;
  uploadIconAlt: string;
  addButton: string;
  saveButton: string;
}

export const addCatalogTexts: AddCatalogTexts = {
  title: "Новий каталог",
  editTitle: "Редагувати каталог",
  closeAlt: "Close",
  titleUkLabel: "Назва каталогу (укр.)",
  titleUkPlaceholder: "Введіть назву українською",
  titleEnLabel: "Назва каталогу (англ.)",
  titleEnPlaceholder: "Введіть назву англійською",
  categoryLabel: "Галузь мистецтва",
  categoryPlaceholder: "Оберіть галузь мистецтва",
  imageUploadText: "Додайте обкладинку.\nДобре будуть виглядати зображення зі співвідношенням 4х3.",
  imageRemoveAlt: "Remove",
  catalogUploadText: "Завантажте каталог",
  catalogRemoveAlt: "Remove catalog",
  uploadIconAlt: "Upload",
  addButton: "Додати",
  saveButton: "Зберегти",
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

export const serviceEmptyState = {
  message: "Тут ще нічого немає",
  subMessage: "Додайте свою першу послугу.",
  createButtonText: "Додати послугу",
};

// Delete Service Modal
export const deleteServiceTexts: DeleteCatalogTexts = {
  title: "Ви видаляєте послугу",
  closeAlt: "Close",
  description: "Ви впевнені, що хочете видалити цю послугу?\nЦю дію неможливо буде відмінити.",
  deleteButton: "Так, видалити",
  cancelButton: "Ні, залишити",
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

export const teamEmptyState = {
  message: "Тут ще нічого немає",
  subMessage: "Створіть свою першу команду.",
  createButtonText: "Створити команду",
};

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
      {
        id: "save-art",
        label: SAVE_ART_DOMAIN,
        href: saveArtProfileUrl(usernameSlug),
        external: true,
      },
      {
        id: "art-ua",
        label: ART_UA_COM_DOMAIN,
        href: artUaComProfileUrl(usernameSlug),
        external: true,
      },
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
