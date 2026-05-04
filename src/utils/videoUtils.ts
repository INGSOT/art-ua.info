/**
 * Extracts YouTube video ID from various YouTube URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export function extractYouTubeId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // Handle youtu.be short links
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
    
    // Handle youtube.com links
    if (urlObj.hostname.includes('youtube.com')) {
      // Check for /watch?v= format
      const vParam = urlObj.searchParams.get('v');
      if (vParam) {
        return vParam;
      }
      
      // Check for /embed/ format
      const embedMatch = urlObj.pathname.match(/\/embed\/([^/?]+)/);
      if (embedMatch) {
        return embedMatch[1];
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Generates YouTube thumbnail URL from video ID
 * Uses maxresdefault for best quality, falls back to hqdefault
 */
export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

/**
 * Checks if a URL is a YouTube URL
 */
export function isYouTubeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('youtube.com') || urlObj.hostname === 'youtu.be';
  } catch {
    return false;
  }
}

/**
 * Extracts Vimeo numeric video ID from common URL shapes.
 */
export function extractVimeoId(url: string): string | null {
  try {
    const urlObj = new URL(url.trim());
    const host = urlObj.hostname.replace(/^www\./, "");

    if (host === "player.vimeo.com") {
      const match = urlObj.pathname.match(/^\/video\/(\d+)/);
      return match?.[1] ?? null;
    }

    if (host === "vimeo.com" || host === "vimeopro.com") {
      const path = urlObj.pathname;
      const direct = path.match(/^\/(\d+)\/?$/);
      if (direct) return direct[1];
      const trailing = path.match(/\/(?:videos\/)?(\d+)\/?$/);
      if (trailing) return trailing[1];
    }

    return null;
  } catch {
    return null;
  }
}

export type VideoProvider = "youtube" | "vimeo";

export type VideoInfo = {
  provider: VideoProvider;
  videoId: string;
  /** YouTube: always set. Vimeo: fetch via oEmbed where thumbnails are needed. */
  thumbnail: string;
};

/**
 * Gets video thumbnail and ID from URL (YouTube or Vimeo).
 */
export function getVideoInfo(url: string): VideoInfo | null {
  const youtubeId = extractYouTubeId(url);
  if (youtubeId) {
    return {
      provider: "youtube",
      videoId: youtubeId,
      thumbnail: getYouTubeThumbnail(youtubeId),
    };
  }

  const vimeoId = extractVimeoId(url);
  if (vimeoId) {
    return {
      provider: "vimeo",
      videoId: vimeoId,
      thumbnail: "",
    };
  }

  return null;
}
