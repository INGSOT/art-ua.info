"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "../../components/ui/card";
import type { NewsItem } from "../../data/newsData";

interface ListOfNewsProps {
  news: NewsItem[];
  disableHover?: boolean;
}

export default function ListOfNews({ news, disableHover = false }: ListOfNewsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {news.map((newsItem) => (
        <Link
          href={`/news_events/${newsItem.slug}`}
          key={newsItem.id}
          onClick={(event) => {
            if (disableHover) {
              event.preventDefault();
            }
          }}
          aria-disabled={disableHover}
          tabIndex={disableHover ? -1 : undefined}
        >
          <Card
            className={`bg-transparent border-0 outline-none shadow-none rounded-none ${disableHover ? "cursor-default" : "cursor-pointer group"}`}
          >
            <CardContent className="p-0 flex flex-col gap-2 md:gap-3">
              {/* News image - square aspect ratio */}
              <div className="relative w-full aspect-square bg-cover bg-center overflow-hidden">
                <Image
                  src={newsItem.mainImage}
                  alt={newsItem.title}
                  fill
                  className="object-cover"
                />
                {/* Darkening overlay on hover */}
                <div className={`absolute inset-0 bg-black opacity-0 transition-opacity duration-300 ${disableHover ? "" : "group-hover:opacity-50"}`}></div>
                
                {/* Centered arrow on hover */}
                <div className={`absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 z-10 ${disableHover ? "" : "group-hover:opacity-100"}`}>
                  <Image src="/arrow-chevron-right-white.svg" alt="View" width={48} height={48} />
                </div>
              </div>
              {/* Category and Date */}
              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="font-wix text-white">{newsItem.category}</span>
                <span className="font-wix text-white">{newsItem.date}</span>
              </div>
              {/* News title */}
              <h3 className="font-h6 font-bold text-white text-lg md:text-xl lg:text-2xl tracking-[var(--h6-letter-spacing)] leading-[var(--h6-line-height)]">
                {newsItem.title}
              </h3>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
