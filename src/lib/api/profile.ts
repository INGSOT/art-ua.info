import api from "./auth";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "");

interface RawProfilePersonal {
  avatar: string | null;
  full_name: { uk?: string; en?: string } | null;
  profession: { uk?: string; en?: string } | null;
  country: { uk?: string; en?: string } | null;
  city: { uk?: string; en?: string } | null;
  description: { uk?: string; en?: string } | null;
}

interface RawProfileSocial {
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  youtube: string | null;
  pinterest: string | null;
  deviantart: string | null;
}

interface GetProfileResponse {
  profilePersonal: RawProfilePersonal;
  profileSocial: RawProfileSocial | null;
}

export interface ProfileSocialLink {
  icon: string;
  alt: string;
  url: string;
}

export interface MyProfileInfo {
  website: string;
  socialLinks: ProfileSocialLink[];
  location: { country: string; city: string };
  description: string[];
}

const SOCIAL_ICONS: { key: keyof RawProfileSocial; alt: string; icon: string }[] = [
  { key: "facebook", alt: "Facebook", icon: "/socials/facebook_yellow.svg" },
  { key: "instagram", alt: "Instagram", icon: "/socials/instagram_yellow.svg" },
  { key: "linkedin", alt: "LinkedIn", icon: "/socials/linked_in_yellow.svg" },
  { key: "youtube", alt: "YouTube", icon: "/socials/youtube_yellow.svg" },
  { key: "pinterest", alt: "Pinterest", icon: "/socials/pinterest_yellow.svg" },
  { key: "deviantart", alt: "DeviantArt", icon: "/socials/deviantart_yellow.svg" },
  { key: "twitter", alt: "X", icon: "/socials/x_yellow.svg" },
];

export const profileAPI = {
  getMyProfileInfo: async (): Promise<MyProfileInfo> => {
    const response = await api.get<GetProfileResponse>("/v1/art-ua-info/profile");
    const { profilePersonal, profileSocial } = response.data;

    const socialLinks: ProfileSocialLink[] = SOCIAL_ICONS.filter(
      ({ key }) => profileSocial?.[key]
    ).map(({ key, alt, icon }) => ({
      icon,
      alt,
      url: profileSocial![key] as string,
    }));

    return {
      website: profileSocial?.website ?? "",
      socialLinks,
      location: {
        country: profilePersonal.country?.uk ?? "",
        city: profilePersonal.city?.uk ?? "",
      },
      description: (profilePersonal.description?.uk ?? "")
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean),
    };
  },

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
