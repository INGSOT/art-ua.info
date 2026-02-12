"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { newProjectTexts } from "../../../data/newProjectData";

interface AddImageGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onImagesSelect: (images: string[]) => void;
  onImagesUpdate?: (images: string[]) => void;
  currentImages: string[];
  noAnimation?: boolean;
  onBack?: () => void;
}

export default function AddImageGallery({
  isOpen,
  onClose,
  onImagesSelect,
  onImagesUpdate,
  currentImages,
  noAnimation = false,
  onBack,
}: AddImageGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync images with currentImages prop
  useEffect(() => {
    setImages(currentImages);
  }, [currentImages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      const maxImages = 10;
      const remainingSlots = maxImages - images.length;
      const filesToProcess = Math.min(files.length, remainingSlots);

      let processedCount = 0;

      for (let i = 0; i < filesToProcess; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          processedCount++;

          if (processedCount === filesToProcess) {
            setImages([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleUploadClick = () => {
    if (images.length < 10) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    // Immediately sync with parent component without closing modal
    if (onImagesUpdate) {
      onImagesUpdate(newImages);
    }
  };

  const handleMoveLeft = (index: number) => {
    if (index > 0) {
      const newImages = [...images];
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      setImages(newImages);
    }
  };

  const handleMoveRight = (index: number) => {
    if (index < images.length - 1) {
      const newImages = [...images];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      setImages(newImages);
    }
  };

  const handleAddImages = () => {
    onImagesSelect(images);
    onClose();
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

          <h2 className={`text-white text-[18px] font-bold ${onBack ? 'flex-1 text-left' : ''}`}>
            {newProjectTexts.addImageGalleryTitle}
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

        {/* Subtitle */}
        <p className="px-6 text-white text-left text-sm mb-2">
          {newProjectTexts.addImageGallerySubtitle}
        </p>

        {/* Content */}
        <div className="flex-1 px-6 pb-6 pt-4 flex flex-col overflow-y-auto">

          {/* Upload Area */}
          <div
            onClick={handleUploadClick}
            className={`relative w-full h-[240px] bg-[#343434] border-2 border-dashed border-black flex flex-col items-center justify-center mb-4 ${images.length < 10 ? 'cursor-pointer hover:bg-[#3a3a3a]' : 'cursor-not-allowed opacity-50'} transition-colors`}
          >
            <Image
              src="/upload.svg"
              alt="Upload"
              width={48}
              height={48}
              className="mb-4"
            />
            <p className="text-white text-center px-4">
              {newProjectTexts.addImageGalleryUploadButton}
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Hint Text */}
          <p className="text-white text-sm text-center mb-6">
            {newProjectTexts.addImageGalleryHint}
          </p>

          {/* Thumbnails Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((image, index) => (
                <div key={index} className="flex flex-col gap-1">
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-square bg-[#343434]">
                    <Image
                      src={image}
                      alt={`Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex gap-1 bg-[#343434] p-1">
                    <button
                      onClick={() => handleMoveLeft(index)}
                      disabled={index === 0}
                      className="flex-1 flex items-center justify-center h-6 hover:bg-[#414141] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Image
                        src="/yellow_triangle_left.svg"
                        alt="Move left"
                        width={12}
                        height={12}
                      />
                    </button>
                    <button
                      onClick={() => handleMoveRight(index)}
                      disabled={index === images.length - 1}
                      className="flex-1 flex items-center justify-center h-6 hover:bg-[#414141] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Image
                        src="/yellow_triangle_right.svg"
                        alt="Move right"
                        width={12}
                        height={12}
                      />
                    </button>
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="flex-1 flex items-center justify-center h-6 hover:bg-[#414141] transition-colors"
                    >
                      <Image
                        src="/yellow_cross.svg"
                        alt="Remove"
                        width={12}
                        height={12}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Button */}
        <div className="p-6 flex justify-center">
          <button
            onClick={handleAddImages}
            disabled={images.length === 0}
            className="w-full md:w-[320px] h-[60px] bg-[#FECC39] text-[#343434] font-bold text-[18px] hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {newProjectTexts.addImageGalleryAddButton}
          </button>
        </div>
      </div>
    </>
  );
}
