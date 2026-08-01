import api from "./auth";

export interface TermsList {
  type: "ordered" | "unordered";
  items: string;
}

export interface TermsBlock {
  id: number;
  heading: string | null;
  paragraphs: string | null;
  list: TermsList | null;
}

export interface TermsSection {
  id: number;
  heading: string | null;
  date: string | null;
  blocks: TermsBlock[];
}

interface TermsResponse {
  data: {
    sections: TermsSection[];
  };
}

export const termsAPI = {
  list: async (): Promise<TermsSection[]> => {
    const response = await api.get<TermsResponse>("/v1/art-ua-info/terms", {
      params: { language: "uk" },
    });
    return response.data.data.sections;
  },
};
