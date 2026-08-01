"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import {Button} from "../../../components/ui/button";
import {Badge} from "../../../components/ui/badge";

export interface FeaturedWorkSlide {
  slug: string;
  title: string;
  image: string;
  likes: number;
  tags: string[];
}

const MAX_VISIBLE_TAGS = 5;
// Нижче цієї кількості робіт дублювання для безкінечної прокрутки виглядає як
// "зациклений" повтор 1-2 карток, а не плавна стрічка — тому просто показуємо
// реальну кількість без анімації.
const MIN_ITEMS_FOR_LOOP = 4;

interface FeaturedWorksProps {
  artworks: FeaturedWorkSlide[];
}

interface TagBadgeProps {
  label: string;
}

function TagBadge({ label }: TagBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Badge
      variant="secondary"
      className="inline-flex items-center justify-center gap-1 px-1 py-0.5 cursor-pointer transition-colors rounded-none"
      style={{
        backgroundColor: isHovered ? "#FECC39" : "#272727",
        borderRadius: 0,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className="font-wix font-p3 font-[number:var(--p3-font-weight)] text-[length:var(--p3-font-size)] text-center tracking-[var(--p3-letter-spacing)] leading-[var(--p3-line-height)] [font-style:var(--p3-font-style)] transition-colors"
        style={{ color: isHovered ? "#272727" : "white" }}
      >
        {label}
      </span>
      <Image
        src={isHovered ? "/black_cross.svg" : "/white_cross.svg"}
        alt="Remove"
        width={20}
        height={20}
      />
    </Badge>
  );
}

export default function FeaturedWorks({ artworks }: FeaturedWorksProps) {
const t = useTranslations("Main.featuredWorks");
const scrollRef = useRef<HTMLDivElement>(null);
const shouldLoop = artworks.length >= MIN_ITEMS_FOR_LOOP;

// Дублюємо масив для безкінечної прокрутки лише коли робіт достатньо,
// інакше цикл із 1-3 карток виглядає як зациклений глюк.
const displayArtworks = shouldLoop ? [...artworks, ...artworks, ...artworks] : artworks;

const uniqueTags = Array.from(new Set(artworks.flatMap((artwork) => artwork.tags))).slice(
  0,
  MAX_VISIBLE_TAGS
);

useEffect(() => {
  const scrollContainer = scrollRef.current;
  if (!scrollContainer || !shouldLoop) return;

  let scrollPosition = 0;
  const scrollSpeed = 1; // пикселей за кадр
  const itemWidth = 402; // 400px ширина + 2px gap (gap-0.5 = 0.125rem)
  const totalWidth = artworks.length * itemWidth;

  const scroll = () => {
    scrollPosition += scrollSpeed;

    // Когда прокрутили один полный набор, возвращаемся к началу второго набора
    if (scrollPosition >= totalWidth) {
      scrollPosition = 0;
      scrollContainer.scrollLeft = 0;
    }

    scrollContainer.scrollLeft = scrollPosition;
    requestAnimationFrame(scroll);
  };

  const animationId = requestAnimationFrame(scroll);

  return () => cancelAnimationFrame(animationId);
}, [artworks.length, shouldLoop]);

    return (
    <section className="flex flex-col items-center gap-[30px] px-0 py-10 md:py-20 w-full" style={{ backgroundColor: "#414141" }}>
      <div className="flex flex-col w-full max-w-[1440px] items-start gap-2.5 px-4">
        <p className="font-p1 font-[number:var(--p1-font-weight)] text-[length:var(--p1-font-size)] tracking-[var(--p1-letter-spacing)] leading-[var(--p1-line-height)] [font-style:var(--p1-font-style)]" style={{ color: "#FECC39" }}>
          {t("tagline")}
        </p>

        <h4
          className="font-[number:var(--h4-font-weight)] text-[length:var(--h4-font-size)] leading-[var(--h4-line-height)] font-h4 tracking-[var(--h4-letter-spacing)] [font-style:var(--h4-font-style)] text-white lg:whitespace-nowrap"
          style={{ maxWidth: "600px", fontSize: "clamp(24px, 5vw, 40px)", fontWeight: 700 }}
        >
          {t("title")}
        </h4>
      </div>

      {uniqueTags.length > 0 && (
        <div className="flex w-full max-w-[1440px] items-start gap-2 px-4 flex-wrap">
          {uniqueTags.map((tag) => (
            <TagBadge key={tag} label={tag} />
          ))}
        </div>
      )}

      <div
        ref={scrollRef}
        className={`flex w-full max-w-[1440px] items-start gap-0.5 p-0.5 bg-[#272727] border-2 border-solid border-[#272727] [&::-webkit-scrollbar]:hidden ${
          shouldLoop ? "overflow-x-hidden" : "overflow-x-auto"
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayArtworks.map((artwork, index) => (
          <div
            key={`${artwork.slug}-${index}`}
            className="flex flex-col min-w-[400px] h-[300px] items-start justify-center gap-2.5 relative"
          >
            <Link
              href={`/projects/${artwork.slug}`}
              aria-label={t("openProject", { title: artwork.title })}
              className="flex-1 w-full min-h-0 bg-cover bg-center bg-no-repeat relative group cursor-pointer overflow-hidden block shrink-0"
              style={{ backgroundImage: `url(${artwork.image})` }}
            >
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                <img
                  src="/arrow-chevron-right-white.svg"
                  alt=""
                  className="w-12 h-12"
                />
              </div>
              <div className="inline-flex items-center justify-end gap-2 absolute right-3 bottom-3 z-10 pointer-events-none">
                <span className="font-button font-[number:var(--button-font-weight)] text-white text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)]">
                  {artwork.likes}
                </span>
                <Image src="/like.svg" alt="Like" width={32} height={32} />
              </div>
            </Link>
          </div>
        ))}
      </div>

      <Button
        asChild
        className="w-[300px] h-[60px] p-3 text-black font-button text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)] transition-colors rounded-none"
        style={{
          backgroundColor: "#FECC39",
          fontWeight: 700,
          borderRadius: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "white";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#FECC39";
        }}
      >
        <Link href="/projects">{t("buttonText")}</Link>
      </Button>
    </section>
    )
}