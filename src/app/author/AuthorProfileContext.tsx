"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useParams } from "next/navigation";
import {
  getAuthorProfileBySlug,
  type AuthorProfileBundle,
} from "../../data/profileData";

const AuthorProfileContext = createContext<AuthorProfileBundle | null>(null);

export function AuthorProfileProvider({ children }: { children: ReactNode }) {
  const params = useParams<{ slug?: string }>();
  const profile = useMemo(() => {
    return getAuthorProfileBySlug(params?.slug);
  }, [params]);

  return (
    <AuthorProfileContext.Provider value={profile}>
      {children}
    </AuthorProfileContext.Provider>
  );
}

export function useAuthorProfile(): AuthorProfileBundle {
  const value = useContext(AuthorProfileContext);
  if (!value) {
    throw new Error("useAuthorProfile має використовуватись всередині AuthorProfileProvider");
  }
  return value;
}
