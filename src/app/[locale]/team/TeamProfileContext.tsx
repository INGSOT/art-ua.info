"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { teamsAPI, type PublicTeam } from "../../../lib/api/teams";
import { myTeamsAPI } from "../../../lib/api/myTeams";
import { localeToApiLanguage, type Locale } from "../../../i18n/routing";
import { useAuth } from "../../../context/AuthContext";

interface TeamProfileState {
  slug: string;
  loading: boolean;
  notFound: boolean;
  team: PublicTeam | null;
  /** Чи є поточний авторизований користувач власником цієї команди. */
  isOwner: boolean;
}

const TeamProfileContext = createContext<TeamProfileState | null>(null);

function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    (error as { response?: { status?: number } }).response?.status === 404
  );
}

export function TeamProfileProvider({ children }: { children: ReactNode }) {
  const params = useParams<{ slug?: string }>();
  const slug = params?.slug ?? "";
  const locale = useLocale() as Locale;
  const language = localeToApiLanguage(locale);
  const { user } = useAuth();

  const [state, setState] = useState<TeamProfileState>({
    slug,
    loading: true,
    notFound: false,
    team: null,
    isOwner: false,
  });

  useEffect(() => {
    let ignore = false;

    (async () => {
      setState((prev) => ({ ...prev, slug, loading: true, notFound: false, isOwner: false }));

      try {
        const team = await teamsAPI.get(slug, language);

        let isOwner = false;
        if (user) {
          try {
            const myTeams = await myTeamsAPI.list();
            isOwner = myTeams.some((myTeam) => myTeam.slug === slug && myTeam.isOwner);
          } catch {
            isOwner = false;
          }
        }

        if (!ignore) setState({ slug, loading: false, notFound: false, team, isOwner });
      } catch (error) {
        if (!isNotFoundError(error)) {
          console.error(`Failed to load team "${slug}":`, error);
        }
        if (!ignore) setState({ slug, loading: false, notFound: true, team: null, isOwner: false });
      }
    })();

    return () => {
      ignore = true;
    };
  }, [slug, language, user]);

  const value = useMemo(() => state, [state]);

  return <TeamProfileContext.Provider value={value}>{children}</TeamProfileContext.Provider>;
}

export function useTeamProfile(): TeamProfileState {
  const value = useContext(TeamProfileContext);
  if (!value) {
    throw new Error("useTeamProfile має використовуватись всередині TeamProfileProvider");
  }
  return value;
}
