"use client";

import { useState } from "react";
import Image from "next/image";
import { SITE_URL } from "../../../lib/siteDomains";
import { useToast } from "../../../context/ToastContext";

interface SocialLinksBarProps {
  slug: string;
  title: string;
}

// Стандартні share-intent URL. DeviantArt офіційного share-intent для довільних
// зовнішніх посилань не має — для нього замість попапу копіюємо посилання.
function buildShareUrl(network: string, pageUrl: string, title: string): string | null {
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(title);

  switch (network) {
    case "Facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "X":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    case "Pinterest":
      return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`;
    case "LinkedIn":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    default:
      return null;
  }
}

const SOCIAL_LINKS = [
  { icon: "/socials/link_yellow.svg", alt: "Посилання" },
  { icon: "/socials/facebook_yellow.svg", alt: "Facebook" },
  { icon: "/socials/x_yellow.svg", alt: "X" },
  { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest" },
  { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn" },
];

export default function SocialLinksBar({ slug, title }: SocialLinksBarProps) {
  const { showToast } = useToast();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleShareClick = async (network: string) => {
    const pageUrl = `${SITE_URL}/news-events/${slug}`;
    const shareUrl = buildShareUrl(network, pageUrl, title);

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=600");
      return;
    }

    try {
      await navigator.clipboard.writeText(pageUrl);
      showToast("Посилання на новину скопійовано", "green");
    } catch {
      showToast("Не вдалося скопіювати посилання", "red");
    }
  };

  return (
    <div className="bg-[#343434] py-10 px-8">
      <div className="flex justify-center items-center gap-[30px]">
        {SOCIAL_LINKS.map((social, index) => (
          <button
            key={social.alt}
            type="button"
            onClick={() => handleShareClick(social.alt)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            aria-label={buildShareUrl(social.alt, "", "") ? `Поділитися в ${social.alt}` : "Скопіювати посилання на новину"}
            className="w-11 h-11 flex items-center justify-center hover:bg-[#FECC39] transition-colors"
          >
            <Image
              src={hoveredIndex === index ? social.icon.replace("_yellow", "_black") : social.icon}
              alt={social.alt}
              width={20}
              height={20}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
