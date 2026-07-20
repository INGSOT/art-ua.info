"use client";

import { useState } from "react";
import Image from "next/image";

export default function SortingControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Ім'я");
  const [selectedDirection, setSelectedDirection] = useState<"up" | "down">("up");

  const sortOptions = ["Ім'я", "Популярність"];

  const handleSelectOption = (option: string) => {
    setSelectedSort(option);
    setIsOpen(false);
  };

  return (
    <div className="flex gap-1 h-[44px] md:h-[48px] lg:h-[60px] w-auto flex-shrink-0">
      {/* Dropdown Section */}
      <div className="relative flex-initial">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between gap-1 md:gap-2 lg:gap-4 px-2 md:px-3 lg:px-4 h-[44px] md:h-[48px] lg:h-[60px] min-w-[88px] md:min-w-[104px] lg:min-w-[180px] bg-[#343434] hover:bg-[#3a3a3a] transition-colors"
        >
          <span className="font-bold text-white text-sm md:text-base lg:font-h6 lg:text-[length:var(--h6-font-size)] lg:tracking-[var(--h6-letter-spacing)] lg:leading-[var(--h6-line-height)] lg:[font-style:var(--h6-font-style)] whitespace-nowrap">
            {selectedSort}
          </span>
          <Image
            src={isOpen ? "/white_triangle_up.svg" : "/white_triangle_down.svg"}
            alt="Toggle"
            width={24}
            height={24}
            className="w-[18px] h-[18px] lg:w-6 lg:h-6 flex-shrink-0"
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full right-0 lg:left-0 lg:right-auto min-w-full w-max z-50 bg-[#343434]">
            {sortOptions
              .filter((option) => option !== selectedSort)
              .map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  className="block w-full px-2 md:px-3 lg:px-4 py-2 md:py-3 text-left font-bold text-white text-sm md:text-base lg:text-[length:var(--p1-font-size)] whitespace-nowrap hover:bg-[#3a3a3a] transition-colors"
                >
                  {option}
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Arrow Buttons Section */}
      <div className="flex flex-col justify-center w-[44px] md:w-[48px] lg:w-[60px] h-[44px] md:h-[48px] lg:h-[60px] bg-[#343434] gap-0 py-0 -space-y-2.5 flex-shrink-0">
        <button
          type="button"
          onClick={() => setSelectedDirection("up")}
          className="flex items-center justify-center"
        >
          <Image
            src={
              selectedDirection === "up"
                ? "/yellow_triangle_up.svg"
                : "/white_triangle_up.svg"
            }
            alt="Sort ascending"
            width={24}
            height={24}
            className="w-[18px] h-[18px] lg:w-6 lg:h-6"
          />
        </button>
        <button
          type="button"
          onClick={() => setSelectedDirection("down")}
          className="flex items-center justify-center"
        >
          <Image
            src={
              selectedDirection === "down"
                ? "/yellow_triangle_down.svg"
                : "/white_triangle_down.svg"
            }
            alt="Sort descending"
            width={24}
            height={24}
            className="w-[18px] h-[18px] lg:w-6 lg:h-6"
          />
        </button>
      </div>
    </div>
  );
}
