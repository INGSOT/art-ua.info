"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getVideoInfo } from "../../../../utils/videoUtils";

type WorkVideoEmbedProps = {
  workVideoUrl: string;
  onClearWorkVideo?: () => void;
};

export default function WorkVideoEmbed({
  workVideoUrl,
  onClearWorkVideo,
}: WorkVideoEmbedProps) {
  const videoInfo = getVideoInfo(workVideoUrl);
  const [vimeoSize, setVimeoSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const info = getVideoInfo(workVideoUrl);
    if (!info || info.provider !== "vimeo") {
      setVimeoSize(null);
      return;
    }
    let cancelled = false;
    setVimeoSize(null);
    fetch(
      `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(workVideoUrl)}`
    )
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("oEmbed"))))
      .then((data: { width?: number; height?: number }) => {
        if (
          cancelled ||
          typeof data.width !== "number" ||
          typeof data.height !== "number" ||
          data.width <= 0 ||
          data.height <= 0
        ) {
          return;
        }
        setVimeoSize({ w: data.width, h: data.height });
      })
      .catch(() => {
        if (!cancelled) setVimeoSize({ w: 16, h: 9 });
      });
    return () => {
      cancelled = true;
    };
  }, [workVideoUrl]);

  if (!videoInfo) return null;

  const aspectRatioCss =
    videoInfo.provider === "youtube"
      ? "16 / 9"
      : vimeoSize
        ? `${vimeoSize.w} / ${vimeoSize.h}`
        : "16 / 9";

  const iframeSrc =
    videoInfo.provider === "vimeo"
      ? `https://player.vimeo.com/video/${videoInfo.videoId}`
      : `https://www.youtube.com/embed/${videoInfo.videoId}`;

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={{ aspectRatio: aspectRatioCss }}
    >
      <iframe
        src={iframeSrc}
        title={
          videoInfo.provider === "vimeo"
            ? "Vimeo video player"
            : "YouTube video player"
        }
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="pointer-events-auto absolute inset-0 h-full w-full border-0"
      />
      {onClearWorkVideo ? (
        <button
          type="button"
          onClick={onClearWorkVideo}
          className="pointer-events-auto absolute top-2 right-2 z-20 flex h-10 w-10 items-center justify-center bg-[#343434]/90 hover:bg-[#FECC39] transition-colors group"
        >
          <Image
            src="/yellow_cross.svg"
            alt="Remove"
            width={24}
            height={24}
            className="group-hover:brightness-0 group-hover:saturate-100 group-hover:invert-[0.2] transition-all"
          />
        </button>
      ) : null}
    </div>
  );
}
