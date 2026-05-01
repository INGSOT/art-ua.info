"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  parameterCategories,
  type ParameterCategory,
} from "../../../../data/parametersData";

export type ProjectParameterSelections = Record<string, string | null>;

interface ParametersSectionProps {
  selections: ProjectParameterSelections;
  onSelectionChange: (categoryId: string, optionId: string | null) => void;
}

function ParameterDropdown({
  category,
  selectedOptionId,
  onSelect,
  isOpen,
  onToggle,
  onClose,
}: {
  category: ParameterCategory;
  selectedOptionId: string | null;
  onSelect: (optionId: string | null) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedLabel =
    category.options.find((o) => o.id === selectedOptionId)?.label ?? null;
  const placeholder = `Оберіть ${category.labelUk}`;

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen, onClose]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={onToggle}
        className="w-full min-h-[50px] bg-[#343434] flex items-center justify-between gap-3 px-4 py-3 cursor-pointer hover:opacity-90 transition-opacity text-left"
      >
        <span className="font-bold text-white text-base">
          {selectedLabel ?? placeholder}
        </span>
        <Image
          src={
            isOpen ? "/white_triangle_up.svg" : "/white_triangle_down.svg"
          }
          alt=""
          width={24}
          height={24}
          className="flex-shrink-0"
        />
      </button>

      {isOpen && (
        <div className="scrollbar-hide absolute left-0 right-0 top-full z-50 mt-1 flex flex-col gap-px bg-[#272727] border border-[#272727] shadow-lg max-h-[280px] overflow-y-auto">
          <button
            type="button"
            onClick={() => {
              onSelect(null);
              onClose();
            }}
            className="w-full min-h-[48px] bg-[#343434] hover:bg-[#3a3a3a] px-4 py-3 text-left font-wix text-sm text-[#A0A0A0]"
          >
            {placeholder}
          </button>
          {category.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onSelect(opt.id);
                onClose();
              }}
              className={`w-full min-h-[50px] bg-[#343434] flex items-center px-4 cursor-pointer transition-colors hover:bg-[#3a3a3a] ${
                selectedOptionId === opt.id ? "text-[#FECC39]" : "text-white"
              }`}
            >
              <span className="font-bold text-base text-left">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ParametersSection({
  selections,
  onSelectionChange,
}: ParametersSectionProps) {
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  const leftColumn = parameterCategories.slice(0, 4);
  const rightColumn = parameterCategories.slice(4, 7);

  const renderColumn = (cats: ParameterCategory[]) => (
    <div className="flex flex-col gap-4 flex-1 min-w-0">
      {cats.map((category) => (
        <ParameterDropdown
          key={category.id}
          category={category}
          selectedOptionId={selections[category.id] ?? null}
          onSelect={(optionId) => onSelectionChange(category.id, optionId)}
          isOpen={openCategoryId === category.id}
          onToggle={() =>
            setOpenCategoryId((prev) =>
              prev === category.id ? null : category.id
            )
          }
          onClose={() => setOpenCategoryId(null)}
        />
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-[1000px] flex flex-col gap-6">
      <p className="font-wix text-white text-sm w-full text-left">
        Оберіть параметри вашої роботи для розширеного пошуку
      </p>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
        {renderColumn(leftColumn)}
        {renderColumn(rightColumn)}
      </div>
    </div>
  );
}
