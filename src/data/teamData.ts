import { artistsData } from "./artistsData";

// Публічна сторінка команди (/team/*). Масив команд відповідає «Команда 1»…«Команда 4» на /author та /profile.

export interface TeamMember {
  artistId: number;
  name: string;
  avatar: string;
}

export interface TeamSocialLink {
  icon: string;
  alt: string;
  url: string;
}

export interface TeamInfo {
  website: string;
  socialLinks: TeamSocialLink[];
  location: {
    country: string;
    city: string;
  };
  description: string[];
}

export interface TeamService {
  id: number;
  image: string;
  buttonLabel: string;
  title: string;
}

export interface TeamProfile {
  id: string;
  username: string;
  name: string;
  category: string;
  /** Теги для каталогу /authors (фільтр і пошук). */
  tags: string[];
  avatar: string;
  members: TeamMember[];
  services: TeamService[];
  info: TeamInfo;
}

function resolveTeamMembers(artistIds: number[]): TeamMember[] {
  return artistIds
    .map((artistId) => {
      const artist = artistsData.find((item) => item.id === artistId);
      if (!artist) return null;
      return {
        artistId,
        name: artist.artistName,
        avatar: artist.artistPhoto,
      };
    })
    .filter((member): member is TeamMember => member !== null);
}

export const teamProjectFilterButtons = [
  { id: "all", text: "Усі категорії" },
  { id: "new", text: "Нові" },
];

export const teamProjectEmptyState = {
  message: "Тут ще нічого немає",
};

