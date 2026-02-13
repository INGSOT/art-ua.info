"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { addCatalogTexts } from "../../../data/profileData";

interface AddCatalogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (imageUrl: string, catalogFile: File, catalogFileName: string) => void;
}

export default function AddCatalog({
  isOpen,
  onClose,
  onAdd,
}: AddCatalogProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [catalogFile, setCatalogFile] = useState<File | null>(null);
  const [isHoveringCatalogButton, setIsHoveringCatalogButton] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const catalogInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCatalogChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setCatalogFile(file);
    }
  };

  const handleImageUploadClick = () => {
    imageInputRef.current?.click();
  };

  const handleCatalogUploadClick = () => {
    catalogInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleRemoveCatalog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCatalogFile(null);
    if (catalogInputRef.current) {
      catalogInputRef.current.value = "";
    }
  };

  const handleAdd = () => {
    if (selectedImage && catalogFile) {
      onAdd(selectedImage, catalogFile, catalogFile.name);
      // Reset state
      setSelectedImage(null);
      setCatalogFile(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (catalogInputRef.current) catalogInputRef.current.value = "";
      onClose();
    }
  };

  if (!isOpen) return null;

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
            {addCatalogTexts.title}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#343434] transition-colors"
          >
            <Image
              src="/yellow_cross.svg"
              alt={addCatalogTexts.closeAlt}
              width={24}
              height={24}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col gap-6">
          {/* Image Upload Area */}
          <div
            onClick={handleImageUploadClick}
            className="relative w-full h-[280px] bg-[#343434] border-2 border-dashed border-black flex flex-col items-center justify-center cursor-pointer hover:bg-[#3a3a3a] transition-colors"
          >
            {selectedImage ? (
              <>
                <Image
                  src={selectedImage}
                  alt="Selected cover"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="absolute top-4 right-4 w-12 h-12 bg-[#343434] flex items-center justify-center hover:bg-[#414141] transition-colors z-10"
                >
                  <Image
                    src="/yellow_cross.svg"
                    alt={addCatalogTexts.imageRemoveAlt}
                    width={24}
                    height={24}
                  />
                </button>
              </>
            ) : (
              <>
                <Image
                  src="/upload.svg"
                  alt={addCatalogTexts.uploadIconAlt}
                  width={48}
                  height={48}
                  className="mb-4"
                />
                <p className="text-white text-center px-4 whitespace-pre-line">
                  {addCatalogTexts.imageUploadText}
                </p>
              </>
            )}
          </div>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Catalog Upload Button/Display */}
          {!catalogFile ? (
            <button
              onClick={handleCatalogUploadClick}
              className="w-full h-[160px] bg-[#343434] border-2 border-dashed border-black flex flex-col items-center justify-center cursor-pointer hover:bg-[#3a3a3a] transition-colors"
            >
              <Image
                src="/upload.svg"
                alt={addCatalogTexts.uploadIconAlt}
                width={48}
                height={48}
                className="mb-4"
              />
              <p className="text-white text-center px-4">
                {addCatalogTexts.catalogUploadText}
              </p>
            </button>
          ) : (
            <div
              onMouseEnter={() => setIsHoveringCatalogButton(true)}
              onMouseLeave={() => setIsHoveringCatalogButton(false)}
              className={`w-full h-[60px] flex items-stretch transition-all duration-300 cursor-pointer ${
                isHoveringCatalogButton
                  ? "bg-[#FECC39] text-[#343434]"
                  : "bg-[#343434] text-[#FECC39]"
              }`}
            >
              <div className="flex-1 flex items-center justify-center px-6">
                <span className="font-bold text-[18px] truncate">
                  {catalogFile.name}
                </span>
              </div>
              <div
                className={`w-[1px] ${
                  isHoveringCatalogButton ? "bg-[#343434]" : "bg-[#FECC39]"
                }`}
              />
              <button
                onClick={handleRemoveCatalog}
                className="w-[60px] flex items-center justify-center flex-shrink-0"
              >
                <Image
                  src={isHoveringCatalogButton ? "/black_cross.svg" : "/yellow_cross.svg"}
                  alt={addCatalogTexts.catalogRemoveAlt}
                  width={24}
                  height={24}
                />
              </button>
            </div>
          )}

          <input
            ref={catalogInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleCatalogChange}
            className="hidden"
          />
        </div>

        {/* Footer Button */}
        <div className="p-6 flex justify-center">
          <button
            onClick={handleAdd}
            disabled={!selectedImage || !catalogFile}
            className="w-full md:w-[320px] h-[60px] bg-[#FECC39] text-[#343434] font-bold text-[18px] hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addCatalogTexts.addButton}
          </button>
        </div>
      </div>
    </>
  );
}
