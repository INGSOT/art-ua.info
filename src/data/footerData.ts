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
  key: "creation" | "exhibitions" | "promotion";
}

export const expertiseItems: ExpertiseItem[] = [
  { image: "/image-15.png", key: "creation" },
  { image: "/image-16.png", key: "exhibitions" },
  { image: "/image-17.png", key: "promotion" },
];

// Navigation Data
// Кожен домен має власні шляхи для однакових пунктів меню, тож href
// зберігається окремо для кожної колонки. art-ua.com ще не існує
// (див. коментар у siteDomains.ts), тому його посилання без href —
// підписи рендеряться як звичайний текст.
export type FooterLinkKey =
  | "members"
  | "catalogs"
  | "projects"
  | "projectsForSale"
  | "services"
  | "newsEvents"
  | "faq"
  | "terms"
  | "reports"
  | "specialProjects"
  | "aboutUs";

export interface FooterLink {
  key: FooterLinkKey;
  href?: string;
}

export interface NavigationColumn {
  title: string;
  isCurrentSite: boolean;
  links: FooterLink[];
}

export const navigationData: NavigationColumn[] = [
  {
    title: SITE_DOMAIN,
    isCurrentSite: true,
    links: [
      { key: "members", href: "/authors" },
      { key: "catalogs", href: "/catalogs" },
      { key: "projects", href: "/projects" },
      { key: "services", href: "/services" },
      { key: "newsEvents", href: "/news-events" },
      { key: "faq", href: "/faq" },
      { key: "terms", href: "/terms-of-use" },
    ],
  },
  {
    title: ART_UA_COM_DOMAIN,
    isCurrentSite: false,
    links: [
      { key: "members" },
      { key: "catalogs" },
      { key: "projects" },
      { key: "projectsForSale" },
      { key: "services" },
      { key: "newsEvents" },
      { key: "faq" },
      { key: "terms" },
    ],
  },
  {
    title: SAVE_ART_DOMAIN,
    isCurrentSite: false,
    links: [
      { key: "projects", href: "/projects" },
      { key: "reports", href: "/reports" },
      { key: "specialProjects", href: "/special-projects" },
      { key: "aboutUs", href: "/about-us" },
      { key: "faq", href: "/faq" },
      { key: "terms", href: "/terms-of-use" },
    ],
  },
];

// Contact Info
export interface ContactInfo {
  key: "address" | "email" | "phone";
  text: string;
}

export const contactInfo: ContactInfo[] = [
  { key: "address", text: "м. Івано-Франківськ, Україна" },
  { key: "email", text: "idartua.bo@gmail.com" },
  { key: "phone", text: "+380 98 765 43 21" },
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

export const footerCopyrightYear = "2026";
