import api from "./auth";
import type { ApiLanguage } from "../../i18n/routing";

export interface PublicFaqQuestion {
  id: number;
  question: string;
  answer: string;
}

export interface PublicFaqCategory {
  id: number;
  name: string;
  slug: string;
  questions: PublicFaqQuestion[];
}

interface FaqResponse {
  data: {
    categories: PublicFaqCategory[];
  };
}

export const faqAPI = {
  list: async (language: ApiLanguage): Promise<PublicFaqCategory[]> => {
    const response = await api.get<FaqResponse>("/v1/art-ua-info/faq", {
      params: { language },
    });
    return response.data.data.categories;
  },
};
