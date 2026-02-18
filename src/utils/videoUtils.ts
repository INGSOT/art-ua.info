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
 * Gets video thumbnail and ID from URL
 */
export function getVideoInfo(url: string): { thumbnail: string; videoId: string } | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  
  return {
    thumbnail: getYouTubeThumbnail(videoId),
    videoId
  };
}
