import api from "./auth";

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
  list: async (): Promise<PublicFaqCategory[]> => {
    const response = await api.get<FaqResponse>("/v1/faq", {
      params: { language: "uk" },
    });
    return response.data.data.categories;
  },
};
