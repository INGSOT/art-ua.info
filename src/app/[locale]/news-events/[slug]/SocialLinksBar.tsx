"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { SITE_URL } from "../../../../lib/siteDomains";
import { useToast } from "../../../../context/ToastContext";

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

const SOCIAL_NETWORKS = [
  { icon: "/socials/link_yellow.svg", network: "Link" },
  { icon: "/socials/facebook_yellow.svg", network: "Facebook" },
  { icon: "/socials/x_yellow.svg", network: "X" },
  { icon: "/socials/pinterest_yellow.svg", network: "Pinterest" },
  { icon: "/socials/linked_in_yellow.svg", network: "LinkedIn" },
];

export default function SocialLinksBar({ slug, title }: SocialLinksBarProps) {
  const { showToast } = useToast();
  const t = useTranslations("News.social");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const SOCIAL_LINKS = SOCIAL_NETWORKS.map((item) => ({
    icon: item.icon,
    network: item.network,
    alt: item.network === "Link" ? t("linkAlt") : item.network,
  }));

  const handleShareClick = async (network: string) => {
    const pageUrl = `${SITE_URL}/news-events/${slug}`;
    const shareUrl = buildShareUrl(network, pageUrl, title);

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=600");
      return;
    }

    try {
      await navigator.clipboard.writeText(pageUrl);
      showToast(t("linkCopied"), "green");
    } catch {
      showToast(t("copyFailed"), "red");
    }
  };

  return (
    <div className="bg-[#343434] py-10 px-8">
      <div className="flex justify-center items-center gap-[30px]">
        {SOCIAL_LINKS.map((social, index) => (
          <button
            key={social.network}
            type="button"
            onClick={() => handleShareClick(social.network)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            aria-label={
              buildShareUrl(social.network, "", "")
                ? t("shareIn", { network: social.alt })
                : t("copyLink")
            }
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
