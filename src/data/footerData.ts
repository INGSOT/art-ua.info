import { ART_UA_COM_DOMAIN, SAVE_ART_DOMAIN, SITE_DOMAIN } from "../lib/siteDomains";

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
    title: SITE_DOMAIN,
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
    title: ART_UA_COM_DOMAIN,
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
    title: SAVE_ART_DOMAIN,
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
    siteName: SITE_DOMAIN,
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

// Link Mapping for Navigation, per footer column domain.
// Кожен домен має власні шляхи, тож мапи не можна ділити між колонками:
// ті самі підписи ("Проєкти", "Часті питання" тощо) ведуть на різні URL
// залежно від сайту.
export const siteLinkMap: Record<string, string> = {
  "Учасники": "/authors",
  "Каталоги": "/catalogs",
  "Проєкти": "/projects",
  "Послуги": "/services",
  "Новини та події": "/news-events",
  "Часті питання": "/faq",
  "Умови використання": "/terms-of-use",
};

// art-ua.com ще не існує (див. коментар у siteDomains.ts), тож посилань
// поки немає — підписи рендеряться як звичайний текст.
export const artUaComLinkMap: Record<string, string> = {};

export const saveArtLinkMap: Record<string, string> = {
  "Проєкти": "/projects",
  "Звіти": "/reports",
  "Спецпроєкти": "/special-projects",
  "Про нас": "/about-us",
  "Часті питання": "/faq",
  "Умови використання": "/terms-of-use",
};

export const linkMapsByDomain: Record<string, Record<string, string>> = {
  [SITE_DOMAIN]: siteLinkMap,
  [ART_UA_COM_DOMAIN]: artUaComLinkMap,
  [SAVE_ART_DOMAIN]: saveArtLinkMap,
};
