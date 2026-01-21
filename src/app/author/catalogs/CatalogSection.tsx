"use client";

import { useState } from "react";
import Image from "next/image";

interface CatalogSectionProps {
  title: string;
}

export default function CatalogSection({ title }: CatalogSectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full bg-[#343434] flex flex-col md:flex-row items-start md:items-center justify-between p-3 gap-3 md:gap-0">
      {/* Left side - Catalog title */}
      <div className="flex-1">
        <h3 className="font-button font-bold text-white text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)] max-w-[600px]">
          {title}
        </h3>
      </div>

      {/* Right side - Button */}
      <button
        className={`group flex items-stretch h-[60px] w-full md:w-[220px] lg:w-[240px] transition-colors duration-300 rounded-none overflow-hidden ${
          isHovered ? "bg-white" : "bg-[#FECC39]"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="flex items-center justify-center flex-1 px-4 sm:px-6 font-button font-bold text-[#343434] text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)] whitespace-nowrap">
          Відкрити
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
    </div>
  );
}
