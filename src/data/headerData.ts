export interface NavigationItem {
  key: "authors" | "projects" | "services" | "catalogs" | "newsEvents";
  href: string;
}

export interface SocialIcon {
  src: string;
  alt: string;
}

export const navigationItems: NavigationItem[] = [
  { key: "authors", href: "/authors" },
  { key: "projects", href: "/works" },
  { key: "services", href: "/services" },
  { key: "catalogs", href: "/catalogs" },
  { key: "newsEvents", href: "/news-events" },
];

export const socialIcons: SocialIcon[] = [
  { src: "/socials/instagram_white.svg", alt: "Instagram" },
  { src: "/socials/facebook_white.svg", alt: "Facebook" },
  { src: "/socials/youtube_white.svg", alt: "Youtube" },
];
