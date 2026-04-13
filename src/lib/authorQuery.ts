/** Додає або оновлює query-параметр id для сторінок публічного профілю автора. */
export function withAuthorId(path: string, authorId: number): string {
  const u = new URL(path, "http://localhost");
  u.searchParams.set("id", String(authorId));
  return `${u.pathname}${u.search}`;
}

/** Те саме для секції /profile (профіль за id митця). */
export const withProfileId = withAuthorId;
