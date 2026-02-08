export interface NavigationItem {
  label: string;
  href: string;
}

export interface SocialIcon {
  src: string;
  alt: string;
}

export interface LanguageOption {
  code: string;
  active: boolean;
}

export const navigationItems: NavigationItem[] = [
  { label: "Учасники", href: "/authors" },
  { label: "Роботи", href: "/projects" },
  { label: "Послуги", href: "/services" },
  { label: "Каталоги", href: "/catalogs" },
  { label: "Новини та події", href: "/news_events" },
];

export const socialIcons: SocialIcon[] = [
  { src: "/socials/instagram_white.svg", alt: "Instagram" },
  { src: "/socials/facebook_white.svg", alt: "Facebook" },
  { src: "/socials/youtube_white.svg", alt: "Youtube" },
];

export const languageOptions: LanguageOption[] = [
  { code: "UA", active: true },
  { code: "EN", active: false },
];
