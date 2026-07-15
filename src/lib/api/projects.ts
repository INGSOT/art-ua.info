import api from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://save-art.ddev.site";

export interface PublicProjectListItem {
  id: number;
  slug: string;
  title: string;
  cover_url: string | null;
  likes_count: number;
}

interface RawProjectListItem extends Omit<PublicProjectListItem, "cover_url"> {
  cover_url: string | null;
}

interface ProjectsListResponse {
  data: RawProjectListItem[];
}

export const projectsAPI = {
  list: async (params?: Record<string, string | number>): Promise<PublicProjectListItem[]> => {
    const response = await api.get<ProjectsListResponse>("/v1/projects", {
      params: { language: "uk", ...params },
    });
    return response.data.data.map((project) => ({
      ...project,
      cover_url: project.cover_url ? `${API_BASE}${project.cover_url}` : null,
    }));
  },
};
