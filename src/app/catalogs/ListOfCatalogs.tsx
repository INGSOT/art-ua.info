"use client";

import Image from "next/image";
import { Card, CardContent } from "../../components/ui/card";

interface Catalog {
  id: number;
  image: string;
  title: string;
  likes: number;
  authorAvatar: string;
  authorName: string;
}

const catalogsData: Catalog[] = [
  { id: 1, image: "/projects/project-photo-1.png", title: "Назва каталога", likes: 17, authorAvatar: "/image-13.png", authorName: "Ім'я Прізвище" },
  { id: 2, image: "/projects/project-photo-2.png", title: "Назва каталога", likes: 17, authorAvatar: "/image-13.png", authorName: "Ім'я Прізвище" },
  { id: 3, image: "/projects/project-photo-3.png", title: "Назва каталога", likes: 35, authorAvatar: "/image-13.png", authorName: "Ім'я Прізвище" },
  { id: 4, image: "/projects/project-photo-4.png", title: "Назва каталога", likes: 17, authorAvatar: "/image-13.png", authorName: "Ім'я Прізвище" },
  { id: 5, image: "/projects/project-photo-1.png", title: "Назва каталога", likes: 22, authorAvatar: "/image-13.png", authorName: "Ім'я Прізвище" },
  { id: 6, image: "/projects/project-photo-2.png", title: "Назва каталога", likes: 19, authorAvatar: "/image-13.png", authorName: "Ім'я Прізвище" },
  { id: 7, image: "/projects/project-photo-3.png", title: "Назва каталога", likes: 28, authorAvatar: "/image-13.png", authorName: "Ім'я Прізвище" },
  { id: 8, image: "/projects/project-photo-4.png", title: "Назва каталога", likes: 31, authorAvatar: "/image-13.png", authorName: "Ім'я Прізвище" },
  { id: 9, image: "/projects/project-photo-1.png", title: "Назва каталога", likes: 15, authorAvatar: "/image-13.png", authorName: "Ім'я Прізвище" },
  { id: 10, image: "/projects/project-photo-2.png", title: "Назва каталога", likes: 24, authorAvatar: "/image-13.png", authorName: "Ім'я Прізвище" },
  { id: 11, image: "/projects/project-photo-3.png", title: "Назва каталога", likes: 18, authorAvatar: "/image-13.png", authorName: "Ім'я Прізвище" },
  { id: 12, image: "/projects/project-photo-4.png", title: "Назва каталога", likes: 26, authorAvatar: "/image-13.png", authorName: "Ім'я Прізвище" },
  { id: 13, image: "/projects/project-photo-1.png", title: "Назва каталога", likes: 20, authorAvatar: "/image-13.png", authorName: "Ім'я Прізвище" },
  { id: 14, image: "/projects/project-photo-2.png", title: "Назва каталога", likes: 33, authorAvatar: "/image-13.png", authorName: "Ім'я Прізвище" },
  { id: 15, image: "/projects/project-photo-3.png", title: "Назва каталога", likes: 29, authorAvatar: "/image-13.png", authorName: "Ім'я Прізвище" },
];

interface ListOfCatalogsProps {
  currentPage: number;
  itemsPerPage: number;
}

export default function ListOfCatalogs({ currentPage, itemsPerPage }: ListOfCatalogsProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCatalogs = catalogsData.slice(startIndex, endIndex);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {currentCatalogs.map((catalog) => (
        <Card
          key={catalog.id}
          className="bg-transparent border-0 outline-none shadow-none rounded-none"
        >
          <CardContent className="p-0 flex flex-col gap-2 md:gap-3">
            {/* Catalog image with likes overlay */}
            <div className="relative w-full aspect-[460/316] bg-cover bg-center rounded-sm overflow-hidden">
              <Image
                src={catalog.image}
                alt={catalog.title}
                fill
                className="object-cover"
              />
              <div className="absolute right-2 bottom-2 md:right-3 md:bottom-3 flex items-center gap-1 md:gap-2">
                <span className="font-button font-bold text-white text-sm md:text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)]">
                  {catalog.likes}
                </span>
                <Image src="/like.svg" alt="Like" width={24} height={24} className="md:w-8 md:h-8" />
              </div>
            </div>
            {/* Catalog title */}
            <h3 className="font-h6 font-bold text-white text-base md:text-lg lg:text-[length:var(--h6-font-size)] tracking-[var(--h6-letter-spacing)] leading-[var(--h6-line-height)]">
              {catalog.title}
            </h3>
            {/* Author info */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden border-2 border-yellow-500">
                <Image
                  src={catalog.authorAvatar}
                  alt={catalog.authorName}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <span className="text-white text-xs md:text-sm font-bold">{catalog.authorName}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export { catalogsData };
