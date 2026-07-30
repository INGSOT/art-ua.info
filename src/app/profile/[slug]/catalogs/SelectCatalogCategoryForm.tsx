"use client";

import { useState } from "react";
import Image from "next/image";
import type { ArtCategory } from "../../../../lib/api/catalogs";

interface SelectCatalogCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ArtCategory[];
  selectedValue: string | null;
  onSelect: (categorySlug: string, subcategorySlug: string | null, label: string) => void;
}

export default function SelectCatalogCategoryForm({
  isOpen,
  onClose,
  categories,
  selectedValue,
  onSelect,
}: SelectCatalogCategoryFormProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePick = (categorySlug: string, subcategorySlug: string | null, label: string) => {
    onSelect(categorySlug, subcategorySlug, label);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-[60]" onClick={onClose} />

      {/* Slide-in Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-[#414141] z-[70] flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <h2 className="text-white text-[18px] font-bold">Галузь мистецтва</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#343434] transition-colors"
          >
            <Image src="/yellow_cross.svg" alt="Close" width={24} height={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 pb-6 flex flex-col gap-6 overflow-y-auto scrollbar-hide">
          {categories.map((category) =>
            category.subcategories.length > 0 ? (
              <div key={category.value} className="flex flex-col gap-4">
                {/* Category Title */}
                <h3 className="text-[#FECC39] text-[18px] font-bold">{category.label}</h3>

                {/* Subcategories */}
                <div className="flex flex-col">
                  {category.subcategories.map((subcategory) => {
                    const isSelected = selectedValue === subcategory.value;
                    const isHovered = hovered === subcategory.value;
                    return (
                      <button
                        key={subcategory.value}
                        onClick={() => handlePick(category.value, subcategory.value, subcategory.label)}
                        onMouseEnter={() => setHovered(subcategory.value)}
                        onMouseLeave={() => setHovered(null)}
                        className="flex items-center gap-4 px-4 py-4 bg-[#343434] transition-colors border-b border-[#414141] last:border-b-0"
                      >
                        <div
                          className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
                            isSelected || isHovered ? "border-[#FFD700]" : "border-white"
                          }`}
                        >
                          {isSelected && <div className="w-3 h-3 bg-[#FFD700]"></div>}
                        </div>
                        <span
                          className={`flex-1 text-left font-bold transition-colors ${
                            isSelected || isHovered ? "text-[#FFD700]" : "text-white"
                          }`}
                        >
                          {subcategory.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <button
                key={category.value}
                onClick={() => handlePick(category.value, null, category.label)}
                onMouseEnter={() => setHovered(category.value)}
                onMouseLeave={() => setHovered(null)}
                className="flex items-center gap-4 px-4 py-4 bg-[#343434] transition-colors"
              >
                <div
                  className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
                    selectedValue === category.value || hovered === category.value
                      ? "border-[#FFD700]"
                      : "border-white"
                  }`}
                >
                  {selectedValue === category.value && <div className="w-3 h-3 bg-[#FFD700]"></div>}
                </div>
                <span
                  className={`flex-1 text-left font-bold transition-colors ${
                    selectedValue === category.value || hovered === category.value
                      ? "text-[#FFD700]"
                      : "text-white"
                  }`}
                >
                  {category.label}
                </span>
              </button>
            )
          )}
        </div>
      </div>
    </>
  );
}
