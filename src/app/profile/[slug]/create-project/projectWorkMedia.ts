import { getVideoInfo } from "../../../../utils/videoUtils";

export type ProjectWorkMediaItem =
  | { kind: "image"; src: string }
  | { kind: "video"; url: string };

export function normalizeWorkGalleryItems(raw: unknown): ProjectWorkMediaItem[] {
  if (!Array.isArray(raw)) return [];
  const out: ProjectWorkMediaItem[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    if (r.kind === "image" && typeof r.src === "string") {
      out.push({ kind: "image", src: r.src });
    } else if (r.kind === "video" && typeof r.url === "string") {
      if (getVideoInfo(r.url)) out.push({ kind: "video", url: r.url });
    }
    if (out.length >= 10) break;
  }
  return out;
}
