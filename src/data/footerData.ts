// Footer Social Icons
export interface SocialIcon {
  src: string;
  alt: string;
}

export const footerSocialIcons: SocialIcon[] = [
  { src: "/socials/youtube_black.svg", alt: "Social" },
  { src: "/socials/instagram_black.svg", alt: "Social" },
  { src: "/socials/facebook_black.svg", alt: "Social" },
];

// Expertise Items
export interface ExpertiseItem {
  image: string;
  text: string;
}

export const expertiseItems: ExpertiseItem[] = [
  {
    image: "/image-15.png",
    text: "Створення сучасного українського мистецтва",
  },
  {
    image: "/image-16.png",
    text: "Участь у проведенні виставок та мистецьких заходів",
  },
  {
    image: "/image-17.png",
    text: "Популяризація українських митців в усьому світі",
  },
];

// Navigation Data
export interface NavigationColumn {
  title: string;
  links: string[];
}

export const navigationData: NavigationColumn[] = [
  {
    title: "art-ua.info",
    links: [
      "Учасники",
      "Каталоги",
      "Проєкти",
      "Послуги",
      "Новини та події",
      "Часті питання",
      "Умови використання",
    ],
  },
  {
    title: "art-ua.com",
    links: [
      "Учасники",
      "Каталоги",
      "Проєкти",
      "Проєкти для продажу",
      "Послуги",
      "Новини та події",
      "Часті питання",
      "Умови використання",
    ],
  },
  {
    title: "save-art.in.ua",
    links: [
      "Проєкти",
      "Звіти",
      "Спецпроєкти",
      "Про нас",
      "Часті питання",
      "Умови використання",
    ],
  },
];

// Contact Info
export interface ContactInfo {
  text: string;
}

export const contactInfo: ContactInfo[] = [
  { text: "м. Івано-Франківськ, Україна" },
  { text: "idartua.bo@gmail.com" },
  { text: "+380 98 765 43 21" },
];

// Social Links
export interface SocialLink {
  icon: string;
  text: string;
}

export const socialLinks: SocialLink[] = [
  {
    icon: "/socials/facebook_black.svg",
    text: "ua.id.art",
  },
  {
    icon: "/socials/youtube_black.svg",
    text: "@id_artUA",
  },
];

// Footer Text Content
export const footerContent = {
  header: {
    siteName: "art-ua.info",
    slogan: "Мистецтво допомоги — найсучасніше з мистецтв",
  },
  expertiseSection: {
    title: "Запрошуємо експертів до співпраці",
    description: "Благодійний фонд ID_Art UA відкритий до співпраці ...",
    buttonLabel: "Відправити заявку",
  },
  organizationName: "БЛАГОДІЙНИЙ ФОНД ID_Art UA",
  copyrightYear: "2026",
};

// Link Mapping for Navigation
export const linkMap: Record<string, string> = {
  "Учасники": "/authors",
  "Каталоги": "/catalogs",
  "Проєкти": "/projects",
  "Послуги": "/services",
  "Новини та події": "/news_events",
  "Часті питання": "/faq",
};
