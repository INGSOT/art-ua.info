"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import Image from "next/image";

interface ParticipantSectionProps {
  artistPhoto: string;
  artistName: string;
  artistType: string;
  tags: string[];
  photos: string[];
}

function TagBadge({ label }: { label: string }) {
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

export default function ParticipantSection({
  artistPhoto,
  artistName,
  artistType,
  tags,
  photos,
}: ParticipantSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className="flex flex-col w-full bg-[#343434] border border-solid border-[#272727]">
      {/* Upper Section */}
      <div className="flex flex-col lg:flex-row w-full">
        {/* Section 1: Artist Info */}
        <div className="flex items-center gap-3 p-3 bg-[#343434] border-b lg:border-b-0 lg:border-r border-[#272727]">
          <Avatar className="w-[60px] h-[60px] border border-solid border-[#272727] flex-shrink-0">
            <AvatarImage
              src={artistPhoto}
              alt={artistName}
              className="object-cover"
            />
          </Avatar>
          <div className="flex flex-col items-start gap-2">
            <h3 className="font-h6 font-bold text-white text-[length:var(--h6-font-size)] tracking-[var(--h6-letter-spacing)] leading-[var(--h6-line-height)] [font-style:var(--h6-font-style)]">
              {artistName}
            </h3>
            <div className="flex items-center gap-2">
              <Image src="/coins.svg" alt="Coins" width={20} height={20} />
              <span className="font-p3 font-[number:var(--p3-font-weight)] text-white text-[length:var(--p3-font-size)] tracking-[var(--p3-letter-spacing)] leading-[var(--p3-line-height)] [font-style:var(--p3-font-style)]">
                {artistType}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Tags */}
        <div className="flex flex-wrap items-start content-start gap-2 p-3 bg-[#343434] border-b lg:border-b-0 lg:border-r border-[#272727] flex-1">
          {tags.slice(0, 5).map((tag, index) => (
            <TagBadge key={index} label={tag} />
          ))}
        </div>

        {/* Section 3 & 4: Combined on Mobile/Tablet, Separate on Desktop */}
        <div className="flex items-center gap-0 p-3 bg-[#343434] border-b lg:border-b-0 lg:border-r border-[#272727] flex-1 lg:flex-initial lg:p-3">
          <button
            className="group flex items-stretch h-[60px] bg-[#FECC39] hover:bg-white transition-colors rounded-none overflow-hidden flex-1 lg:w-auto"
          >
            <span className="flex items-center justify-center flex-1 px-4 sm:px-6 font-button font-bold text-[#343434] text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)] whitespace-nowrap">
              До каталогу робіт
            </span>
            <div className="flex items-center justify-center w-[60px] border-l border-[#343434]">
              <Image
                src="/grey_triangle_right.svg"
                alt="Arrow"
                width={24}
                height={24}
              />
            </div>
          </button>
          
          {/* Toggle Button - Right of Catalog Button on Mobile/Tablet */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`group w-[60px] h-[60px] flex items-center justify-center transition-colors lg:hidden ml-3 ${
              isExpanded ? "bg-[#FECC39]" : "bg-transparent hover:bg-[#FECC39]"
            }`}
          >
            {isExpanded ? (
              <Image
                src="/grey_triangle_down.svg"
                alt="Collapse"
                width={24}
                height={24}
              />
            ) : (
              <>
                <Image
                  className="block group-hover:hidden"
                  src="/yellow_triangle_up.svg"
                  alt="Expand"
                  width={24}
                  height={24}
                />
                <Image
                  className="hidden group-hover:block"
                  src="/grey_triangle_up.svg"
                  alt="Expand hover"
                  width={24}
                  height={24}
                />
              </>
            )}
          </button>
        </div>

        {/* Section 4: Toggle Button - Desktop Only */}
        <div className="hidden lg:flex items-center justify-center p-3 bg-[#343434]">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`group w-[60px] h-[60px] flex items-center justify-center transition-colors ${
              isExpanded ? "bg-[#FECC39]" : "bg-transparent hover:bg-[#FECC39]"
            }`}
          >
            {isExpanded ? (
              <Image
                src="/grey_triangle_down.svg"
                alt="Collapse"
                width={24}
                height={24}
              />
            ) : (
              <>
                <Image
                  className="block group-hover:hidden"
                  src="/yellow_triangle_up.svg"
                  alt="Expand"
                  width={24}
                  height={24}
                />
                <Image
                  className="hidden group-hover:block"
                  src="/grey_triangle_up.svg"
                  alt="Expand hover"
                  width={24}
                  height={24}
                />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Lower Section: Photo Slider */}
      {isExpanded && (
        <div
          ref={sliderRef}
          className="flex items-start gap-[2px] p-0 bg-[#272727] border-t border-[#272727] overflow-x-auto cursor-grab active:cursor-grabbing"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {photos.map((photo, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[365px] h-[210px] sm:h-[240px] lg:h-[274px] bg-cover bg-center bg-no-repeat relative"
              style={{
                backgroundImage: `url(${photo})`,
                userSelect: "none",
              }}
            >
              <div className="absolute right-3 bottom-3 inline-flex items-center justify-end gap-2">
                <span className="font-button font-[number:var(--button-font-weight)] text-white text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)]">
                  17
                </span>
                <Image src="/like.svg" alt="Like" width={32} height={32} />
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
