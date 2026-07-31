"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import { artistsAPI, type PublicArtist } from "../../lib/api/artists";
import { organizationsAPI } from "../../lib/api/organizations";

export type AuthorKind = "artist" | "organization";

interface AuthorProfileState {
  slug: string;
  loading: boolean;
  notFound: boolean;
  kind: AuthorKind | null;
  profile: PublicArtist | null;
}

const AuthorProfileContext = createContext<AuthorProfileState | null>(null);

function isNotFoundError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "response" in error &&
    (error as { response?: { status?: number } }).response?.status === 404;
}

export function AuthorProfileProvider({ children }: { children: ReactNode }) {
  const params = useParams<{ slug?: string }>();
  const slug = params?.slug ?? "";

  const [state, setState] = useState<AuthorProfileState>({
    slug,
    loading: true,
    notFound: false,
    kind: null,
    profile: null,
  });

  useEffect(() => {
    let ignore = false;

    (async () => {
      setState((prev) => ({ ...prev, slug, loading: true, notFound: false }));

      try {
        const profile = await artistsAPI.get(slug);
        if (!ignore) setState({ slug, loading: false, notFound: false, kind: "artist", profile });
        return;
      } catch (error) {
        if (!isNotFoundError(error)) {
          console.error(`Failed to load artist "${slug}":`, error);
        }
      }

      try {
        const profile = await organizationsAPI.get(slug);
        if (!ignore) setState({ slug, loading: false, notFound: false, kind: "organization", profile });
      } catch (error) {
        if (!isNotFoundError(error)) {
          console.error(`Failed to load organization "${slug}":`, error);
        }
        if (!ignore) setState({ slug, loading: false, notFound: true, kind: null, profile: null });
      }
    })();

    return () => {
      ignore = true;
    };
  }, [slug]);

  const value = useMemo(() => state, [state]);

  return (
    <AuthorProfileContext.Provider value={value}>{children}</AuthorProfileContext.Provider>
  );
}

export function useAuthorProfile(): AuthorProfileState {
  const value = useContext(AuthorProfileContext);
  if (!value) {
    throw new Error("useAuthorProfile має використовуватись всередині AuthorProfileProvider");
  }
  return value;
}
