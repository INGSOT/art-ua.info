"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { newProjectTexts } from "../../../data/newProjectData";

interface AddProjectCoverProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (imageUrl: string) => void;
  onImageRemove: () => void;
  currentImage: string | null;
  customTitle?: string;
  noAnimation?: boolean;
  onBack?: () => void;
}

export default function AddProjectCover({
  isOpen,
  onClose,
  onImageSelect,
  onImageRemove,
  currentImage,
  customTitle,
  noAnimation = false,
  onBack,
}: AddProjectCoverProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selectedImage with currentImage prop
  useEffect(() => {
    setSelectedImage(currentImage);
  }, [currentImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddImage = () => {
    if (selectedImage) {
      onImageSelect(selectedImage);
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
      <div className={`fixed right-0 top-0 h-full w-full md:w-[600px] bg-[#414141] z-50 flex flex-col ${noAnimation ? '' : 'animate-slide-in'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          {/* Back Button (only shown when onBack is provided) */}
          {onBack && (
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#343434] transition-colors"
            >
              <Image
                src="/yellow_triangle_left.svg"
                alt="Back"
                width={20}
                height={20}
              />
            </button>
          )}

          <h2 className={`text-white text-[18px] font-bold ${onBack ? 'flex-1 text-center' : ''}`}>
            {customTitle || newProjectTexts.addCoverTitle}
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
        <div className="flex-1 p-6 flex flex-col">
          {/* Upload Area */}
          <div
            onClick={handleUploadClick}
            className="relative w-full aspect-[4/3] bg-[#343434] border-2 border-dashed border-black flex flex-col items-center justify-center cursor-pointer hover:bg-[#3a3a3a] transition-colors"
          >
            {selectedImage || currentImage ? (
              <>
                <Image
                  src={selectedImage || currentImage || ""}
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
                    alt="Remove"
                    width={24}
                    height={24}
                  />
                </button>
              </>
            ) : (
              <>
                <Image
                  src="/upload.svg"
                  alt="Upload"
                  width={48}
                  height={48}
                  className="mb-4"
                />
                <p className="text-white text-center px-4 whitespace-pre-line">
                  {newProjectTexts.addCoverUploadText}
                </p>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Footer Button */}
        <div className="p-6 flex justify-center">
          <button
            onClick={handleAddImage}
            disabled={!selectedImage && !currentImage}
            className="w-full md:w-[320px] h-[60px] bg-[#FECC39] text-[#343434] font-bold text-[18px] hover:bg-white transition-colors disabled:cursor-not-allowed"
          >
            {newProjectTexts.addCoverButton}
          </button>
        </div>
      </div>
    </>
  );
}
