"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageGallerySliderProps {
  images: string[];
  onEditClick: () => void;
}

export default function ImageGallerySlider({
  images,
  onEditClick,
}: ImageGallerySliderProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  // Reset activeSlide if it exceeds the array bounds
  useEffect(() => {
    if (activeSlide >= images.length && images.length > 0) {
      setActiveSlide(images.length - 1);
    }
  }, [images.length, activeSlide]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) return null;

  return (
    <div className="w-full max-w-[1000px] flex flex-col items-center">
      {/* Main Image */}
      <div className="relative w-full aspect-[4/3] bg-[#343434] mb-6">
        <Image
          src={images[activeSlide]}
          alt={`Slide ${activeSlide + 1}`}
          fill
          className="object-cover"
        />
        {/* Edit Button (Cross Icon) */}
        <button
          onClick={onEditClick}
          className="absolute top-4 right-4 w-12 h-12 bg-[#343434] flex items-center justify-center hover:bg-[#414141] transition-colors z-10"
        >
          <Image
            src="/yellow_cross.svg"
            alt="Edit"
            width={24}
            height={24}
          />
        </button>
      </div>

      {/* Slider Controls */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={handlePrevSlide}>
          <Image
            src="/white-arrow-left-slider.svg"
            alt="Previous"
            width={32}
            height={32}
          />
        </button>

        <div className="flex gap-2">
          {images.map((_, index) => (
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

        <button onClick={handleNextSlide}>
          <Image
            src="/white-arrow-right-slider.svg"
            alt="Next"
            width={32}
            height={32}
          />
        </button>
      </div>
    </div>
  );
}
