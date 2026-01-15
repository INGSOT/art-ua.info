"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {Button} from "../../components/ui/button";
import {Badge} from "../../components/ui/badge";

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
        className="font-p3 font-[number:var(--p3-font-weight)] text-[length:var(--p3-font-size)] text-center tracking-[var(--p3-letter-spacing)] leading-[var(--p3-line-height)] [font-style:var(--p3-font-style)] transition-colors"
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

export default function FeaturedWorksSection() {
const scrollRef = useRef<HTMLDivElement>(null);

const tags = [
  { label: "Скульптури" },
  { label: "Картини" },
  { label: "Тег" },
  { label: "Тег" },
  { label: "Показуємо до 5 тегів" },
];

const artworks = [
  { image: "/autumn.png", likes: 17 },
  { image: "/big_lebovski.png", likes: 17 },
  { image: "/pulp_fiction.png", likes: 17 },
  { image: "/ship.png", likes: 17 },
  { image: "/mountain_landscape.png", likes: 17 },
  { image: "/whale.png", likes: 17 },
  { image: "/rain.png", likes: 17 },
  { image: "/abstractionism.png", likes: 17 },
];

// Дублируем массив для бесконечной прокрутки
const duplicatedArtworks = [...artworks, ...artworks, ...artworks];

useEffect(() => {
  const scrollContainer = scrollRef.current;
  if (!scrollContainer) return;

  let scrollPosition = 0;
  const scrollSpeed = 1; // пикселей за кадр
  const itemWidth = 400.5; // 400px ширина + 0.5px gap
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
}, [artworks.length]);

    return (
    <section className="flex flex-col items-center gap-[30px] px-0 py-10 md:py-20 w-full" style={{ backgroundColor: "#414141" }}>
      <div className="flex flex-col w-full max-w-[1440px] items-start gap-2.5 px-4">
        <p className="font-p1 font-[number:var(--p1-font-weight)] text-[length:var(--p1-font-size)] tracking-[var(--p1-letter-spacing)] leading-[var(--p1-line-height)] [font-style:var(--p1-font-style)]" style={{ color: "#FECC39" }}>
          Роботи
        </p>

        <h4
          className="font-[number:var(--h4-font-weight)] text-[length:var(--h4-font-size)] leading-[var(--h4-line-height)] font-h4 tracking-[var(--h4-letter-spacing)] [font-style:var(--h4-font-style)] text-white lg:whitespace-nowrap"
          style={{ maxWidth: "600px", fontSize: "clamp(24px, 5vw, 40px)", fontWeight: 700 }}
        >
          Найкращі роботи наших митців
        </h4>
      </div>

      <div className="flex w-full max-w-[1440px] items-start gap-2 px-4 flex-wrap">
        {tags.map((tag, index) => (
          <TagBadge key={index} label={tag.label} />
        ))}
      </div>

      <div 
        ref={scrollRef}
        className="flex w-full max-w-[1440px] items-start gap-0.5 p-0.5 bg-id-7 overflow-x-hidden border-2 border-solid border-[#272727] [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {duplicatedArtworks.map((artwork, index) => (
          <div
            key={index}
            className="flex flex-col min-w-[400px] h-[300px] items-start justify-center gap-2.5 relative"
          >
            <div
              className="flex-1 w-full bg-cover bg-center bg-no-repeat relative"
              style={{ backgroundImage: `url(${artwork.image})` }}
            >
              <div className="inline-flex items-center justify-end gap-2 absolute right-3 bottom-3">
                <span className="font-button font-[number:var(--button-font-weight)] text-white text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)]">
                  {artwork.likes}
                </span>
                <Image src="/like.svg" alt="Like" width={32} height={32} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        className="w-[300px] h-[60px] p-3 text-id-6 font-button text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)] transition-colors rounded-none"
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
        Усі роботи
      </Button>
    </section>
    )
}