export const teamData: TeamProfile[] = [
  {
    id: "1",
    username: "komanda-1",
    name: "Команда 1",
    category: "Музичний гурт",
    tags: ["Інді", "Електроніка", "Живі виступи"],
    avatar: "/teams/team-photo-1.png",
    members: resolveTeamMembers([1, 2, 3]),
    services: [
      {
        id: 11,
        image: "/gallery/autumn.png",
        buttonLabel: "Від 15 000 ₴",
        title: "Живий виступ (до 60 хв.) · звук та світло окремо",
      },
      {
        id: 12,
        image: "/gallery/rain.png",
        buttonLabel: "Ціна договірна",
        title: "Запис та зведення треку в нашій студії",
      },
      {
        id: 13,
        image: "/gallery/ship.png",
        buttonLabel: "Від 8 000 ₴",
        title: "Музичний супровід події або виставки",
      },
    ],
    info: {
      website: "komanda1-band.ua",
      socialLinks: [
        { icon: "/socials/youtube_yellow.svg", alt: "YouTube", url: "https://youtube.com" },
        { icon: "/socials/instagram_yellow.svg", alt: "Instagram", url: "https://instagram.com" },
        { icon: "/socials/facebook_yellow.svg", alt: "Facebook", url: "https://facebook.com" },
        { icon: "/socials/x_yellow.svg", alt: "X", url: "https://x.com" },
      ],
      location: {
        country: "Україна",
        city: "Київ",
      },
      description: [
        "Команда 1 — київський гурт, який поєднує живі інструменти з електронними текстурами. Ми граємо на сценах від камерних залів до open-air.",
        "У фокусі — українська лірика, експеримент з формою та чесна комунікація з аудиторією. Кожен проєкт для нас — спільна історія з слухачами.",
        "Співпрацюємо з візуальними художниками та режисерами; записуємо матеріал у власній студії та на локаціях.",
      ],
    },
  },
  {
    id: "2",
    username: "komanda-2",
    name: "Команда 2",
    category: "Театральна трупа",
    tags: ["Драма", "Перформанс", "Постановка"],
    avatar: "/teams/team-photo-2.png",
    members: resolveTeamMembers([4, 5, 6, 7]),
    services: [
      {
        id: 21,
        image: "/gallery/big_lebovski.png",
        buttonLabel: "Від 25 000 ₴",
        title: "Гастрольна вистава під ключ (до 90 хв.)",
      },
      {
        id: 22,
        image: "/gallery/samurai.png",
        buttonLabel: "Договірна",
        title: "Театральний воркшоп для школи чи компанії",
      },
    ],
    info: {
      website: "trupa-lviv.stage",
      socialLinks: [
        { icon: "/socials/facebook_yellow.svg", alt: "Facebook", url: "https://facebook.com" },
        { icon: "/socials/instagram_yellow.svg", alt: "Instagram", url: "https://instagram.com" },
        { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn", url: "https://linkedin.com" },
      ],
      location: {
        country: "Україна",
        city: "Львів",
      },
      description: [
        "Команда 2 збирає акторів і драматургів навколо сучасного європейського репертуару та власних текстів.",
        "Ми експериментуємо з простором глядача: від класичної рами до імерсивних форматів. Важлива тема — межа між публічним і приватним досвідом.",
        "Паралельно ведемо освітні програми та співпрацюємо з музеями й фестивалями незалежного театру.",
      ],
    },
  },
  {
    id: "3",
    username: "komanda-3",
    name: "Команда 3",
    category: "Студія візуального мистецтва та брендингу",
    tags: ["Брендинг", "Айдентика", "Графіка"],
    avatar: "/teams/team-photo-3.png",
    members: resolveTeamMembers([2, 3]),
    services: [
      {
        id: 31,
        image: "/gallery/autumn.png",
        buttonLabel: "Від 40 000 ₴",
        title: "Повний брендбук та гайдлайни для організації",
      },
      {
        id: 32,
        image: "/gallery/rain.png",
        buttonLabel: "Пакет «Старт»",
        title: "Логотип, палітра та типографіка для проєкту",
      },
      {
        id: 33,
        image: "/gallery/ship.png",
        buttonLabel: "За запитом",
        title: "Арт-дирекшн виставки або книжкового проєкту",
      },
    ],
    info: {
      website: "studio-odesa.art",
      socialLinks: [
        { icon: "/socials/instagram_yellow.svg", alt: "Instagram", url: "https://instagram.com" },
        { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest", url: "https://pinterest.com" },
        { icon: "/socials/deviantart_yellow.svg", alt: "DeviantArt", url: "https://deviantart.com" },
        { icon: "/socials/x_yellow.svg", alt: "X", url: "https://x.com" },
      ],
      location: {
        country: "Україна",
        city: "Одеса",
      },
      description: [
        "Команда 3 — одеське об'єднання дизайнерів і художників, яке працює на стику графіки, простору та цифрових медіа.",
        "Робимо візуальні системи для культурних інституцій, фестивалів та незалежних видавництв. Увага до деталі й контексту місця — наш стандарт.",
        "Окремий напрям — експериментальні постери та співпраця з кураторами сучасного мистецтва.",
      ],
    },
  },
  {
    id: "4",
    username: "komanda-4",
    name: "Команда 4",
    category: "Документальне кіно та відеопродакшн",
    tags: ["Документалістика", "Зйомка", "Монтаж"],
    avatar: "/teams/team-photo-4.png",
    members: resolveTeamMembers([8, 9, 10, 11, 12]),
    services: [
      {
        id: 41,
        image: "/gallery/pulp_fiction.png",
        buttonLabel: "Від 60 000 ₴",
        title: "Документальний ролик до 15 хвилин (зйомка + монтаж)",
      },
      {
        id: 42,
        image: "/gallery/autumn.png",
        buttonLabel: "Погодинно",
        title: "Зйомка події та швидкий монтаж highlight-відео",
      },
    ],
    info: {
      website: "film-kharkiv.docs",
      socialLinks: [
        { icon: "/socials/youtube_yellow.svg", alt: "YouTube", url: "https://youtube.com" },
        { icon: "/socials/facebook_yellow.svg", alt: "Facebook", url: "https://facebook.com" },
        { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn", url: "https://linkedin.com" },
        { icon: "/socials/instagram_yellow.svg", alt: "Instagram", url: "https://instagram.com" },
      ],
      location: {
        country: "Україна",
        city: "Харків",
      },
      description: [
        "Команда 4 знімає документальні історії про людей, професії та зміни в суспільстві. Працюємо з етикою та витримкою в кадрі.",
        "Маємо досвід копродукції з фондами та медіа; готуємо матеріали для кінофестивалів і освітніх платформ.",
        "Окремо — відеопродакшн для музеїв: інтерв'ю з митцями, запис лекцій, промо виставок.",
      ],
    },
  },
];

/** За замовчуванням — перша команда (Команда 1). */
export const defaultTeamId = teamData[0].id;
export const defaultTeamSlug = teamData[0].username;

export function getTeamById(id: string | null | undefined): TeamProfile {
  if (id == null || id === "") {
    return teamData[0];
  }
  const found = teamData.find((t) => t.id === id);
  return found ?? teamData[0];
}

export function getTeamBySlug(slug: string | null | undefined): TeamProfile {
  if (slug == null || slug === "") {
    return teamData[0];
  }
  const found = teamData.find((team) => team.username === slug);
  return found ?? teamData[0];
}
