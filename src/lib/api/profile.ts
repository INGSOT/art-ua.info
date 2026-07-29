import api from "./auth";

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

export interface MyProfileEditData {
  avatar: string | null;
  fullNameUk: string;
  fullNameEn: string;
  professionUk: string;
  professionEn: string;
  countryUk: string;
  countryEn: string;
  cityUk: string;
  cityEn: string;
  descriptionUk: string;
  descriptionEn: string;
  website: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
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

function mapEditData(data: GetProfileResponse): MyProfileEditData {
  const { profilePersonal, profileSocial } = data;
  return {
    avatar: profilePersonal.avatar,
    fullNameUk: profilePersonal.full_name?.uk ?? "",
    fullNameEn: profilePersonal.full_name?.en ?? "",
    professionUk: profilePersonal.profession?.uk ?? "",
    professionEn: profilePersonal.profession?.en ?? "",
    countryUk: profilePersonal.country?.uk ?? "",
    countryEn: profilePersonal.country?.en ?? "",
    cityUk: profilePersonal.city?.uk ?? "",
    cityEn: profilePersonal.city?.en ?? "",
    descriptionUk: profilePersonal.description?.uk ?? "",
    descriptionEn: profilePersonal.description?.en ?? "",
    website: profileSocial?.website ?? "",
    facebook: profileSocial?.facebook ?? "",
    instagram: profileSocial?.instagram ?? "",
    linkedin: profileSocial?.linkedin ?? "",
    youtube: profileSocial?.youtube ?? "",
  };
}

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

  getMyProfileEditData: async (): Promise<MyProfileEditData> => {
    const response = await api.get<GetProfileResponse>("/v1/art-ua-info/profile");
    return mapEditData(response.data);
  },

  updateProfile: async (data: MyProfileEditData): Promise<void> => {
    await api.put("/v1/art-ua-info/profile/personal", {
      avatar: data.avatar || undefined,
      full_name: { uk: data.fullNameUk, en: data.fullNameEn || undefined },
      profession: { uk: data.professionUk, en: data.professionEn || undefined },
      country: { uk: data.countryUk, en: data.countryEn || undefined },
      city: { uk: data.cityUk, en: data.cityEn || undefined },
      description: { uk: data.descriptionUk, en: data.descriptionEn || undefined },
    });

    await api.put("/v1/art-ua-info/profile/social", {
      website: data.website || undefined,
      facebook: data.facebook || undefined,
      instagram: data.instagram || undefined,
      linkedin: data.linkedin || undefined,
      youtube: data.youtube || undefined,
    });
  },
};
