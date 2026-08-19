"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export interface SortOption {
  slug: string;
  name: string;
}

interface SortingControlsProps {
  options: SortOption[];
  value: string;
  onChange: (slug: string) => void;
}

// Керований дропдаун сортування — та сама поведінка/стилі, що й sortDropdown на
// /projects (app/projects/page.tsx), лише винесена в окремий компонент.
export default function SortingControls({ options, value, onChange }: SortingControlsProps) {
  const t = useTranslations("Authors.sorting");
  const [isOpen, setIsOpen] = useState(false);
  const activeOption = options.find((option) => option.slug === value) ?? options[0];

  const handleSelectOption = (slug: string) => {
    onChange(slug);
    setIsOpen(false);
  };

  return (
    <div className="relative h-[44px] w-full min-w-0 md:h-[48px] lg:h-[60px]">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-[44px] w-full min-w-0 items-center justify-between gap-1 bg-[#343434] px-2 transition-colors hover:bg-[#3a3a3a] md:h-[48px] md:gap-2 md:px-3 lg:h-[60px] lg:min-w-[180px] lg:gap-4 lg:px-4"
      >
        <span className="min-w-0 truncate whitespace-nowrap text-sm font-bold text-white md:text-base lg:font-h6 lg:text-[length:var(--h6-font-size)] lg:tracking-[var(--h6-letter-spacing)] lg:leading-[var(--h6-line-height)] lg:[font-style:var(--h6-font-style)]">
          {activeOption?.name}
        </span>
        <Image
          src={isOpen ? "/white_triangle_up.svg" : "/white_triangle_down.svg"}
          alt={t("toggleAlt")}
          width={24}
          height={24}
          className="w-[18px] h-[18px] lg:w-6 lg:h-6 flex-shrink-0"
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 lg:left-0 lg:right-auto min-w-full w-max z-50 bg-[#343434]">
          {options
            .filter((option) => option.slug !== activeOption?.slug)
            .map((option) => (
              <button
                type="button"
                key={option.slug}
                onClick={() => handleSelectOption(option.slug)}
                className="block w-full px-2 md:px-3 lg:px-4 py-2 md:py-3 text-left font-bold text-white text-sm md:text-base lg:text-[length:var(--p1-font-size)] whitespace-nowrap hover:bg-[#3a3a3a] transition-colors"
              >
                {option.name}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
