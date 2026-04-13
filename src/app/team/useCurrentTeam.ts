"use client";

import { useParams } from "next/navigation";
import { defaultTeamSlug, getTeamBySlug, type TeamProfile } from "../../data/teamData";
import { withTeamId } from "../../lib/authorQuery";

export function useCurrentTeam(): TeamProfile {
  const params = useParams<{ slug?: string | string[] }>();
  const rawSlug = params?.slug;
  const teamSlug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  return getTeamBySlug(teamSlug ?? defaultTeamSlug);
}

export function hrefWithTeam(path: string, teamSlug: string): string {
  return withTeamId(path, teamSlug);
}
