"use client";

import { withTeamId } from "../../../lib/authorQuery";

export function hrefWithTeam(path: string, teamSlug: string): string {
  return withTeamId(path, teamSlug);
}
