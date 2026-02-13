"use client";

import Image from "next/image";
import { deleteCatalogTexts } from "../../../data/profileData";

interface DeleteCatalogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteCatalog({
  isOpen,
  onClose,
  onDelete,
}: DeleteCatalogProps) {
  if (!isOpen) return null;

  const handleDelete = () => {
    onDelete();
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
      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-[#414141] z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <h2 className="text-white text-[18px] font-bold">
            {deleteCatalogTexts.title}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#343434] transition-colors"
          >
            <Image
              src="/yellow_cross.svg"
              alt={deleteCatalogTexts.closeAlt}
              width={24}
              height={24}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col">
          {/* Description */}
          <p className="text-white text-[16px] leading-relaxed mb-6 whitespace-pre-line">
            {deleteCatalogTexts.description}
          </p>

          {/* Divider */}
          <div className="w-full h-[1px] bg-[#343434] mb-6" />

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="w-full h-[60px] bg-[#343434] text-[#FECC39] font-bold text-[18px] mb-4 transition-colors hover:bg-[#FECC39] hover:text-[#343434]"
          >
            {deleteCatalogTexts.deleteButton}
          </button>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="w-full h-[60px] bg-[#FECC39] text-[#343434] font-bold text-[18px] transition-colors hover:bg-white"
          >
            {deleteCatalogTexts.cancelButton}
          </button>
        </div>
      </div>
    </>
  );
}
