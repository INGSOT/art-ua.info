"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useParams } from "next/navigation";
import {
  getAuthorProfileBySlug,
  type AuthorProfileBundle,
} from "../../data/profileData";

const ProfileViewContext = createContext<AuthorProfileBundle | null>(null);

export function ProfileViewProvider({ children }: { children: ReactNode }) {
  const params = useParams<{ slug?: string }>();
  const profile = useMemo(() => {
    return getAuthorProfileBySlug(params?.slug);
  }, [params]);

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
