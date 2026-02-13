"use client";

import { useState } from "react";
import Image from "next/image";
import { catalogsTexts, myCatalogs } from "../../../data/profileData";

export default function Catalogs() {
  const [selectedCatalogs, setSelectedCatalogs] = useState<number[]>([]);
  const [hoveredCheckbox, setHoveredCheckbox] = useState<number | null>(null);

  const toggleCatalogSelection = (catalogId: number) => {
    setSelectedCatalogs((prev) =>
      prev.includes(catalogId)
        ? prev.filter((id) => id !== catalogId)
        : [...prev, catalogId]
    );
  };

  const handleDelete = (catalogId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Delete catalog:", catalogId);
    // TODO: Implement delete functionality
  };

  return (
    <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-20">
      {/* Add Catalog Button */}
      <div className="mb-8 flex justify-center">
        <button className="h-[60px] flex items-stretch transition-all duration-300 rounded-none bg-[#FECC39] hover:bg-white w-full md:w-[320px]">
          <span className="flex items-center justify-center flex-1 px-6 font-bold text-black whitespace-nowrap">
            {catalogsTexts.addCatalogButton}
          </span>
          <div className="flex items-center justify-center w-[60px] flex-shrink-0 border-l border-black">
            <Image src="/plus.svg" alt={catalogsTexts.addCatalogButtonIconAlt} width={24} height={24} />
          </div>
        </button>
      </div>

      {/* Catalogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCatalogs.map((catalog) => (
          <div key={catalog.id} className="relative group">
            {/* Catalog Card */}
            <div className="relative w-full aspect-[4/3] bg-cover bg-center">
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={catalog.image}
                  alt={catalog.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Checkbox in top-left corner */}
              <div className="absolute top-3 left-3 z-[30]">
                <div
                  className="relative bg-[#343434] p-2 cursor-pointer"
                  onMouseEnter={() => setHoveredCheckbox(catalog.id)}
                  onMouseLeave={() => setHoveredCheckbox(null)}
                  onClick={() => toggleCatalogSelection(catalog.id)}
                >
                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
                      selectedCatalogs.includes(catalog.id) || hoveredCheckbox === catalog.id
                        ? "border-[#FFD700]"
                        : "border-white"
                    }`}
                  >
                    {selectedCatalogs.includes(catalog.id) && (
                      <div className="w-3 h-3 bg-[#FFD700]"></div>
                    )}
                  </div>

                  {/* Tooltip on hover */}
                  {hoveredCheckbox === catalog.id && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-3 z-[9999]">
                      {/* Tooltip content */}
                      <div
                        className="bg-[#272727] w-[200px] h-[104px] flex items-center justify-center px-4"
                        style={{ transform: "translateX(calc(50% - 6px))" }}
                      >
                        <p className="text-white text-sm text-center leading-tight">
                          {catalogsTexts.tooltip}
                        </p>
                      </div>
                      {/* Triangle pointer */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                        <Image
                          src="/black_triangle_down.svg"
                          alt=""
                          width={12}
                          height={8}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Delete button in top-right corner */}
              <div className="absolute top-3 right-3 z-20">
                <button
                  onClick={(e) => handleDelete(catalog.id, e)}
                  className="bg-[#343434] p-2 hover:bg-[#272727] transition-colors"
                >
                  <Image
                    src="/yellow_cross.svg"
                    alt={catalogsTexts.deleteIconAlt}
                    width={20}
                    height={20}
                  />
                </button>
              </div>

              {/* Likes in bottom-right corner */}
              <div className="absolute right-3 bottom-3 flex items-center gap-2 z-10">
                <span className="font-button font-bold text-white text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)]">
                  {catalog.likes}
                </span>
                <Image src="/like.svg" alt={catalogsTexts.likeIconAlt} width={32} height={32} />
              </div>
            </div>

            {/* Catalog title below image */}
            <h3 className="mt-3 font-h6 font-bold text-white text-[length:var(--h6-font-size)] tracking-[var(--h6-letter-spacing)] leading-[var(--h6-line-height)]">
              {catalog.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
