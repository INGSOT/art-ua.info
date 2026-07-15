import api from "./auth";

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

interface HomeResponse {
  data: {
    partners: {
      title: LocalizedText;
      items: RawHomePartner[];
    };
  };
}

function localize(value: LocalizedText | null | undefined): string {
  if (!value) return "";
  return typeof value === "string" ? value : value.uk;
}

export const homeAPI = {
  getPartners: async (): Promise<{ title: string; items: HomePartner[] }> => {
    const response = await api.get<HomeResponse>("/home", {
      params: { language: "uk" },
    });
    const { title, items } = response.data.data.partners;
    return {
      title: localize(title),
      items: items.map((partner) => ({
        logo: partner.logo,
        name: localize(partner.name),
        description: localize(partner.description),
        url: partner.url,
      })),
    };
  },
};
