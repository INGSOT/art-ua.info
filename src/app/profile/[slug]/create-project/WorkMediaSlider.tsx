"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import WorkVideoEmbed from "./WorkVideoEmbed";
import type { ProjectWorkMediaItem } from "./projectWorkMedia";

interface WorkMediaSliderProps {
  items: ProjectWorkMediaItem[];
  onEditClick: () => void;
}

export default function WorkMediaSlider({
  items,
  onEditClick,
}: WorkMediaSliderProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (activeSlide >= items.length && items.length > 0) {
      setActiveSlide(items.length - 1);
    }
  }, [items.length, activeSlide]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  if (items.length === 0) return null;

  const current = items[activeSlide];

  return (
    <div className="w-full max-w-[1000px] flex flex-col items-center">
      <div
        className={`relative w-full bg-[#343434] mb-6 overflow-hidden ${
          current.kind === "image" ? "aspect-[4/3]" : ""
        }`}
      >
        {current.kind === "image" ? (
          <Image
            src={current.src}
            alt={`Slide ${activeSlide + 1}`}
            fill
            className="object-cover"
          />
        ) : (
          <WorkVideoEmbed workVideoUrl={current.url} />
        )}
        <button
          type="button"
          onClick={onEditClick}
          className="absolute top-4 right-4 w-12 h-12 bg-[#343434] flex items-center justify-center hover:bg-[#414141] transition-colors z-30"
        >
          <Image
            src="/yellow_cross.svg"
            alt="Редагувати галерею"
            width={24}
            height={24}
          />
        </button>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button type="button" onClick={handlePrevSlide}>
          <Image
            src="/white-arrow-left-slider.svg"
            alt="Попередній"
            width={32}
            height={32}
          />
        </button>

        <div className="flex gap-2">
          {items.map((_, index) => (
            <Image
              key={index}
              src={
                activeSlide === index
                  ? "/white-slider-item-active.svg"
                  : "/white-slider-item-non-active.svg"
              }
              alt=""
              width={20}
              height={20}
            />
          ))}
        </div>

        <button type="button" onClick={handleNextSlide}>
          <Image
            src="/white-arrow-right-slider.svg"
            alt="Наступний"
            width={32}
            height={32}
          />
        </button>
      </div>
    </div>
  );
}
