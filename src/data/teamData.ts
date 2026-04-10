// Публічна сторінка команди (/team/*). Масив команд відповідає «Команда 1»…«Команда 4» на /author та /profile.
export interface TeamProject {
  id: number;
  image: string;
  title: string;
  likes: number;
}

export interface TeamMember {
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
  projects: TeamProject[];
  members: TeamMember[];
  services: TeamService[];
  info: TeamInfo;
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
    category: "Музичний гурт · інді та електроніка",
    tags: ["Інді", "Електроніка", "Живі виступи"],
    avatar: "/teams/team-photo-1.png",
    projects: [
      { id: 101, image: "/projects/project-photo-1.png", title: "Альбом «Нічні мости»", likes: 124 },
      { id: 102, image: "/gallery/big_lebovski.png", title: "Кліп «Світло в вікнах»", likes: 89 },
      { id: 103, image: "/projects/project-photo-3.png", title: "Живий сет на фестивалі", likes: 256 },
      { id: 104, image: "/gallery/autumn.png", title: "Саундтрек до короткометражки", likes: 41 },
    ],
    members: [
      { name: "Олена К.", avatar: "/artists/artist-photo-5.png" },
      { name: "Марко В.", avatar: "/artists/artist-photo-6.png" },
      { name: "Ірина С.", avatar: "/artists/artist-photo-7.png" },
    ],
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
    category: "Театральна трупа · сучасна драма",
    tags: ["Драма", "Перформанс", "Постановка"],
    avatar: "/teams/team-photo-2.png",
    projects: [
      { id: 201, image: "/projects/project-photo-2.png", title: "Вистава «Кімната без дверей»", likes: 312 },
      { id: 202, image: "/gallery/pulp_fiction.png", title: "Читка п'єси у просторі галереї", likes: 67 },
      { id: 203, image: "/gallery/mountain_landscape.png", title: "Вуличний перформанс «Лінія»", likes: 198 },
    ],
    members: [
      { name: "Андрій П.", avatar: "/artists/artist-photo-8.png" },
      { name: "Софія М.", avatar: "/artists/artist-photo-9.png" },
      { name: "Тарас Л.", avatar: "/artists/artist-photo-10.png" },
      { name: "Наталія Д.", avatar: "/artists/artist-photo-5.png" },
    ],
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
    projects: [
      { id: 301, image: "/projects/project-photo-3.png", title: "Айдентика культурного центру", likes: 445 },
      { id: 302, image: "/gallery/abstractionism.png", title: "Серія постерів до бієнале", likes: 178 },
      { id: 303, image: "/gallery/whale.png", title: "3D-інсталяція для публічного простору", likes: 92 },
      { id: 304, image: "/projects/project-photo-4.png", title: "Каталог виставки «Межі»", likes: 63 },
    ],
    members: [
      { name: "Дизайнер К.", avatar: "/artists/artist-photo-6.png" },
      { name: "Художник Р.", avatar: "/artists/artist-photo-7.png" },
    ],
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
    projects: [
      { id: 401, image: "/projects/project-photo-4.png", title: "Фільм «Східний коридор» (короткий метр)", likes: 521 },
      { id: 402, image: "/gallery/ship.png", title: "Цикл інтерв'ю про ремесло", likes: 134 },
      { id: 403, image: "/gallery/big_lebovski.png", title: "Відеоінсталяція для музею", likes: 88 },
    ],
    members: [
      { name: "Режисер В.", avatar: "/artists/artist-photo-8.png" },
      { name: "Оператор Ю.", avatar: "/artists/artist-photo-9.png" },
      { name: "Продюсер Г.", avatar: "/artists/artist-photo-10.png" },
      { name: "Монтаж М.", avatar: "/artists/artist-photo-5.png" },
      { name: "Звук К.", avatar: "/artists/artist-photo-6.png" },
    ],
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

export function getTeamById(id: string | null | undefined): TeamProfile {
  if (id == null || id === "") {
    return teamData[0];
  }
  const found = teamData.find((t) => t.id === id);
  return found ?? teamData[0];
}
