import type { ArtistData } from "./artistsData";
import { artistsData } from "./artistsData";

// About Me
export interface Team {
  name: string;
  icon: string;
}

export interface AboutMeButton {
  id: string;
  label: string;
}

export interface AboutMeData {
  name: string;
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

// Project Details (shared for author/profile pages)
export interface ProjectTag {
  text: string;
  hasIcon: boolean;
}

export interface ProjectCharacteristic {
  name: string;
  description: string;
}

export interface ProjectDetails {
  title: string;
  tags: ProjectTag[];
  links: {
    saveArt: string;
    artUa: string;
  };
  slides: string[];
  initialLikes: number;
  characteristicsTitle: string;
  tableHeaders: {
    name: string;
    description: string;
  };
  characteristics: ProjectCharacteristic[];
}

// Project Description Page
export interface ProjectDescriptionData {
  slides: string[];
  tags: string[];
  date: string;
  title: string;
  aboutAuthor: {
    avatar: string;
    name: string;
    description: string;
    artUaLink: string;
    saveArtLink: string;
  };
  socialLinks: Array<{
    icon: string;
    alt: string;
  }>;
  descriptionText: string[];
}

// Service Details
export interface ServiceOption {
  id: string;
  label: string;
}

export interface ServiceFormField {
  id: string;
  label: string;
  placeholder: string;
  type: "text" | "email" | "tel" | "textarea";
  rows?: number;
}

export interface ServiceDetailsData {
  photo: string;
  breadcrumb: {
    authorName: string;
    section: string;
  };
  title: string;
  priceLabel: string;
  description: string[];
  options: ServiceOption[];
  formFields: ServiceFormField[];
  submitButtonLabel: string;
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

const SERVICE_FORM_FIELDS: ServiceFormField[] = [
  {
    id: "name",
    label: "Як до вас звертатись",
    placeholder: "Ваше ім'я та прізвище",
    type: "text",
  },
  {
    id: "email",
    label: "Електронна пошта",
    placeholder: "Вкажіть адресу електронної пошти",
    type: "email",
  },
  {
    id: "phone",
    label: "Телефон",
    placeholder: "Вкажіть номер телефону",
    type: "tel",
  },
  {
    id: "message",
    label: "Повідомлення",
    placeholder: "Ваше повідомлення",
    type: "textarea",
    rows: 5,
  },
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

const AUTHOR_USERNAME_SLUGS: readonly string[] = [
  "olena-kravets",
  "maksym-shevchenko",
  "iryna-melnyk",
  "andriy-sokolenko",
  "nataliia-bondar",
  "dmytro-romaniuk",
  "sofiia-tkachenko",
  "yurii-kovalenko",
  "maryna-honchar",
  "vitalii-lysenko",
  "kateryna-doroshenko",
  "pavlo-yatsenko",
  "liudmyla-chernenko",
  "taras-omelchuk",
  "alina-savchuk",
];

const ARTIST_PHOTOS = [
  "/artists/artist-photo-5.png",
  "/artists/artist-photo-6.png",
  "/artists/artist-photo-7.png",
  "/artists/artist-photo-8.png",
  "/artists/artist-photo-9.png",
  "/artists/artist-photo-10.png",
];

function pickArtistPhoto(offset: number): string {
  return ARTIST_PHOTOS[((offset % ARTIST_PHOTOS.length) + ARTIST_PHOTOS.length) % ARTIST_PHOTOS.length];
}

function buildAboutMe(artist: ArtistData, usernameSlug: string): AboutMeData {
  const tagLine = artist.tags.slice(0, 3).join(" · ");
  const teamLabels = [
    `Студія «Горизонт» · ${artist.artistType}`,
    `Резиденція «Лінія» · ${artist.tags[0] ?? "арт"}`,
    `Колектив «Піксель» · співпраця`,
    `Фестиваль «Квант» · ${artist.tags[1] ?? "сцена"}`,
  ];
  return {
    name: artist.artistName,
    description: `${artist.artistType}. ${tagLine}.`,
    avatar: artist.artistPhoto,
    teams: teamLabels.map((name, i) => ({
      name,
      icon: `/teams/team-photo-${(i % 4) + 1}.png`,
    })),
    buttons: [
      { id: "save-art", label: `save-art.in.ua/${usernameSlug}` },
      { id: "art-ua", label: `art-ua.info/${usernameSlug}` },
    ],
  };
}

function buildProfileTeams(artist: ArtistData): ProfileTeam[] {
  const base = artist.id * 1000;
  const firstName = artist.artistName.split(" ")[0];
  return [
    {
      id: base + 1,
      type: "own",
      avatar: "/teams/team-photo-1.png",
      name: `Колектив «${firstName}» · основна команда`,
      description: `Творче ядро навколо ${artist.artistName}. Фокус: ${artist.artistType.toLowerCase()}, ключові теми — ${artist.tags.slice(0, 2).join(", ")}. Працюємо з живими форматами та цифровими носіями.`,
      members: [
        { name: artist.artistName, avatar: artist.artistPhoto },
        { name: "Співавтор практики", avatar: pickArtistPhoto(artist.id + 1) },
        { name: "Продюсерка лінії", avatar: pickArtistPhoto(artist.id + 2) },
      ],
    },
    {
      id: base + 2,
      type: "other",
      avatar: "/teams/team-photo-3.png",
      name: `Партнерський проєкт «Спільна сцена»`,
      description: `Міждисциплінарна група, з якою ${firstName} реалізує спільні покази та експериментальні формати. Акцент на ${artist.tags[2] ?? "імпровізації"} та співпраці з локальними майданчиками.`,
      members: [
        { name: "Кураторка напряму", avatar: pickArtistPhoto(artist.id + 3) },
        { name: "Звукорежисер", avatar: pickArtistPhoto(artist.id + 4) },
        { name: "Художник світла", avatar: pickArtistPhoto(artist.id + 5) },
      ],
    },
  ];
}

function buildProfileInfo(artist: ArtistData, usernameSlug: string): ProfileInfo {
  const loc = LOCATIONS[(artist.id - 1) % LOCATIONS.length];
  const t = artist.artistType.toLowerCase();
  return {
    website: `${usernameSlug}.studio`,
    socialLinks: DEFAULT_SOCIAL_LINKS.map((l) => ({ ...l })),
    location: { ...loc },
    description: [
      `${artist.artistName} — ${t}, працює з темами: ${artist.tags.join(", ")}.`,
      `У портфоліо — серії, створені в різних містах України; місто ${loc.city} залишається одним із робочих центрів.`,
      "Культурна спадщина України в контексті нових історичних подій набуває особливої актуальності; мистецтво фіксує злам епохи та глибину емоційного фону.",
      `Зараз ${artist.artistName.split(" ")[0]} зосереджується на проєктах, де ${artist.artSubCategory} перетинається з публічною розмовою та документуванням сучасності.`,
    ],
  };
}

function buildProjectDetails(artist: ArtistData): ProjectDetails {
  const slides = artist.photos.map((p) => p.image).slice(0, 4);
  const tagA = artist.tags[0] ?? "Авторський проєкт";
  const tagB = artist.tags[1] ?? "У роботі";
  return {
    title: `Флагманський проєкт: ${artist.artistName}`,
    tags: [
      { text: tagA, hasIcon: false },
      { text: tagB, hasIcon: true },
    ],
    links: {
      saveArt: `Проєкт на save-art.in.ua/${AUTHOR_USERNAME_SLUGS[artist.id - 1] ?? "author"}`,
      artUa: `Проєкт на art-ua.info/${AUTHOR_USERNAME_SLUGS[artist.id - 1] ?? "author"}`,
    },
    slides: slides.length >= 4 ? slides : [...slides, "/gallery/big_lebovski.png"].slice(0, 4),
    initialLikes: 800 + artist.id * 31,
    characteristicsTitle: "Характеристики проєкту:",
    tableHeaders: { name: "Назва", description: "Опис" },
    characteristics: [
      { name: "Напрям", description: artist.artistType },
      { name: "Жанрові маркери", description: artist.tags.slice(0, 4).join(", ") },
      { name: "Автор концепції", description: artist.artistName },
      { name: "Формат", description: artist.artSubCategory },
      { name: "Статус", description: artist.id % 2 === 0 ? "Публічний показ" : "Завершений цикл" },
    ],
  };
}

function buildProjectDescriptionData(artist: ArtistData, usernameSlug: string): ProjectDescriptionData {
  const slides = [
    "/gallery/ship.png",
    "/gallery/samurai.png",
    "/gallery/whale.png",
    "/gallery/mountain_landscape.png",
  ].map((img, i) => artist.photos[i % artist.photos.length]?.image ?? img);
  return {
    slides,
    tags: [...artist.tags, artist.artistType].slice(0, 5),
    date: `${String(artist.id).padStart(2, "0")} 04 2026`,
    title: `Нотатки до серії «${artist.tags[0] ?? "Робочий цикл"}»`,
    aboutAuthor: {
      avatar: artist.artistPhoto,
      name: artist.artistName,
      description: `${artist.artistType}. ${artist.tags.slice(0, 4).join(", ")}.`,
      artUaLink: `art-ua.info/${usernameSlug}`,
      saveArtLink: `save-art.in.ua/${usernameSlug}`,
    },
    socialLinks: [
      { icon: "/socials/deviantart_yellow.svg", alt: "DeviantArt" },
      { icon: "/socials/facebook_yellow.svg", alt: "Facebook" },
      { icon: "/socials/x_yellow.svg", alt: "X" },
      { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest" },
      { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn" },
    ],
    descriptionText: [
      `Цей матеріал розкриває підхід ${artist.artistName} до теми ${artist.artistType.toLowerCase()} та роботи з тегами: ${artist.tags.join(", ")}.`,
      "Культурна спадщина України в контексті нових історичних подій набуває особливої актуальності; образотворче мистецтво фіксує злам епохи.",
      "У серії поєднані документальні деталі та вільна інтерпретація — аби зберегти живий настрій процесу.",
      `${artist.artistName.split(" ")[0]} підкреслює важливість співпраці з глядачем і відкритості матеріалу для подальших прочитань.`,
    ],
  };
}

function buildServiceDetailsData(artist: ArtistData): ServiceDetailsData {
  const photo = artist.photos[1 % artist.photos.length].image;
  return {
    photo,
    breadcrumb: {
      authorName: artist.artistName,
      section: "Послуги",
    },
    title: `Пакет послуг: ${artist.artistType} · індивідуальний формат`,
    priceLabel: artist.id % 3 === 0 ? "Ціна договірна" : `Від ${40 + artist.id * 5} 000 ₴`,
    description: [
      `Пропозиція для тих, хто шукає глибоку співпрацю з ${artist.artistName} у напрямі «${artist.artistType}».`,
      `У фокусі — ${artist.tags.slice(0, 3).join(", ")}; можливі як разові консультації, так і повний супровід.`,
      "Формат обговорюється індивідуально: від ескізу до публічної презентації.",
    ],
    options: [
      { id: `opt-a-${artist.id}`, label: `Стандартний блок · ${artist.tags[0] ?? "база"}` },
      { id: `opt-b-${artist.id}`, label: `Розширений супровід · ${artist.tags[1] ?? "преміум"}` },
    ],
    formFields: SERVICE_FORM_FIELDS.map((f) => ({ ...f })),
    submitButtonLabel: "Відправити запит",
  };
}

export interface AuthorProfileBundle {
  id: number;
  aboutMe: AboutMeData;
  profileInfo: ProfileInfo;
  profileTeams: ProfileTeam[];
  projectDetails: ProjectDetails;
  projectDescriptionData: ProjectDescriptionData;
  serviceDetailsData: ServiceDetailsData;
}

function buildAuthorProfile(artist: ArtistData): AuthorProfileBundle {
  const usernameSlug =
    AUTHOR_USERNAME_SLUGS[artist.id - 1] ?? `artist-${artist.id}`;
  return {
    id: artist.id,
    aboutMe: buildAboutMe(artist, usernameSlug),
    profileInfo: buildProfileInfo(artist, usernameSlug),
    profileTeams: buildProfileTeams(artist),
    projectDetails: buildProjectDetails(artist),
    projectDescriptionData: buildProjectDescriptionData(artist, usernameSlug),
    serviceDetailsData: buildServiceDetailsData(artist),
  };
}

/** Повний публічний профіль автора (відповідає запису в artistsData). */
export const authorProfiles: AuthorProfileBundle[] = artistsData.map((a) =>
  buildAuthorProfile(a),
);

export const DEFAULT_AUTHOR_PROFILE_ID = 1;

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

/** Дані редактора /profile за замовчуванням (перший митець у каталозі). */
const defaultEditorProfile = getAuthorProfileById(DEFAULT_AUTHOR_PROFILE_ID);

export const aboutMeData = defaultEditorProfile.aboutMe;
export const profileInfo = defaultEditorProfile.profileInfo;
export const profileTeams = defaultEditorProfile.profileTeams;
export const projectDetails = defaultEditorProfile.projectDetails;
export const projectDescriptionData = defaultEditorProfile.projectDescriptionData;
export const serviceDetailsData = defaultEditorProfile.serviceDetailsData;
