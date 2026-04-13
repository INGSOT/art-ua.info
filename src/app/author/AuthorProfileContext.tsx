"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import {
  getAuthorProfileById,
  type AuthorProfileBundle,
} from "../../data/profileData";

const AuthorProfileContext = createContext<AuthorProfileBundle | null>(null);

export function AuthorProfileProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const profile = useMemo(() => {
    const raw = searchParams.get("id");
    return getAuthorProfileById(raw);
  }, [searchParams]);

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
