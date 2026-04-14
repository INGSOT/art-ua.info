import { artistsData } from "./artistsData";

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

export interface Project {
  id: number;
  authorId: number;
  image: string;
  title: string;
  slug: string;
  date: string;
  artSubCategory: string;
  likes: number;
  authorAvatar: string;
  authorName: string;
  projectDetails: ProjectDetails;
  projectDescriptionData: ProjectDescriptionData;
}

const artistById = new Map(artistsData.map((artist) => [artist.id, artist]));

const getProjectAuthor = (projectId: number) => {
  const artist = artistById.get(projectId);

  return {
    authorAvatar: artist?.artistPhoto ?? "",
    authorName: artist?.artistName ?? "",
  };
};

const getProjectAboutAuthor = (authorId: number): ProjectDescriptionData["aboutAuthor"] => {
  const artist = artistById.get(authorId);
  const slug = artist?.slug ?? "";

  return {
    avatar: artist?.artistPhoto ?? "",
    name: artist?.artistName ?? "",
    description: artist?.artistType ?? "",
    artUaLink: slug ? `art-ua.info/${slug}` : "",
    saveArtLink: slug ? `save-art.in.ua/${slug}` : "",
  };
};

export const projectsData: Project[] = [
  {
    id: 1,
    authorId: 1,
    image: "/projects/project-photo-1.png",
    title: "Ранкове світло",
    slug: "rankove-svitlo",
    date: "12.01.2026",
    artSubCategory: "painting",
    likes: 17,
    ...getProjectAuthor(1),
    projectDetails: {
      title: "Ранкове світло",
      tags: [{ text: "painting", hasIcon: false }, { text: "Авторський проєкт", hasIcon: true }],
      links: { saveArt: "Проєкт на save-art.in.ua/olena-kravets", artUa: "Проєкт на art-ua.info/olena-kravets" },
      slides: ["/gallery/ship.png", "/gallery/samurai.png", "/gallery/whale.png", "/gallery/mountain_landscape.png"],
      initialLikes: 831,
      characteristicsTitle: "Характеристики проєкту:",
      tableHeaders: { name: "Назва", description: "Опис" },
      characteristics: [
        { name: "Напрям", description: "painting" },
        { name: "Жанрові маркери", description: "painting, Авторський проєкт" },
        { name: "Автор концепції", description: "Олена Кравець" },
        { name: "Формат", description: "painting" },
        { name: "Статус", description: "Завершений цикл" },
      ],
    },
    projectDescriptionData: {
      slides: ["/gallery/ship.png", "/gallery/samurai.png", "/gallery/whale.png", "/gallery/mountain_landscape.png"],
      tags: ["painting", "Авторський проєкт", "Ранкове світло"],
      date: "01 04 2026",
      title: "Нотатки до серії «Ранкове світло»",
      aboutAuthor: {
        avatar: "/artists/artist-photo-5.png",
        name: "Олена Кравець",
        description: "painting. Ранкове світло, авторський проєкт.",
        artUaLink: "art-ua.info/olena-kravets",
        saveArtLink: "save-art.in.ua/olena-kravets",
      },
      socialLinks: [
        { icon: "/socials/deviantart_yellow.svg", alt: "DeviantArt" },
        { icon: "/socials/facebook_yellow.svg", alt: "Facebook" },
        { icon: "/socials/x_yellow.svg", alt: "X" },
        { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest" },
        { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn" },
      ],
      descriptionText: [
        "Цей матеріал розкриває авторський підхід до роботи з кольором, композицією та ритмом.",
        "Культурна спадщина України в контексті нових історичних подій набуває особливої актуальності; образотворче мистецтво фіксує злам епохи.",
        "У серії поєднані документальні деталі та вільна інтерпретація — аби зберегти живий настрій процесу.",
        "Проєкт відкритий до нових прочитань і діалогу з глядачем.",
      ],
    },
  },
  {
    id: 2,
    authorId: 2,
    image: "/projects/project-photo-2.png",
    title: "Політ кольору",
    slug: "polit-koloru",
    date: "18.01.2026",
    artSubCategory: "painting",
    likes: 17,
    ...getProjectAuthor(2),
    projectDetails: {
      title: "Політ кольору",
      tags: [{ text: "painting", hasIcon: false }, { text: "Авторський проєкт", hasIcon: true }],
      links: { saveArt: "Проєкт на save-art.in.ua/maksym-shevchenko", artUa: "Проєкт на art-ua.info/maksym-shevchenko" },
      slides: ["/gallery/samurai.png", "/gallery/whale.png", "/gallery/mountain_landscape.png", "/gallery/ship.png"],
      initialLikes: 862,
      characteristicsTitle: "Характеристики проєкту:",
      tableHeaders: { name: "Назва", description: "Опис" },
      characteristics: [
        { name: "Напрям", description: "painting" },
        { name: "Жанрові маркери", description: "painting, Авторський проєкт" },
        { name: "Автор концепції", description: "Максим Шевченко" },
        { name: "Формат", description: "painting" },
        { name: "Статус", description: "Публічний показ" },
      ],
    },
    projectDescriptionData: {
      slides: ["/gallery/samurai.png", "/gallery/whale.png", "/gallery/mountain_landscape.png", "/gallery/ship.png"],
      tags: ["painting", "Авторський проєкт", "Політ кольору"],
      date: "02 04 2026",
      title: "Нотатки до серії «Політ кольору»",
      aboutAuthor: {
        avatar: "/artists/artist-photo-6.png",
        name: "Максим Шевченко",
        description: "painting. Політ кольору, авторський проєкт.",
        artUaLink: "art-ua.info/maksym-shevchenko",
        saveArtLink: "save-art.in.ua/maksym-shevchenko",
      },
      socialLinks: [
        { icon: "/socials/deviantart_yellow.svg", alt: "DeviantArt" },
        { icon: "/socials/facebook_yellow.svg", alt: "Facebook" },
        { icon: "/socials/x_yellow.svg", alt: "X" },
        { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest" },
        { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn" },
      ],
      descriptionText: [
        "Серія досліджує взаємодію світла й кольору через контрастні пластичні рішення.",
        "Культурна спадщина України в контексті нових історичних подій набуває особливої актуальності; образотворче мистецтво фіксує злам епохи.",
        "У серії поєднані документальні деталі та вільна інтерпретація — аби зберегти живий настрій процесу.",
        "Проєкт відкритий до нових прочитань і діалогу з глядачем.",
      ],
    },
  },
  {
    id: 3,
    authorId: 3,
    image: "/projects/project-photo-3.png",
    title: "«Камінний подих»",
    slug: "kaminnyi-podykh",
    date: "25.01.2026",
    artSubCategory: "sculpture",
    likes: 35,
    ...getProjectAuthor(3),
    projectDetails: {
      title: "«Камінний подих»",
      tags: [{ text: "sculpture", hasIcon: false }, { text: "Авторський проєкт", hasIcon: true }],
      links: { saveArt: "Проєкт на save-art.in.ua/iryna-melnyk", artUa: "Проєкт на art-ua.info/iryna-melnyk" },
      slides: ["/gallery/whale.png", "/gallery/mountain_landscape.png", "/gallery/ship.png", "/gallery/samurai.png"],
      initialLikes: 893,
      characteristicsTitle: "Характеристики проєкту:",
      tableHeaders: { name: "Назва", description: "Опис" },
      characteristics: [
        { name: "Напрям", description: "sculpture" },
        { name: "Жанрові маркери", description: "sculpture, Авторський проєкт" },
        { name: "Автор концепції", description: "Ірина Мельник" },
        { name: "Формат", description: "sculpture" },
        { name: "Статус", description: "Завершений цикл" },
      ],
    },
    projectDescriptionData: {
      slides: ["/gallery/whale.png", "/gallery/mountain_landscape.png", "/gallery/ship.png", "/gallery/samurai.png"],
      tags: ["sculpture", "Авторський проєкт", "Камінний подих"],
      date: "03 04 2026",
      title: "Нотатки до серії «Камінний подих»",
      aboutAuthor: {
        avatar: "/artists/artist-photo-7.png",
        name: "Ірина Мельник",
        description: "sculpture. Камінний подих, авторський проєкт.",
        artUaLink: "art-ua.info/iryna-melnyk",
        saveArtLink: "save-art.in.ua/iryna-melnyk",
      },
      socialLinks: [
        { icon: "/socials/deviantart_yellow.svg", alt: "DeviantArt" },
        { icon: "/socials/facebook_yellow.svg", alt: "Facebook" },
        { icon: "/socials/x_yellow.svg", alt: "X" },
        { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest" },
        { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn" },
      ],
      descriptionText: [
        "Проєкт досліджує матеріальність форми та стан напруги між об'ємом і порожнечею.",
        "Культурна спадщина України в контексті нових історичних подій набуває особливої актуальності; образотворче мистецтво фіксує злам епохи.",
        "У серії поєднані документальні деталі та вільна інтерпретація — аби зберегти живий настрій процесу.",
        "Проєкт відкритий до нових прочитань і діалогу з глядачем.",
      ],
    },
  },
  {
    id: 4,
    authorId: 4,
    image: "/projects/project-photo-4.png",
    title: "«Форма тиші»",
    slug: "forma-tyshi",
    date: "02.02.2026",
    artSubCategory: "sculpture",
    likes: 17,
    ...getProjectAuthor(4),
    projectDetails: {
      title: "«Форма тиші»",
      tags: [{ text: "sculpture", hasIcon: false }, { text: "Авторський проєкт", hasIcon: true }],
      links: { saveArt: "Проєкт на save-art.in.ua/andriy-sokolenko", artUa: "Проєкт на art-ua.info/andriy-sokolenko" },
      slides: ["/gallery/mountain_landscape.png", "/gallery/ship.png", "/gallery/samurai.png", "/gallery/whale.png"],
      initialLikes: 924,
      characteristicsTitle: "Характеристики проєкту:",
      tableHeaders: { name: "Назва", description: "Опис" },
      characteristics: [
        { name: "Напрям", description: "sculpture" },
        { name: "Жанрові маркери", description: "sculpture, Авторський проєкт" },
        { name: "Автор концепції", description: "Андрій Соколенко" },
        { name: "Формат", description: "sculpture" },
        { name: "Статус", description: "Публічний показ" },
      ],
    },
    projectDescriptionData: {
      slides: ["/gallery/mountain_landscape.png", "/gallery/ship.png", "/gallery/samurai.png", "/gallery/whale.png"],
      tags: ["sculpture", "Авторський проєкт", "Форма тиші"],
      date: "04 04 2026",
      title: "Нотатки до серії «Форма тиші»",
      aboutAuthor: {
        avatar: "/artists/artist-photo-8.png",
        name: "Андрій Соколенко",
        description: "sculpture. Форма тиші, авторський проєкт.",
        artUaLink: "art-ua.info/andriy-sokolenko",
        saveArtLink: "save-art.in.ua/andriy-sokolenko",
      },
      socialLinks: [
        { icon: "/socials/deviantart_yellow.svg", alt: "DeviantArt" },
        { icon: "/socials/facebook_yellow.svg", alt: "Facebook" },
        { icon: "/socials/x_yellow.svg", alt: "X" },
        { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest" },
        { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn" },
      ],
      descriptionText: [
        "Серія будується на стриманій пластичній мові та акуратному балансі мас.",
        "Культурна спадщина України в контексті нових історичних подій набуває особливої актуальності; образотворче мистецтво фіксує злам епохи.",
        "У серії поєднані документальні деталі та вільна інтерпретація — аби зберегти живий настрій процесу.",
        "Проєкт відкритий до нових прочитань і діалогу з глядачем.",
      ],
    },
  },
  {
    id: 5,
    authorId: 5,
    image: "/projects/project-photo-1.png",
    title: "Контур міста",
    slug: "kontur-mista",
    date: "09.02.2026",
    artSubCategory: "graphics",
    likes: 22,
    ...getProjectAuthor(5),
    projectDetails: {
      title: "Контур міста",
      tags: [{ text: "graphics", hasIcon: false }, { text: "Авторський проєкт", hasIcon: true }],
      links: { saveArt: "Проєкт на save-art.in.ua/nataliia-bondar", artUa: "Проєкт на art-ua.info/nataliia-bondar" },
      slides: ["/gallery/ship.png", "/gallery/whale.png", "/gallery/mountain_landscape.png", "/gallery/samurai.png"],
      initialLikes: 955,
      characteristicsTitle: "Характеристики проєкту:",
      tableHeaders: { name: "Назва", description: "Опис" },
      characteristics: [
        { name: "Напрям", description: "graphics" },
        { name: "Жанрові маркери", description: "graphics, Авторський проєкт" },
        { name: "Автор концепції", description: "Наталія Бондар" },
        { name: "Формат", description: "graphics" },
        { name: "Статус", description: "Завершений цикл" },
      ],
    },
    projectDescriptionData: {
      slides: ["/gallery/ship.png", "/gallery/whale.png", "/gallery/mountain_landscape.png", "/gallery/samurai.png"],
      tags: ["graphics", "Авторський проєкт", "Контур міста"],
      date: "05 04 2026",
      title: "Нотатки до серії «Контур міста»",
      aboutAuthor: {
        avatar: "/artists/artist-photo-9.png",
        name: "Наталія Бондар",
        description: "graphics. Контур міста, авторський проєкт.",
        artUaLink: "art-ua.info/nataliia-bondar",
        saveArtLink: "save-art.in.ua/nataliia-bondar",
      },
      socialLinks: [
        { icon: "/socials/deviantart_yellow.svg", alt: "DeviantArt" },
        { icon: "/socials/facebook_yellow.svg", alt: "Facebook" },
        { icon: "/socials/x_yellow.svg", alt: "X" },
        { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest" },
        { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn" },
      ],
      descriptionText: [
        "Проєкт збирає урбаністичні ритми у лаконічну графічну систему.",
        "Культурна спадщина України в контексті нових історичних подій набуває особливої актуальності; образотворче мистецтво фіксує злам епохи.",
        "У серії поєднані документальні деталі та вільна інтерпретація — аби зберегти живий настрій процесу.",
        "Проєкт відкритий до нових прочитань і діалогу з глядачем.",
      ],
    },
  },
  {
    id: 6,
    authorId: 6,
    image: "/projects/project-photo-2.png",
    title: "Графічний імпульс",
    slug: "hrafichnyi-impuls",
    date: "16.02.2026",
    artSubCategory: "graphics",
    likes: 19,
    ...getProjectAuthor(6),
    projectDetails: {
      title: "Графічний імпульс",
      tags: [{ text: "graphics", hasIcon: false }, { text: "Авторський проєкт", hasIcon: true }],
      links: { saveArt: "Проєкт на save-art.in.ua/dmytro-romaniuk", artUa: "Проєкт на art-ua.info/dmytro-romaniuk" },
      slides: ["/gallery/samurai.png", "/gallery/ship.png", "/gallery/whale.png", "/gallery/mountain_landscape.png"],
      initialLikes: 986,
      characteristicsTitle: "Характеристики проєкту:",
      tableHeaders: { name: "Назва", description: "Опис" },
      characteristics: [
        { name: "Напрям", description: "graphics" },
        { name: "Жанрові маркери", description: "graphics, Авторський проєкт" },
        { name: "Автор концепції", description: "Дмитро Романюк" },
        { name: "Формат", description: "graphics" },
        { name: "Статус", description: "Публічний показ" },
      ],
    },
    projectDescriptionData: {
      slides: ["/gallery/samurai.png", "/gallery/ship.png", "/gallery/whale.png", "/gallery/mountain_landscape.png"],
      tags: ["graphics", "Авторський проєкт", "Графічний імпульс"],
      date: "06 04 2026",
      title: "Нотатки до серії «Графічний імпульс»",
      aboutAuthor: {
        avatar: "/artists/artist-photo-10.png",
        name: "Дмитро Романюк",
        description: "graphics. Графічний імпульс, авторський проєкт.",
        artUaLink: "art-ua.info/dmytro-romaniuk",
        saveArtLink: "save-art.in.ua/dmytro-romaniuk",
      },
      socialLinks: [
        { icon: "/socials/deviantart_yellow.svg", alt: "DeviantArt" },
        { icon: "/socials/facebook_yellow.svg", alt: "Facebook" },
        { icon: "/socials/x_yellow.svg", alt: "X" },
        { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest" },
        { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn" },
      ],
      descriptionText: [
        "Ключова тема серії - швидка візуальна реакція на події часу.",
        "Культурна спадщина України в контексті нових історичних подій набуває особливої актуальності; образотворче мистецтво фіксує злам епохи.",
        "У серії поєднані документальні деталі та вільна інтерпретація — аби зберегти живий настрій процесу.",
        "Проєкт відкритий до нових прочитань і діалогу з глядачем.",
      ],
    },
  },
  {
    id: 7,
    authorId: 7,
    image: "/projects/project-photo-3.png",
    title: "Світло в об'єктиві",
    slug: "svitlo-v-obiektyvi",
    date: "23.02.2026",
    artSubCategory: "art-photography",
    likes: 28,
    ...getProjectAuthor(7),
    projectDetails: {
      title: "Світло в об'єктиві",
      tags: [{ text: "art-photography", hasIcon: false }, { text: "Авторський проєкт", hasIcon: true }],
      links: { saveArt: "Проєкт на save-art.in.ua/sofiia-tkachenko", artUa: "Проєкт на art-ua.info/sofiia-tkachenko" },
      slides: ["/gallery/whale.png", "/gallery/ship.png", "/gallery/samurai.png", "/gallery/mountain_landscape.png"],
      initialLikes: 1017,
      characteristicsTitle: "Характеристики проєкту:",
      tableHeaders: { name: "Назва", description: "Опис" },
      characteristics: [
        { name: "Напрям", description: "art-photography" },
        { name: "Жанрові маркери", description: "art-photography, Авторський проєкт" },
        { name: "Автор концепції", description: "Софія Ткаченко" },
        { name: "Формат", description: "art-photography" },
        { name: "Статус", description: "Завершений цикл" },
      ],
    },
    projectDescriptionData: {
      slides: ["/gallery/whale.png", "/gallery/ship.png", "/gallery/samurai.png", "/gallery/mountain_landscape.png"],
      tags: ["art-photography", "Авторський проєкт", "Світло в об'єктиві"],
      date: "07 04 2026",
      title: "Нотатки до серії «Світло в об'єктиві»",
      aboutAuthor: {
        avatar: "/artists/artist-photo-5.png",
        name: "Софія Ткаченко",
        description: "art-photography. Світло в об'єктиві, авторський проєкт.",
        artUaLink: "art-ua.info/sofiia-tkachenko",
        saveArtLink: "save-art.in.ua/sofiia-tkachenko",
      },
      socialLinks: [
        { icon: "/socials/deviantart_yellow.svg", alt: "DeviantArt" },
        { icon: "/socials/facebook_yellow.svg", alt: "Facebook" },
        { icon: "/socials/x_yellow.svg", alt: "X" },
        { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest" },
        { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn" },
      ],
      descriptionText: [
        "Серія концентрується на роботі зі світлом як драматургічним елементом кадру.",
        "Культурна спадщина України в контексті нових історичних подій набуває особливої актуальності; образотворче мистецтво фіксує злам епохи.",
        "У серії поєднані документальні деталі та вільна інтерпретація — аби зберегти живий настрій процесу.",
        "Проєкт відкритий до нових прочитань і діалогу з глядачем.",
      ],
    },
  },
  {
    id: 8,
    authorId: 8,
    image: "/projects/project-photo-4.png",
    title: "Мовчання кадру",
    slug: "movchannia-kadru",
    date: "01.03.2026",
    artSubCategory: "art-photography",
    likes: 31,
    ...getProjectAuthor(8),
    projectDetails: {
      title: "Мовчання кадру",
      tags: [{ text: "art-photography", hasIcon: false }, { text: "Авторський проєкт", hasIcon: true }],
      links: { saveArt: "Проєкт на save-art.in.ua/yurii-kovalenko", artUa: "Проєкт на art-ua.info/yurii-kovalenko" },
      slides: ["/gallery/mountain_landscape.png", "/gallery/whale.png", "/gallery/ship.png", "/gallery/samurai.png"],
      initialLikes: 1048,
      characteristicsTitle: "Характеристики проєкту:",
      tableHeaders: { name: "Назва", description: "Опис" },
      characteristics: [
        { name: "Напрям", description: "art-photography" },
        { name: "Жанрові маркери", description: "art-photography, Авторський проєкт" },
        { name: "Автор концепції", description: "Юрій Коваленко" },
        { name: "Формат", description: "art-photography" },
        { name: "Статус", description: "Публічний показ" },
      ],
    },
    projectDescriptionData: {
      slides: ["/gallery/mountain_landscape.png", "/gallery/whale.png", "/gallery/ship.png", "/gallery/samurai.png"],
      tags: ["art-photography", "Авторський проєкт", "Мовчання кадру"],
      date: "08 04 2026",
      title: "Нотатки до серії «Мовчання кадру»",
      aboutAuthor: {
        avatar: "/artists/artist-photo-6.png",
        name: "Юрій Коваленко",
        description: "art-photography. Мовчання кадру, авторський проєкт.",
        artUaLink: "art-ua.info/yurii-kovalenko",
        saveArtLink: "save-art.in.ua/yurii-kovalenko",
      },
      socialLinks: [
        { icon: "/socials/deviantart_yellow.svg", alt: "DeviantArt" },
        { icon: "/socials/facebook_yellow.svg", alt: "Facebook" },
        { icon: "/socials/x_yellow.svg", alt: "X" },
        { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest" },
        { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn" },
      ],
      descriptionText: [
        "У центрі серії - тиша як повноцінний візуальний мотив.",
        "Культурна спадщина України в контексті нових історичних подій набуває особливої актуальності; образотворче мистецтво фіксує злам епохи.",
        "У серії поєднані документальні деталі та вільна інтерпретація — аби зберегти живий настрій процесу.",
        "Проєкт відкритий до нових прочитань і діалогу з глядачем.",
      ],
    },
  },
  {
    id: 9,
    authorId: 9,
    image: "/projects/project-photo-1.png",
    title: "Монтаж ритму",
    slug: "montazh-rytmu",
    date: "07.03.2026",
    artSubCategory: "video-editing",
    likes: 15,
    ...getProjectAuthor(9),
    projectDetails: {
      title: "Монтаж ритму",
      tags: [{ text: "video-editing", hasIcon: false }, { text: "Авторський проєкт", hasIcon: true }],
      links: { saveArt: "Проєкт на save-art.in.ua/maryna-honchar", artUa: "Проєкт на art-ua.info/maryna-honchar" },
      slides: ["/gallery/ship.png", "/gallery/samurai.png", "/gallery/whale.png", "/gallery/mountain_landscape.png"],
      initialLikes: 1079,
      characteristicsTitle: "Характеристики проєкту:",
      tableHeaders: { name: "Назва", description: "Опис" },
      characteristics: [
        { name: "Напрям", description: "video-editing" },
        { name: "Жанрові маркери", description: "video-editing, Авторський проєкт" },
        { name: "Автор концепції", description: "Марина Гончар" },
        { name: "Формат", description: "video-editing" },
        { name: "Статус", description: "Завершений цикл" },
      ],
    },
    projectDescriptionData: {
      slides: ["/gallery/ship.png", "/gallery/samurai.png", "/gallery/whale.png", "/gallery/mountain_landscape.png"],
      tags: ["video-editing", "Авторський проєкт", "Монтаж ритму"],
      date: "09 04 2026",
      title: "Нотатки до серії «Монтаж ритму»",
      aboutAuthor: {
        avatar: "/artists/artist-photo-7.png",
        name: "Марина Гончар",
        description: "video-editing. Монтаж ритму, авторський проєкт.",
        artUaLink: "art-ua.info/maryna-honchar",
        saveArtLink: "save-art.in.ua/maryna-honchar",
      },
      socialLinks: [
        { icon: "/socials/deviantart_yellow.svg", alt: "DeviantArt" },
        { icon: "/socials/facebook_yellow.svg", alt: "Facebook" },
        { icon: "/socials/x_yellow.svg", alt: "X" },
        { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest" },
        { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn" },
      ],
      descriptionText: [
        "Проєкт досліджує ритм монтажу як інструмент емоційного керування увагою.",
        "Культурна спадщина України в контексті нових історичних подій набуває особливої актуальності; образотворче мистецтво фіксує злам епохи.",
        "У серії поєднані документальні деталі та вільна інтерпретація — аби зберегти живий настрій процесу.",
        "Проєкт відкритий до нових прочитань і діалогу з глядачем.",
      ],
    },
  },
  {
    id: 10,
    authorId: 10,
    image: "/projects/project-photo-2.png",
    title: "Кадр за кадром",
    slug: "kadr-za-kadrom",
    date: "10.03.2026",
    artSubCategory: "video-editing",
    likes: 24,
    ...getProjectAuthor(10),
    projectDetails: {
      title: "Кадр за кадром",
      tags: [{ text: "video-editing", hasIcon: false }, { text: "Авторський проєкт", hasIcon: true }],
      links: { saveArt: "Проєкт на save-art.in.ua/vitalii-lysenko", artUa: "Проєкт на art-ua.info/vitalii-lysenko" },
      slides: ["/gallery/samurai.png", "/gallery/whale.png", "/gallery/mountain_landscape.png", "/gallery/ship.png"],
      initialLikes: 1110,
      characteristicsTitle: "Характеристики проєкту:",
      tableHeaders: { name: "Назва", description: "Опис" },
      characteristics: [
        { name: "Напрям", description: "video-editing" },
        { name: "Жанрові маркери", description: "video-editing, Авторський проєкт" },
        { name: "Автор концепції", description: "Віталій Лисенко" },
        { name: "Формат", description: "video-editing" },
        { name: "Статус", description: "Публічний показ" },
      ],
    },
    projectDescriptionData: {
      slides: ["/gallery/samurai.png", "/gallery/whale.png", "/gallery/mountain_landscape.png", "/gallery/ship.png"],
      tags: ["video-editing", "Авторський проєкт", "Кадр за кадром"],
      date: "10 04 2026",
      title: "Нотатки до серії «Кадр за кадром»",
      aboutAuthor: {
        avatar: "/artists/artist-photo-8.png",
        name: "Віталій Лисенко",
        description: "video-editing. Кадр за кадром, авторський проєкт.",
        artUaLink: "art-ua.info/vitalii-lysenko",
        saveArtLink: "save-art.in.ua/vitalii-lysenko",
      },
      socialLinks: [
        { icon: "/socials/deviantart_yellow.svg", alt: "DeviantArt" },
        { icon: "/socials/facebook_yellow.svg", alt: "Facebook" },
        { icon: "/socials/x_yellow.svg", alt: "X" },
        { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest" },
        { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn" },
      ],
      descriptionText: [
        "Серія показує побудову оповіді через мікрорухи та зміну ракурсів.",
        "Культурна спадщина України в контексті нових історичних подій набуває особливої актуальності; образотворче мистецтво фіксує злам епохи.",
        "У серії поєднані документальні деталі та вільна інтерпретація — аби зберегти живий настрій процесу.",
        "Проєкт відкритий до нових прочитань і діалогу з глядачем.",
      ],
    },
  },
  {
    id: 11,
    authorId: 11,
    image: "/projects/project-photo-3.png",
    title: "Після заходу",
    slug: "pislia-zakhodu",
    date: "14.03.2026",
    artSubCategory: "cinema",
    likes: 18,
    ...getProjectAuthor(11),
    projectDetails: {
      title: "Після заходу",
      tags: [{ text: "cinema", hasIcon: false }, { text: "Авторський проєкт", hasIcon: true }],
      links: { saveArt: "Проєкт на save-art.in.ua/kateryna-doroshenko", artUa: "Проєкт на art-ua.info/kateryna-doroshenko" },
      slides: ["/gallery/whale.png", "/gallery/mountain_landscape.png", "/gallery/ship.png", "/gallery/samurai.png"],
      initialLikes: 1141,
      characteristicsTitle: "Характеристики проєкту:",
      tableHeaders: { name: "Назва", description: "Опис" },
      characteristics: [
        { name: "Напрям", description: "cinema" },
        { name: "Жанрові маркери", description: "cinema, Авторський проєкт" },
        { name: "Автор концепції", description: "Катерина Дорошенко" },
        { name: "Формат", description: "cinema" },
        { name: "Статус", description: "Завершений цикл" },
      ],
    },
    projectDescriptionData: {
      slides: ["/gallery/whale.png", "/gallery/mountain_landscape.png", "/gallery/ship.png", "/gallery/samurai.png"],
      tags: ["cinema", "Авторський проєкт", "Після заходу"],
      date: "11 04 2026",
      title: "Нотатки до серії «Після заходу»",
      aboutAuthor: {
        avatar: "/artists/artist-photo-9.png",
        name: "Катерина Дорошенко",
        description: "cinema. Після заходу, авторський проєкт.",
        artUaLink: "art-ua.info/kateryna-doroshenko",
        saveArtLink: "save-art.in.ua/kateryna-doroshenko",
      },
      socialLinks: [
        { icon: "/socials/deviantart_yellow.svg", alt: "DeviantArt" },
        { icon: "/socials/facebook_yellow.svg", alt: "Facebook" },
        { icon: "/socials/x_yellow.svg", alt: "X" },
        { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest" },
        { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn" },
      ],
      descriptionText: [
        "У фокусі серії - післясмак події та пауза між кульмінаціями.",
        "Культурна спадщина України в контексті нових історичних подій набуває особливої актуальності; образотворче мистецтво фіксує злам епохи.",
        "У серії поєднані документальні деталі та вільна інтерпретація — аби зберегти живий настрій процесу.",
        "Проєкт відкритий до нових прочитань і діалогу з глядачем.",
      ],
    },
  },
  {
    id: 12,
    authorId: 12,
    image: "/projects/project-photo-4.png",
    title: "Остання сцена",
    slug: "ostannia-stsena",
    date: "18.03.2026",
    artSubCategory: "cinema",
    likes: 26,
    ...getProjectAuthor(12),
    projectDetails: {
      title: "Остання сцена",
      tags: [{ text: "cinema", hasIcon: false }, { text: "Авторський проєкт", hasIcon: true }],
      links: { saveArt: "Проєкт на save-art.in.ua/pavlo-yatsenko", artUa: "Проєкт на art-ua.info/pavlo-yatsenko" },
      slides: ["/gallery/mountain_landscape.png", "/gallery/ship.png", "/gallery/samurai.png", "/gallery/whale.png"],
      initialLikes: 1172,
      characteristicsTitle: "Характеристики проєкту:",
      tableHeaders: { name: "Назва", description: "Опис" },
      characteristics: [
        { name: "Напрям", description: "cinema" },
        { name: "Жанрові маркери", description: "cinema, Авторський проєкт" },
        { name: "Автор концепції", description: "Павло Яценко" },
        { name: "Формат", description: "cinema" },
        { name: "Статус", description: "Публічний показ" },
      ],
    },
    projectDescriptionData: {
      slides: ["/gallery/mountain_landscape.png", "/gallery/ship.png", "/gallery/samurai.png", "/gallery/whale.png"],
      tags: ["cinema", "Авторський проєкт", "Остання сцена"],
      date: "12 04 2026",
      title: "Нотатки до серії «Остання сцена»",
      aboutAuthor: {
        avatar: "/artists/artist-photo-10.png",
        name: "Павло Яценко",
        description: "cinema. Остання сцена, авторський проєкт.",
        artUaLink: "art-ua.info/pavlo-yatsenko",
        saveArtLink: "save-art.in.ua/pavlo-yatsenko",
      },
      socialLinks: [
        { icon: "/socials/deviantart_yellow.svg", alt: "DeviantArt" },
        { icon: "/socials/facebook_yellow.svg", alt: "Facebook" },
        { icon: "/socials/x_yellow.svg", alt: "X" },
        { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest" },
        { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn" },
      ],
      descriptionText: [
        "Серія розкриває монтажну драматургію завершальних епізодів.",
        "Культурна спадщина України в контексті нових історичних подій набуває особливої актуальності; образотворче мистецтво фіксує злам епохи.",
        "У серії поєднані документальні деталі та вільна інтерпретація — аби зберегти живий настрій процесу.",
        "Проєкт відкритий до нових прочитань і діалогу з глядачем.",
      ],
    },
  },
  {
    id: 13,
    authorId: 13,
    image: "/projects/project-photo-1.png",
    title: "AR-міраж",
    slug: "ar-mirazh",
    date: "21.03.2026",
    artSubCategory: "ar",
    likes: 20,
    ...getProjectAuthor(13),
    projectDetails: {
      title: "AR-міраж",
      tags: [{ text: "ar", hasIcon: false }, { text: "Авторський проєкт", hasIcon: true }],
      links: { saveArt: "Проєкт на save-art.in.ua/liudmyla-chernenko", artUa: "Проєкт на art-ua.info/liudmyla-chernenko" },
      slides: ["/gallery/ship.png", "/gallery/whale.png", "/gallery/mountain_landscape.png", "/gallery/samurai.png"],
      initialLikes: 1203,
      characteristicsTitle: "Характеристики проєкту:",
      tableHeaders: { name: "Назва", description: "Опис" },
      characteristics: [
        { name: "Напрям", description: "ar" },
        { name: "Жанрові маркери", description: "ar, Авторський проєкт" },
        { name: "Автор концепції", description: "Людмила Черненко" },
        { name: "Формат", description: "ar" },
        { name: "Статус", description: "Завершений цикл" },
      ],
    },
    projectDescriptionData: {
      slides: ["/gallery/ship.png", "/gallery/whale.png", "/gallery/mountain_landscape.png", "/gallery/samurai.png"],
      tags: ["ar", "Авторський проєкт", "AR-міраж"],
      date: "13 04 2026",
      title: "Нотатки до серії «AR-міраж»",
      aboutAuthor: {
        avatar: "/artists/artist-photo-5.png",
        name: "Людмила Черненко",
        description: "ar. AR-міраж, авторський проєкт.",
        artUaLink: "art-ua.info/liudmyla-chernenko",
        saveArtLink: "save-art.in.ua/liudmyla-chernenko",
      },
      socialLinks: [
        { icon: "/socials/deviantart_yellow.svg", alt: "DeviantArt" },
        { icon: "/socials/facebook_yellow.svg", alt: "Facebook" },
        { icon: "/socials/x_yellow.svg", alt: "X" },
        { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest" },
        { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn" },
      ],
      descriptionText: [
        "Проєкт поєднує фізичний простір з цифровими нашаруваннями в реальному часі.",
        "Культурна спадщина України в контексті нових історичних подій набуває особливої актуальності; образотворче мистецтво фіксує злам епохи.",
        "У серії поєднані документальні деталі та вільна інтерпретація — аби зберегти живий настрій процесу.",
        "Проєкт відкритий до нових прочитань і діалогу з глядачем.",
      ],
    },
  },
  {
    id: 14,
    authorId: 14,
    image: "/projects/project-photo-2.png",
    title: "Доповнена реальність: Портал",
    slug: "dopovnena-realnist-portal",
    date: "24.03.2026",
    artSubCategory: "ar",
    likes: 33,
    ...getProjectAuthor(14),
    projectDetails: {
      title: "Доповнена реальність: Портал",
      tags: [{ text: "ar", hasIcon: false }, { text: "Авторський проєкт", hasIcon: true }],
      links: { saveArt: "Проєкт на save-art.in.ua/taras-omelchuk", artUa: "Проєкт на art-ua.info/taras-omelchuk" },
      slides: ["/gallery/samurai.png", "/gallery/ship.png", "/gallery/whale.png", "/gallery/mountain_landscape.png"],
      initialLikes: 1234,
      characteristicsTitle: "Характеристики проєкту:",
      tableHeaders: { name: "Назва", description: "Опис" },
      characteristics: [
        { name: "Напрям", description: "ar" },
        { name: "Жанрові маркери", description: "ar, Авторський проєкт" },
        { name: "Автор концепції", description: "Тарас Омельчук" },
        { name: "Формат", description: "ar" },
        { name: "Статус", description: "Публічний показ" },
      ],
    },
    projectDescriptionData: {
      slides: ["/gallery/samurai.png", "/gallery/ship.png", "/gallery/whale.png", "/gallery/mountain_landscape.png"],
      tags: ["ar", "Авторський проєкт", "Доповнена реальність: Портал"],
      date: "14 04 2026",
      title: "Нотатки до серії «Доповнена реальність: Портал»",
      aboutAuthor: {
        avatar: "/artists/artist-photo-6.png",
        name: "Тарас Омельчук",
        description: "ar. Доповнена реальність: Портал, авторський проєкт.",
        artUaLink: "art-ua.info/taras-omelchuk",
        saveArtLink: "save-art.in.ua/taras-omelchuk",
      },
      socialLinks: [
        { icon: "/socials/deviantart_yellow.svg", alt: "DeviantArt" },
        { icon: "/socials/facebook_yellow.svg", alt: "Facebook" },
        { icon: "/socials/x_yellow.svg", alt: "X" },
        { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest" },
        { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn" },
      ],
      descriptionText: [
        "У серії AR-сцени працюють як портали між історичною пам'яттю та сучасністю.",
        "Культурна спадщина України в контексті нових історичних подій набуває особливої актуальності; образотворче мистецтво фіксує злам епохи.",
        "У серії поєднані документальні деталі та вільна інтерпретація — аби зберегти живий настрій процесу.",
        "Проєкт відкритий до нових прочитань і діалогу з глядачем.",
      ],
    },
  },
  {
    id: 15,
    authorId: 15,
    image: "/projects/project-photo-3.png",
    title: "Пластика сцени",
    slug: "plastyka-stseny",
    date: "27.03.2026",
    artSubCategory: "directing",
    likes: 29,
    ...getProjectAuthor(15),
    projectDetails: {
      title: "Пластика сцени",
      tags: [{ text: "directing", hasIcon: false }, { text: "Авторський проєкт", hasIcon: true }],
      links: { saveArt: "Проєкт на save-art.in.ua/alina-savchuk", artUa: "Проєкт на art-ua.info/alina-savchuk" },
      slides: ["/gallery/whale.png", "/gallery/samurai.png", "/gallery/ship.png", "/gallery/mountain_landscape.png"],
      initialLikes: 1265,
      characteristicsTitle: "Характеристики проєкту:",
      tableHeaders: { name: "Назва", description: "Опис" },
      characteristics: [
        { name: "Напрям", description: "directing" },
        { name: "Жанрові маркери", description: "directing, Авторський проєкт" },
        { name: "Автор концепції", description: "Аліна Савчук" },
        { name: "Формат", description: "directing" },
        { name: "Статус", description: "Завершений цикл" },
      ],
    },
    projectDescriptionData: {
      slides: ["/gallery/whale.png", "/gallery/samurai.png", "/gallery/ship.png", "/gallery/mountain_landscape.png"],
      tags: ["directing", "Авторський проєкт", "Пластика сцени"],
      date: "15 04 2026",
      title: "Нотатки до серії «Пластика сцени»",
      aboutAuthor: {
        avatar: "/artists/artist-photo-7.png",
        name: "Аліна Савчук",
        description: "directing. Пластика сцени, авторський проєкт.",
        artUaLink: "art-ua.info/alina-savchuk",
        saveArtLink: "save-art.in.ua/alina-savchuk",
      },
      socialLinks: [
        { icon: "/socials/deviantart_yellow.svg", alt: "DeviantArt" },
        { icon: "/socials/facebook_yellow.svg", alt: "Facebook" },
        { icon: "/socials/x_yellow.svg", alt: "X" },
        { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest" },
        { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn" },
      ],
      descriptionText: [
        "Серія досліджує взаємодію акторського тіла, простору та світлової партитури.",
        "Культурна спадщина України в контексті нових історичних подій набуває особливої актуальності; образотворче мистецтво фіксує злам епохи.",
        "У серії поєднані документальні деталі та вільна інтерпретація — аби зберегти живий настрій процесу.",
        "Проєкт відкритий до нових прочитань і діалогу з глядачем.",
      ],
    },
  },
].map((project) => ({
  ...project,
  projectDescriptionData: {
    ...project.projectDescriptionData,
    aboutAuthor: getProjectAboutAuthor(project.authorId),
  },
}));

export interface MyProjectCard {
  id: number;
  image: string;
  title: string;
  slug: string;
  likes: number;
}

export const getProjectsByAuthorId = (authorId: number): Project[] =>
  projectsData.filter((project) => project.authorId === authorId);

export const getProjectBySlug = (slug: string): Project | undefined =>
  projectsData.find((project) => project.slug === slug);

export const getMyProjectsByAuthorId = (authorId: number): MyProjectCard[] =>
  getProjectsByAuthorId(authorId).map(({ id, image, title, slug, likes }) => ({
    id,
    image,
    title,
    slug,
    likes,
  }));
