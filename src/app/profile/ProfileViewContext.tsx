"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  getAuthorProfileById,
  DEFAULT_AUTHOR_PROFILE_ID,
  type AuthorProfileBundle,
} from "../../data/profileData";
import { useAuth } from "../../context/AuthContext";
import { getImageUrl } from "../../lib/url";
import { ART_UA_COM_DOMAIN, SAVE_ART_DOMAIN, artUaComProfileUrl, saveArtProfileUrl } from "../../lib/siteDomains";

const ProfileViewContext = createContext<AuthorProfileBundle | null>(null);

// Дані вкладок (profileInfo/profileTeams/projectDetails тощо) поки що не мають
// бекенду (див. план у пам'яті) — беремо їх з мок-профілю за замовчуванням,
// а identity (id/slug/aboutMe) вже будуємо з реального авторизованого юзера.
const mockFallback = getAuthorProfileById(DEFAULT_AUTHOR_PROFILE_ID);

export function ProfileViewProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const profile = useMemo<AuthorProfileBundle>(() => {
    if (!user) {
      // ProfileAuthGuard не пропускає рендер дітей без користувача, тому це
      // практично недосяжно — лишаємо мок як safe fallback на випадок гонки.
      return mockFallback;
    }

    const professionLabel =
      typeof user.profession === "string"
        ? user.profession
        : user.profession?.uk ?? "";

    // "profile_legal" повертається бекендом і для порожнього юр. профілю (лише edrpou/name
    // не заповнені) — орієнтуємось на реально заповнену назву чи ЄДРПОУ, а не на факт наявності
    // самого об'єкта (див. аналогічну перевірку в save-art SelectProjectOwner.jsx).
    const legalName = user.profile_legal?.name?.uk || user.profile_legal?.name?.en;
    const hasLegalProfile = Boolean(legalName) || Boolean(user.profile_legal?.edrpou);

    return {
      ...mockFallback,
      id: user.id,
      slug: user.slug,
      aboutMe: {
        ...mockFallback.aboutMe,
        name: user.name,
        artistType: professionLabel,
        avatar: getImageUrl(user.avatar_url) || mockFallback.aboutMe.avatar,
        teams: (user.teams ?? []).map((team) => ({
          name: typeof team.name === "string" ? team.name : team.name?.uk ?? "",
          icon: getImageUrl(team.avatar) || mockFallback.aboutMe.avatar,
          slug: team.slug,
        })),
        legalEntity: hasLegalProfile
          ? {
              name: legalName || "Юридична особа",
              avatar: getImageUrl(user.profile_legal?.logo) || "/legals/legals-photo-1.jpg",
            }
          : null,
        buttons: [
          {
            id: "save-art",
            label: SAVE_ART_DOMAIN,
            href: saveArtProfileUrl(user.slug),
            external: true,
          },
          {
            id: "art-ua",
            label: ART_UA_COM_DOMAIN,
            href: artUaComProfileUrl(user.slug),
            external: true,
          },
        ],
      },
    };
  }, [user]);

  return (
    <ProfileViewContext.Provider value={profile}>
      {children}
    </ProfileViewContext.Provider>
  );
}

export function useProfileView(): AuthorProfileBundle {
  const value = useContext(ProfileViewContext);
  if (!value) {
    throw new Error(
      "useProfileView має використовуватись всередині ProfileViewProvider",
    );
  }
  return value;
}
