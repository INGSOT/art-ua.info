import api from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://save-art.ddev.site";

function absoluteUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
}

export interface MyCatalog {
  id: number;
  title: string;
  imageUrl: string;
  pdfUrl: string | null;
  likesCount: number;
  isPrimary: boolean;
}

interface RawMyCatalog {
  id: number;
  title: string;
  image_url: string;
  pdf_url: string | null;
  likes_count: number;
  is_primary: boolean;
}

interface MyCatalogsResponse {
  data: RawMyCatalog[];
}

function mapCatalog(raw: RawMyCatalog): MyCatalog {
  return {
    id: raw.id,
    title: raw.title,
    imageUrl: absoluteUrl(raw.image_url) ?? "",
    pdfUrl: absoluteUrl(raw.pdf_url),
    likesCount: raw.likes_count,
    isPrimary: raw.is_primary,
  };
}

export const myCatalogsAPI = {
  list: async (): Promise<MyCatalog[]> => {
    const response = await api.get<MyCatalogsResponse>("/v1/my/catalogs");
    return response.data.data.map(mapCatalog);
  },

  create: async (params: { titleUk: string; image: string; pdfFile: File }): Promise<MyCatalog> => {
    const form = new FormData();
    form.append("title[uk]", params.titleUk);
    form.append("image", params.image);
    form.append("pdf_file", params.pdfFile);

    const response = await api.post<{ data: RawMyCatalog }>("/v1/my/catalogs", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return mapCatalog(response.data.data);
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/v1/my/catalogs/${id}`);
  },

  setPrimary: async (id: number): Promise<MyCatalog> => {
    const response = await api.post<{ data: RawMyCatalog }>(`/v1/my/catalogs/${id}/primary`);
    return mapCatalog(response.data.data);
  },
};
