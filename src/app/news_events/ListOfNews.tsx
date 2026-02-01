"use client";

import Image from "next/image";
import { Card, CardContent } from "../../components/ui/card";

interface News {
  id: number;
  image: string;
  title: string;
  date: string;
}

const newsData: News[] = [
  { id: 1, image: "/news/news-image-1.png", title: "Назва новини або події в дві стрічки максимум", date: "12 січня 2026" },
  { id: 2, image: "/news/news-image-2.png", title: "Назва новини або події в дві стрічки максимум", date: "11 січня 2026" },
  { id: 3, image: "/news/news-image-3.png", title: "Назва новини або події в дві стрічки максимум", date: "10 січня 2026" },
  { id: 4, image: "/news/news-image-4.png", title: "Назва новини або події в дві стрічки максимум", date: "9 січня 2026" },
  { id: 5, image: "/news/news-image-5.jpg", title: "Назва новини або події в дві стрічки максимум", date: "8 січня 2026" },
  { id: 6, image: "/news/news-image-6.png", title: "Назва новини або події в дві стрічки максимум", date: "7 січня 2026" },
  { id: 7, image: "/news/news-image-7.png", title: "Назва новини або події в дві стрічки максимум", date: "6 січня 2026" },
  { id: 8, image: "/news/news-image-8.png", title: "Назва новини або події в дві стрічки максимум", date: "5 січня 2026" },
  { id: 9, image: "/news/news-image-9.png", title: "Назва новини або події в дві стрічки максимум", date: "4 січня 2026" },
  { id: 10, image: "/news/news-image-1.png", title: "Назва новини або події в дві стрічки максимум", date: "3 січня 2026" },
  { id: 11, image: "/news/news-image-2.png", title: "Назва новини або події в дві стрічки максимум", date: "2 січня 2026" },
  { id: 12, image: "/news/news-image-3.png", title: "Назва новини або події в дві стрічки максимум", date: "1 січня 2026" },
  { id: 13, image: "/news/news-image-4.png", title: "Назва новини або події в дві стрічки максимум", date: "31 грудня 2025" },
  { id: 14, image: "/news/news-image-5.jpg", title: "Назва новини або події в дві стрічки максимум", date: "30 грудня 2025" },
  { id: 15, image: "/news/news-image-6.png", title: "Назва новини або події в дві стрічки максимум", date: "29 грудня 2025" },
];

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
        <Card
          key={news.id}
          className="bg-transparent border-0 outline-none shadow-none rounded-none"
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
      ))}
    </div>
  );
}

export { newsData };
