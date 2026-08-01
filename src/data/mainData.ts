import { SAVE_ART_DOMAIN } from "../lib/siteDomains";

// Hero Banner Data
export const heroBannerData = {
  backgroundVideo: "/main_hero.mp4",
};

// Main Navigation Data
export const navigationItems = [
  { id: 1, key: "stageArt" },
  { id: 2, key: "visualArt" },
  { id: 3, key: "finArt" },
  { id: 4, key: "literature" },
] as const;

// Support Artists Data
export const supportArtistsData = {
  link: SAVE_ART_DOMAIN,
  backgroundImage: "/support_artists.jpg",
};
// Partners Data
export const partnersData = {
  title: "Партнери",
  partners: [
    {
      id: 1,
      logo: "/idua.svg",
      logoClassName: "w-[100px] h-[100px]",
      title: "ID_Art_UA",
      description: "Пара слів хто це",
    },
    {
      id: 2,
      logo: "/ingsot.svg",
      logoClassName: "w-[323.53px] h-[100px]",
      title: "ingsot.com",
      description: "Пара слів хто це",
    },
    {
      id: 3,
      logo: "/image-13.png",
      logoClassName: "w-[100px] h-[100px] rounded-[50px] object-cover",
      title: "Костянтин Костянтинопольський",
      description: "Пара слів хто це",
    },
    {
      id: 4,
      logo: "/image-13.png",
      logoClassName: "w-[100px] h-[100px] rounded-[50px] object-cover",
      title: "Костянтин Костянтинопольський",
      description: "Пара слів хто це",
    },
  ],
};


