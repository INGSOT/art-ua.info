"use client";

import { useState } from "react";
import Image from "next/image";
import { newProjectTexts, artCategories } from "../../../data/newProjectData";

interface SelectArtFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (subcategoryId: string, subcategoryLabel: string) => void;
  selectedSubcategory: string | null;
}

export default function SelectArtForm({
  isOpen,
  onClose,
  onSelect,
  selectedSubcategory,
}: SelectArtFormProps) {
  const [hoveredSubcategory, setHoveredSubcategory] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubcategoryClick = (subcategoryId: string, subcategoryLabel: string) => {
    onSelect(subcategoryId, subcategoryLabel);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-[#414141] z-50 flex flex-col animate-slide-in overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <h2 className="text-white text-[18px] font-bold">
            {newProjectTexts.artFieldModalTitle}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#343434] transition-colors"
          >
            <Image
              src="/yellow_cross.svg"
              alt="Close"
              width={24}
              height={24}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col gap-6">
          {artCategories.map((category) => (
            <div key={category.id} className="flex flex-col gap-4">
              {/* Category Title */}
              <h3 className="text-[#FECC39] text-[18px] font-bold">
                {category.title}
              </h3>

              {/* Subcategories */}
              <div className="flex flex-col">
                {category.subcategories.map((subcategory) => (
                  <button
                    key={subcategory.id}
                    onClick={() => handleSubcategoryClick(subcategory.id, subcategory.label)}
                    onMouseEnter={() => setHoveredSubcategory(subcategory.id)}
                    onMouseLeave={() => setHoveredSubcategory(null)}
                    className="flex items-center gap-4 px-6 py-4 bg-[#343434] transition-colors border-b border-[#414141] last:border-b-0"
                  >
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
                        selectedSubcategory === subcategory.id || hoveredSubcategory === subcategory.id
                          ? "border-[#FFD700]"
                          : "border-white"
                      }`}
                    >
                      {selectedSubcategory === subcategory.id && (
                        <div className="w-3 h-3 bg-[#FFD700]"></div>
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={`flex-1 text-left font-bold transition-colors ${
                        selectedSubcategory === subcategory.id || hoveredSubcategory === subcategory.id
                          ? "text-[#FFD700]"
                          : "text-white"
                      }`}
                    >
                      {subcategory.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
