function normalizePath(path: string): string {
  return path.trim().replace(/^\/+|\/+$/g, "");
}

/** Будує шлях для публічного профілю у форматі /author/<slug>/<tab>. */
export function withAuthorId(path: string, authorSlug: string): string {
  const rest = normalizePath(path).replace(/^author\/?/, "");
  const encodedSlug = encodeURIComponent(authorSlug);
  return rest ? `/author/${encodedSlug}/${rest}` : `/author/${encodedSlug}`;
}

/** Те саме для публічної сторінки команди /team/<slug>/<tab>. */
export function withTeamId(path: string, teamSlug: string): string {
  const rest = normalizePath(path).replace(/^team\/?/, "");
  const encodedSlug = encodeURIComponent(teamSlug);
  return rest ? `/team/${encodedSlug}/${rest}` : `/team/${encodedSlug}`;
}
