"use client";

import { useState } from "react";
import Image from "next/image";

export default function SortingControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Ім'я");

  const sortOptions = ["Ім'я", "Популярність"];

  const handleSelectOption = (option: string) => {
    setSelectedSort(option);
    setIsOpen(false);
  };

  return (
    <div className="flex gap-0 h-[60px] w-full sm:w-auto">
      {/* Dropdown Section */}
      <div className="relative flex-1 sm:flex-initial">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 h-[60px] w-full sm:min-w-[180px] bg-[#343434] border border-[#272727] hover:bg-[#3a3a3a] transition-colors"
        >
          <span className="font-h6 font-bold text-white text-[length:var(--h6-font-size)] tracking-[var(--h6-letter-spacing)] leading-[var(--h6-line-height)] [font-style:var(--h6-font-style)] whitespace-nowrap">
            {selectedSort}
          </span>
          <Image
            src={isOpen ? "/white_triangle_up.svg" : "/white_triangle_down.svg"}
            alt="Toggle"
            width={24}
            height={24}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-[#343434] border border-[#272727] border-t-0 z-10">
            {sortOptions
              .filter((option) => option !== selectedSort)
              .map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  className="w-full px-3 sm:px-4 py-3 text-left font-p1 font-[number:var(--p1-font-weight)] text-white text-[length:var(--p1-font-size)] tracking-[var(--p1-letter-spacing)] leading-[var(--p1-line-height)] [font-style:var(--p1-font-style)] hover:bg-[#3a3a3a] transition-colors"
                >
                  {option}
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Arrow Buttons Section */}
      <div className="flex flex-col justify-center w-[60px] h-[60px] bg-[#343434] border border-l-0 border-[#272727] gap-1 py-2 flex-shrink-0">
        <div className="flex items-center justify-center">
          <Image
            src="/white_triangle_up.svg"
            alt="Sort ascending"
            width={24}
            height={24}
          />
        </div>
        <div className="flex items-center justify-center">
          <Image
            src="/white_triangle_down.svg"
            alt="Sort descending"
            width={24}
            height={24}
          />
        </div>
      </div>
    </div>
  );
}
