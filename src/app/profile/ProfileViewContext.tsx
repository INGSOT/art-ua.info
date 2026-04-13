"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import {
  getAuthorProfileById,
  type AuthorProfileBundle,
} from "../../data/profileData";

const ProfileViewContext = createContext<AuthorProfileBundle | null>(null);

export function ProfileViewProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const profile = useMemo(() => {
    return getAuthorProfileById(searchParams.get("id"));
  }, [searchParams]);

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
