"use client";

import { useSearchParams } from "next/navigation";
import { defaultTeamId, getTeamById, type TeamProfile } from "../../data/teamData";

export function useCurrentTeam(): TeamProfile {
  const searchParams = useSearchParams();
  return getTeamById(searchParams.get("team") ?? defaultTeamId);
}

export function teamQueryString(teamId: string): string {
  return teamId === defaultTeamId ? "" : `?team=${teamId}`;
}

export function hrefWithTeam(path: string, teamId: string): string {
  const q = teamQueryString(teamId);
  return q ? `${path}${q}` : path;
}
