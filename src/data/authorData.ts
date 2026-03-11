// Author Information
export interface AuthorSocialLink {
  icon: string;
  alt: string;
  url: string;
}

export interface AuthorInfo {
  website: string;
  socialLinks: AuthorSocialLink[];
  location: {
    country: string;
    city: string;
  };
  description: string[];
}

export const authorInfo: AuthorInfo = {
  website: "website.com",
  socialLinks: [
    { icon: "/socials/deviantart_yellow.svg", alt: "DeviantArt", url: "https://deviantart.com" },
    { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest", url: "https://pinterest.com" },
    { icon: "/socials/youtube_yellow.svg", alt: "YouTube", url: "https://youtube.com" },
    { icon: "/socials/instagram_yellow.svg", alt: "Instagram", url: "https://instagram.com" },
    { icon: "/socials/facebook_yellow.svg", alt: "Facebook", url: "https://facebook.com" },
    { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn", url: "https://linkedin.com" },
    { icon: "/socials/x_yellow.svg", alt: "X", url: "https://x.com" },
  ],
  location: {
    country: "Україна",
    city: "Кривий ріг",
  },
  description: [
    "Текст опису про себе.",
    "Культурна спадщина України в контексті нових історичних подій набула особливої актуальності та нових змістів.",
    "Сьогодні образотворче мистецтво у фарбах на холсті відображає не просто сюжети чи метафори, а небувалий у сучасній історії злам епох. Художники фіксують не тільки події, а ще й глибину емоційно-почуттєвого фону, який неможливо передати на словах та в стрічці новин. Це - новітнє мистецтво, сучасне, переосмислене, глибинне, на віки.",
    "Саме зараз настає його час - аби уберегти наступні покоління від руїн, транслюючи біль крізь художні образи.",
  ],
};

// Author Projects
export interface AuthorProject {
  id: number;
  image: string;
  title: string;
  likes: number;
}

export interface ProjectFilterButton {
  id: string;
  text: string;
}

export const authorProjects: AuthorProject[] = [
  // { id: 1, image: "/projects/project-photo-1.png", title: "Назва роботи", likes: 17 },
  // { id: 2, image: "/projects/project-photo-2.png", title: "Назва роботи", likes: 17 },
  // { id: 3, image: "/projects/project-photo-3.png", title: "Назва роботи", likes: 35 },
  // { id: 4, image: "/projects/project-photo-4.png", title: "Назва роботи", likes: 17 },
];

export const projectFilterButtons: ProjectFilterButton[] = [
  { id: "all", text: "Усі категорії" },
  { id: "newest", text: "Новіші" },
];

export const projectEmptyState = {
  message: "Тут ще нічого немає",
};

// Specific Project Details
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

export const projectDetails: ProjectDetails = {
  title: "Художній фільм \"Назва Фільму\"",
  tags: [
    { text: "Повнометражний кінематограф", hasIcon: false },
    { text: "Проєкт проданий", hasIcon: true },
  ],
  links: {
    saveArt: "Проєкт на save-art.in.ua",
    artUa: "Проєкт на art-ua.com",
  },
  slides: [
    "/gallery/big_lebovski.png",
    "/gallery/pulp_fiction.png",
    "/gallery/autumn.png",
    "/gallery/rain.png",
  ],
  initialLikes: 1257,
  characteristicsTitle: "Характеристики проєкту:",
  tableHeaders: {
    name: "Назва",
    description: "Опис",
  },
  characteristics: [
    { name: "Тривалість", description: "До 20 хв." },
    { name: "Жанр", description: "Комедія" },
    { name: "Режисер", description: "Я" },
    { name: "Сценарій", description: "Теж я" },
    { name: "Актори", description: "Один – я" },
  ],
};

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

export const projectDescriptionData: ProjectDescriptionData = {
  slides: [
    "/gallery/ship.png",
    "/gallery/samurai.png",
    "/gallery/whale.png",
    "/gallery/mountain_landscape.png",
  ],
  tags: ["Тег", "Тег", "тег", "Тег", "Назватегу"],
  date: "02 01 2025",
  title: "Заголовок",
  aboutAuthor: {
    avatar: "/image-13.png",
    name: "Ім'я Прізвище",
    description: "Художник, скульптор, архітектор, режисер, співак",
    artUaLink: "art-ua.com/username",
    saveArtLink: "save-art.in.ua/username",
  },
  socialLinks: [
    { icon: "/socials/deviantart_yellow.svg", alt: "DeviantArt" },
    { icon: "/socials/facebook_yellow.svg", alt: "Facebook" },
    { icon: "/socials/x_yellow.svg", alt: "X" },
    { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest" },
    { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn" },
  ],
  descriptionText: [
    "Текст опису проєкту.",
    "Культурна спадщина України в контексті нових історичних подій набула особливої актуальності та нових змістів.",
    "Сьогодні образотворче мистецтво у фарбах на холсті відображає не просто сюжети чи метафори, а небувалий у сучасній історії злам епох. Художники фіксують не тільки події, а ще й глибину емоційно-почуттєвого фону, який неможливо передати на словах та в стрічці новин. Це - новітнє мистецтво, сучасне, переосмислене, глибинне, на віки.",
    "Саме зараз настає його час - аби уберегти наступні покоління від руїн, транслюючи біль крізь художні образи.",
  ],
};

// Author Catalogs
export interface AuthorCatalog {
  id: number;
  title: string;
}

export const authorCatalogs: AuthorCatalog[] = [
  { id: 1, title: "Назва каталогу на декілька слів" },
  { id: 2, title: "Назва каталогу на декілька слів" },
  { id: 3, title: "Назва каталогу на декілька слів" },
  { id: 4, title: "Назва каталогу на декілька слів" },
];

// Author Services
export interface AuthorService {
  id: number;
  image: string;
  buttonLabel: string;
  title: string;
}

export const authorServices: AuthorService[] = [
  {
    id: 1,
    image: "/gallery/autumn.png",
    buttonLabel: "Від 100 000 ₴",
    title: "Назва послуги на декілька слів. Не більше ніж на два рядки. Кра...",
  },
  {
    id: 2,
    image: "/gallery/rain.png",
    buttonLabel: "Ціна договірна",
    title: "Назва послуги на декілька слів. Не більше ніж на два рядки. Кра...",
  },
  {
    id: 3,
    image: "/gallery/ship.png",
    buttonLabel: "Від ₴ 100 000 000",
    title: "Назва послуги на декілька слів. Не більше ніж на два рядки. Кра...",
  },
];

// About The Author
export interface Team {
  name: string;
  icon: string;
}

export interface AboutAuthorButton {
  id: string;
  label: string;
}

export interface AboutAuthorData {
  name: string;
  description: string;
  avatar: string;
  teams: Team[];
  buttons: AboutAuthorButton[];
}

export const aboutAuthorData: AboutAuthorData = {
  name: "Ім'я Прізвище",
  description: "Художник, скульптор, архітектор, режисер, співак",
  avatar: "/image-13.png",
  teams: [
    { name: "Назва Команди", icon: "/teams/team-photo-1.png" },
    { name: "Назва Команди", icon: "/teams/team-photo-2.png" },
    { name: "Довга назва команди на декілька слів", icon: "/teams/team-photo-3.png" },
    { name: "Довга назва команди", icon: "/teams/team-photo-4.png" },
  ],
  buttons: [
    { id: "save-art", label: "save-art.in.ua/username" },
    { id: "art-ua", label: "art-ua.info/username" },
  ],
};

// Service Details (specific service page)
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

export const serviceDetailsData: ServiceDetailsData = {
  photo: "/gallery/autumn.png",
  breadcrumb: {
    authorName: "Ім'я Прізвище",
    section: "Послуги",
  },
  title: "Повна назва послуги",
  priceLabel: "Ціна договірна",
  description: [
    "Текст опису.",
    "Культурна спадщина України в контексті нових історичних подій набула особливої актуальності та нових змістів.",
    "Саме зараз настає його час - аби уберегти наступні покоління від руїн, транслюючи біль крізь художні образи.",
  ],
  options: [
    { id: "option1", label: "Опція" },
    { id: "option2", label: "Ще одна опція" },
  ],
  formFields: [
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
  ],
  submitButtonLabel: "Відправити запит",
};
