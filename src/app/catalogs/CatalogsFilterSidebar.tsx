"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import type { CatalogsFilterCategory } from "../../lib/api/publicCatalogs";

interface CatalogsFilterSidebarProps {
  className?: string;
  categories: CatalogsFilterCategory[];
  selectedSubcategories: string[];
  onToggleSubcategory: (slug: string) => void;
}

// Категорії без підкатегорій (напр. "Музичне мистецтво", "Інше") — самі є
// вибірковим значенням фільтра, тож рендеряться як один рядок замість секції.
export default function CatalogsFilterSidebar({
  className = "",
  categories,
  selectedSubcategories,
  onToggleSubcategory,
}: CatalogsFilterSidebarProps) {
  return (
    <div className={`flex flex-col w-full lg:w-[300px] flex-shrink-0 ${className}`}>
      {categories.map((category, index) =>
        category.subcategories.length > 0 ? (
          <Unit key={category.slug} title={category.name} isLast={index === categories.length - 1}>
            {category.subcategories.map((sub) => (
              <CheckRow
                key={sub.slug}
                label={sub.name}
                count={sub.catalogs_count}
                isSelected={selectedSubcategories.includes(sub.slug)}
                onToggle={() => onToggleSubcategory(sub.slug)}
              />
            ))}
          </Unit>
        ) : (
          <Unit key={category.slug} title={category.name} isLast={index === categories.length - 1} standalone>
            <CheckRow
              label="Показати"
              count={category.catalogs_count}
              isSelected={selectedSubcategories.includes(category.slug)}
              onToggle={() => onToggleSubcategory(category.slug)}
            />
          </Unit>
        )
      )}
    </div>
  );
}

function Unit({
  title,
  children,
  isLast = false,
  standalone = false,
}: {
  title: string;
  children: ReactNode;
  isLast?: boolean;
  standalone?: boolean;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className={`pb-5 mb-5 ${isLast ? "" : "border-b border-[#343434]"}`}>
      <button
        type="button"
        onClick={() => (standalone ? undefined : setOpen((prev) => !prev))}
        className="w-full bg-[#343434] flex items-center justify-between px-3 py-3 mb-3 transition-colors hover:text-[#FECC39]"
      >
        <span className="font-bold text-sm text-white">{title}</span>
        {!standalone && (
          <Image
            src={open ? "/white_triangle_down.svg" : "/white_triangle_up.svg"}
            alt=""
            width={16}
            height={16}
          />
        )}
      </button>
      {(standalone || open) && <div className="flex flex-col gap-px">{children}</div>}
    </div>
  );
}

function CheckRow({
  label,
  count,
  isSelected,
  onToggle,
}: {
  label: string;
  count?: number;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isDisabled = !isSelected && !count;

  return (
    <button
      type="button"
      onClick={isDisabled ? undefined : onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isDisabled}
      className={`w-full h-11 px-3 flex items-center gap-3 text-left bg-[#343434] transition-colors ${
        isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <div
        className={`w-5 h-5 flex items-center justify-center flex-shrink-0 transition-colors ${
          isSelected ? "bg-[#FECC39]" : "bg-[#414141]"
        }`}
      >
        <Image
          src={isHovered && !isSelected && !isDisabled ? "/yellow_check.svg" : "/grey_check.svg"}
          alt=""
          width={12}
          height={12}
        />
      </div>
      <span
        className={`text-sm font-bold transition-colors ${
          isSelected ? "text-[#FECC39]" : isHovered && !isDisabled ? "text-[#FECC39]" : "text-white"
        }`}
      >
        {label}
        {typeof count === "number" && count > 0 ? ` (${count})` : ""}
      </span>
    </button>
  );
}
