"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "../../components/ui/card";
import { newsData } from "../../data/newsData";

interface ListOfNewsProps {
  currentPage: number;
  itemsPerPage: number;
}

export default function ListOfNews({ currentPage, itemsPerPage }: ListOfNewsProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = newsData.slice(startIndex, endIndex);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {currentNews.map((news) => (
        <Link href="/news_events/article" key={news.id}>
          <Card
            className="bg-transparent border-0 outline-none shadow-none rounded-none cursor-pointer group"
          >
            <CardContent className="p-0 flex flex-col gap-2 md:gap-3">
              {/* News image - square aspect ratio */}
              <div className="relative w-full aspect-square bg-cover bg-center overflow-hidden">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-cover"
                />
                {/* Darkening overlay on hover */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                
                {/* Centered arrow on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <Image src="/arrow-chevron-right-white.svg" alt="View" width={48} height={48} />
                </div>
              </div>
              {/* Category and Date */}
              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="text-white">Новини</span>
                <span className="text-white">{news.date}</span>
              </div>
              {/* News title */}
              <h3 className="font-h6 font-bold text-white text-lg md:text-xl lg:text-2xl tracking-[var(--h6-letter-spacing)] leading-[var(--h6-line-height)]">
                {news.title}
              </h3>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
