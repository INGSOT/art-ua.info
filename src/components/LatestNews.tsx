"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { newsAPI, type PublicNewsListItem } from "../lib/api/news";

const LATEST_COUNT = 5;
const SCROLL_STEP = 500;

export default function LatestNews() {
  const [latestNews, setLatestNews] = useState<PublicNewsListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredArrow, setHoveredArrow] = useState<"prev" | "next" | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    newsAPI
      .list({ per_page: LATEST_COUNT, language: "uk" })
      .then((result) => {
        if (isMounted) {
          setLatestNews(result.items);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLatestNews([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const scrollByStep = (direction: 1 | -1) => {
    trackRef.current?.scrollBy({
      left: direction * SCROLL_STEP,
      behavior: "smooth",
    });
  };

  if (!isLoading && latestNews.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col items-center gap-[30px] px-4 py-10 md:py-20 w-full bg-white">
      <div className="flex flex-col w-full max-w-[1440px] items-start gap-2.5">
        <p className="self-stretch mt-[-1.00px] font-p1 font-[number:var(--p1-font-weight)] text-[#FECC39] text-[length:var(--p1-font-size)] tracking-[var(--p1-letter-spacing)] leading-[var(--p1-line-height)] [font-style:var(--p1-font-style)]">
          Новини та події
        </p>

        <h4 className="self-stretch font-h4 font-bold text-black text-[24px] md:text-[32px] lg:text-[40px] tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)] [font-style:var(--h4-font-style)] max-w-[600px] lg:whitespace-nowrap">
          Актуальні новини та події у спільноті
        </h4>
      </div>

      <div className="relative w-full max-w-[1440px]">
        <button
          type="button"
          onClick={() => scrollByStep(-1)}
          onMouseEnter={() => setHoveredArrow("prev")}
          onMouseLeave={() => setHoveredArrow(null)}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-20 md:w-12 md:h-28 flex items-center justify-center bg-black/50 hover:bg-[#FECC39] transition-colors"
          aria-label="Previous"
        >
          <img
            src={hoveredArrow === "prev" ? "/arrow-chevron-left-black.svg" : "/arrow-chevron-left-white.svg"}
            alt="Previous"
            className="w-6 h-6 md:w-8 md:h-8"
          />
        </button>

        <div
          ref={trackRef}
          className="flex items-start gap-6 md:gap-[30px] lg:gap-[60px] w-full overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
        >
          {latestNews.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col flex-shrink-0 snap-start w-[85%] sm:w-[calc(50%-15px)] lg:w-[440px] items-start gap-2.5 border-0 shadow-none"
            >
              <CardContent className="flex flex-col w-full items-start gap-2.5 p-0">
                <Link href={`/news-events/${item.slug}`} className="w-full">
                  <div
                    className="relative w-full h-[400px] bg-cover bg-center bg-no-repeat group cursor-pointer overflow-hidden"
                    style={{
                      backgroundImage: `url(${item.mainImageUrl ?? "/news/no-image-news.png"})`,
                    }}
                  >
                    {/* Darkening overlay on hover */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>

                    {/* Centered arrow on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <img
                        src="/arrow-chevron-right-white.svg"
                        alt="View"
                        className="w-12 h-12"
                      />
                    </div>
                  </div>
                </Link>

                <div className="flex items-start gap-2.5 w-full">
                  <p className="flex-1 mt-[-1.00px] font-p3 font-[number:var(--p3-font-weight)] text-black text-[length:var(--p3-font-size)] tracking-[var(--p3-letter-spacing)] leading-[var(--p3-line-height)] [font-style:var(--p3-font-style)]">
                    {item.categoryLabel}
                  </p>

                  <p className="flex-1 mt-[-1.00px] font-p3 font-[number:var(--p3-font-weight)] text-black text-[length:var(--p3-font-size)] text-right tracking-[var(--p3-letter-spacing)] leading-[var(--p3-line-height)] [font-style:var(--p3-font-style)]">
                    {item.date}
                  </p>
                </div>

                <h3 className="self-stretch font-h6 font-bold text-black text-[length:var(--h6-font-size)] tracking-[var(--h6-letter-spacing)] leading-[var(--h6-line-height)] [font-style:var(--h6-font-style)] max-w-[600px]">
                  <Link
                    href={`/news-events/${item.slug}`}
                    className="hover:opacity-80 transition-opacity"
                  >
                    {item.title}
                  </Link>
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollByStep(1)}
          onMouseEnter={() => setHoveredArrow("next")}
          onMouseLeave={() => setHoveredArrow(null)}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-20 md:w-12 md:h-28 flex items-center justify-center bg-black/50 hover:bg-[#FECC39] transition-colors"
          aria-label="Next"
        >
          <img
            src={hoveredArrow === "next" ? "/arrow-chevron-right-black.svg" : "/arrow-chevron-right-white.svg"}
            alt="Next"
            className="w-6 h-6 md:w-8 md:h-8"
          />
        </button>
      </div>

      <div className="flex w-full max-w-[1440px] items-center justify-center">
        <Button
          asChild
          className="w-[300px] h-[60px] bg-[#343434] hover:bg-[#FECC39] text-[#FECC39] hover:text-[#343434] font-button font-bold text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)] rounded-none transition-colors"
        >
          <Link href="/news-events">Більше новин</Link>
        </Button>
      </div>
    </section>
  );
}
