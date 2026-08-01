"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import { teamsAPI, type PublicTeam } from "../../../lib/api/teams";

interface TeamProfileState {
  slug: string;
  loading: boolean;
  notFound: boolean;
  team: PublicTeam | null;
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

  const [state, setState] = useState<TeamProfileState>({
    slug,
    loading: true,
    notFound: false,
    team: null,
  });

  useEffect(() => {
    let ignore = false;

    (async () => {
      setState((prev) => ({ ...prev, slug, loading: true, notFound: false }));

      try {
        const team = await teamsAPI.get(slug);
        if (!ignore) setState({ slug, loading: false, notFound: false, team });
      } catch (error) {
        if (!isNotFoundError(error)) {
          console.error(`Failed to load team "${slug}":`, error);
        }
        if (!ignore) setState({ slug, loading: false, notFound: true, team: null });
      }
    })();

    return () => {
      ignore = true;
    };
  }, [slug]);

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
