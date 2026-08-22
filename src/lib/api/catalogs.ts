import api from "./auth";

export interface CategoryOption {
  value: string;
  label: string;
}

export interface ArtCategory extends CategoryOption {
  subcategories: CategoryOption[];
}

interface CategoriesResponse {
  data: ArtCategory[];
}

export const catalogsAPI = {
  categories: async (params?: { language?: "uk" | "en" }): Promise<ArtCategory[]> => {
    const response = await api.get<CategoriesResponse>("/v1/art-ua-info/categories", {
      params: { language: "uk", ...params },
    });
    return response.data.data;
  },
};
