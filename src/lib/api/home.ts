import api from "./auth";
import type { ApiLanguage } from "../../i18n/routing";

type LocalizedText = string | { uk: string; en?: string };

export interface HomePartner {
  logo: string | null;
  name: string;
  description: string;
  url: string | null;
}

interface RawHomePartner {
  logo: string | null;
  name: LocalizedText | null;
  description: LocalizedText | null;
  url: string | null;
}

export interface HomeHero {
  title: string;
  imagePoster: string | null;
  imagePosterMobile: string | null;
}

interface RawHomeHero {
  title: LocalizedText | null;
  video_poster: string | null;
  video_poster_mobile: string | null;
  image_poster: string | null;
  image_poster_mobile: string | null;
}

export interface HomeAdBlock {
  title: string;
  buttonText: string;
  image: string | null;
}

interface RawHomeAdBlock {
  title: LocalizedText | null;
  button_text: LocalizedText | null;
  image: string | null;
}

export interface HomePlatformDescription {
  tagline: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
}

interface RawHomePlatformDescription {
  tagline: LocalizedText | null;
  title: LocalizedText | null;
  subtitle: LocalizedText | null;
  paragraphs: string[];
}

export interface HomePlatformFeature {
  title: string;
  description: string;
}

interface HomeResponse {
  data: {
    hero: RawHomeHero;
    platform_description: RawHomePlatformDescription;
    platform_features: HomePlatformFeature[];
    partners: {
      title: LocalizedText;
      items: RawHomePartner[];
    };
    ad_blocks: {
      first: RawHomeAdBlock;
      second: RawHomeAdBlock;
    };
  };
}

function localize(value: LocalizedText | null | undefined, language: ApiLanguage): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return language === "en" ? value.en ?? value.uk : value.uk;
}

function mapAdBlock(raw: RawHomeAdBlock, language: ApiLanguage): HomeAdBlock {
  return {
    title: localize(raw.title, language),
    buttonText: localize(raw.button_text, language),
    image: raw.image,
  };
}

export const homeAPI = {
  getPartners: async (language: ApiLanguage): Promise<{ title: string; items: HomePartner[] }> => {
    const response = await api.get<HomeResponse>("/v1/art-ua-info/home", {
      params: { language },
    });
    const { title, items } = response.data.data.partners;
    return {
      title: localize(title, language),
      items: items.map((partner) => ({
        logo: partner.logo,
        name: localize(partner.name, language),
        description: localize(partner.description, language),
        url: partner.url,
      })),
    };
  },

  getHero: async (language: ApiLanguage): Promise<HomeHero> => {
    const response = await api.get<HomeResponse>("/v1/art-ua-info/home", {
      params: { language },
    });
    const hero = response.data.data.hero;
    return {
      title: localize(hero.title, language),
      imagePoster: hero.image_poster,
      imagePosterMobile: hero.image_poster_mobile,
    };
  },

  getPlatformDescription: async (language: ApiLanguage): Promise<HomePlatformDescription> => {
    const response = await api.get<HomeResponse>("/v1/art-ua-info/home", {
      params: { language },
    });
    const description = response.data.data.platform_description;
    return {
      tagline: localize(description.tagline, language),
      title: localize(description.title, language),
      subtitle: localize(description.subtitle, language),
      paragraphs: description.paragraphs,
    };
  },

  getPlatformFeatures: async (language: ApiLanguage): Promise<HomePlatformFeature[]> => {
    const response = await api.get<HomeResponse>("/v1/art-ua-info/home", {
      params: { language },
    });
    return response.data.data.platform_features;
  },

  getAdBlocks: async (language: ApiLanguage): Promise<{ first: HomeAdBlock; second: HomeAdBlock }> => {
    const response = await api.get<HomeResponse>("/v1/art-ua-info/home", {
      params: { language },
    });
    const { first, second } = response.data.data.ad_blocks;
    return {
      first: mapAdBlock(first, language),
      second: mapAdBlock(second, language),
    };
  },
};
