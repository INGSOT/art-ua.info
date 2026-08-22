import api from "./auth";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "");

export const profileAPI = {
  // Редагування профілю переїхало в Filament-панель бекенду. Ендпоінт спільний
  // для всіх фронтендів (не під /v1/art-ua-info/*) — видає одноразовий грант,
  // який логінить того ж юзера в сесію Filament без повторного вводу пароля.
  requestProfileSso: async (redirectPath: string): Promise<{ url: string }> => {
    const response = await api.post<{ url: string }>("/v1/profile/sso-grant", {
      redirect_path: redirectPath,
    });
    return response.data;
  },

  // Порт save-art/src/api/auth.js redirectToBackendProfile — якщо видача
  // одноразового гранту чомусь не вдалась, ведемо просто на бекенд без
  // автологіну (користувач залогіниться там вручну), а не блокуємо перехід.
  redirectToProfile: async (redirectPath: string): Promise<void> => {
    try {
      const { url } = await profileAPI.requestProfileSso(redirectPath);
      window.location.href = url;
    } catch {
      window.location.href = `${API_BASE}${redirectPath}`;
    }
  },
};
