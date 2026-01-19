"use client";

import { Card, CardContent } from "../../components/ui/card";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";

const catalogData = [
  {
    id: 1,
    title: "Назва каталогу",
    image: "/gallery/mountain_landscape.png",
    artistPhoto: "/artists/artist-photo-3.png",
    artistName: "Вадим Ігнатенко",
    count: null,
  },
  {
    id: 2,
    title: "Дуже довга Назва каталогу на декілька дуже довгих слів",
    image: "/gallery/turquoise-blue_painting.png",
    artistPhoto: "/artists/artist-photo-3.png",
    artistName: "Вадим Ігнатенко",
    count: 17,
  },
  {
    id: 3,
    title: "Назва каталогу",
    image: "/gallery/autumn.png",
    artistPhoto: "/artists/artist-photo-3.png",
    artistName: "Вадим Ігнатенко",
    count: 17,
  },
  {
    id: 4,
    title: "Дуже довга Назва каталогу на декілька слів",
    image: "/gallery/samurai.png",
    artistPhoto: "/artists/artist-photo-3.png",
    artistName: "Вадим Ігнатенко",
    count: 17,
  },
];

export default function ImageCatalogSection() {
    return (
    <section className="flex flex-col items-center gap-[30px] px-0 py-20 w-full bg-[#414141] border-t border-solid border-[#343434]">
      <div className="flex flex-col w-full max-w-[1440px] items-start gap-2.5 px-4">
        <p className="font-p1 font-[number:var(--p1-font-weight)] text-[#FECC39] text-[length:var(--p1-font-size)] tracking-[var(--p1-letter-spacing)] leading-[var(--p1-line-height)] [font-style:var(--p1-font-style)]">
          Каталоги
        </p>

        <h4 className="font-h4 font-bold text-white text-[40px] leading-[var(--h4-line-height)] tracking-[var(--h4-letter-spacing)] [font-style:var(--h4-font-style)] max-w-[600px]">
          Каталоги
        </h4>
      </div>

      <div className="w-full max-w-[1440px] px-4">
        <ScrollArea className="w-full">
          <div className="flex items-start gap-[30px] pb-6">
            {catalogData.map((catalog) => (
              <Card
                key={catalog.id}
                className="w-[460px] flex-shrink-0 bg-transparent border-0 outline-none shadow-none"
              >
                <CardContent className="p-0 flex flex-col gap-2.5">
                  <div
                    className="relative h-[365px] w-full bg-cover bg-center bg-no-repeat rounded-none"
                    style={{ backgroundImage: `url(${catalog.image})` }}
                  >
                    <div className="absolute right-3 bottom-3 inline-flex items-center justify-end gap-2">
                      {catalog.count && (
                        <span className="font-button font-[number:var(--button-font-weight)] text-white text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)]">
                          {catalog.count}
                        </span>
                      )}
                      <img className="w-8 h-8" alt="Ui" src="/like.svg" />
                    </div>
                  </div>

                  <h3 className="font-button font-bold font-[700] text-white text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)]">
                    {catalog.title}
                  </h3>

                  <div className="flex items-center gap-2">
                    <Avatar className="w-[30px] h-[30px] border border-solid border-[#272727]">
                      <AvatarImage
                        src={catalog.artistPhoto}
                        alt="Artist photo"
                        className="object-cover"
                      />
                    </Avatar>

                    <span className="font-p3 font-[number:var(--p3-font-weight)] text-white text-[length:var(--p3-font-size)] tracking-[var(--p3-letter-spacing)] leading-[var(--p3-line-height)] [font-style:var(--p3-font-style)]">
                      {catalog.artistName}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="mt-6" />
        </ScrollArea>
      </div>

      <Button className="w-[300px] h-[60px] bg-[#FECC39] hover:bg-white hover:text-id-6 text-id-6 font-button font-bold font-[700] text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)] rounded-none">
        Усі каталоги
      </Button>
    </section>
    );
}