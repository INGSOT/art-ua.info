import api from "./auth";

type LocalizedText = string | { uk: string; en?: string };

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

export interface RegionOption {
  value: string;
  label: string;
}

interface RegionsResponse {
  data: RegionOption[];
}

export interface ParameterValue {
  id: number;
  value: LocalizedText;
}

export interface Parameter {
  id: number;
  name: LocalizedText;
  type: "list" | "custom";
  values: ParameterValue[];
}

interface ParametersResponse {
  data: Parameter[];
}

export const catalogsAPI = {
  categories: async (params?: { language?: "uk" | "en" }): Promise<ArtCategory[]> => {
    const response = await api.get<CategoriesResponse>("/v1/categories", {
      params: { language: "uk", ...params },
    });
    return response.data.data;
  },

  regions: async (params?: { language?: "uk" | "en" }): Promise<RegionOption[]> => {
    const response = await api.get<RegionsResponse>("/v1/regions", {
      params: { language: "uk", ...params },
    });
    return response.data.data;
  },

  // Без явного language бекенд повертає назви/значення як {uk, en} (а не локалізовану
  // строку) — це потрібно для форми створення проєкту, де довільні характеристики
  // заповнюються обома мовами одразу.
  parameters: async (params: {
    art_category: string;
    art_subcategory?: string;
    language?: "uk" | "en";
  }): Promise<Parameter[]> => {
    const response = await api.get<ParametersResponse>("/v1/parameters", { params });
    return response.data.data;
  },
};
