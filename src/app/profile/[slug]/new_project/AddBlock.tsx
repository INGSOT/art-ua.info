"use client";

import Image from "next/image";
import { newProjectTexts } from "../../../../data/newProjectData";

interface AddBlockProps {
  isOpen: boolean;
  onClose: () => void;
  onTitleClick: () => void;
  onParagraphClick: () => void;
  onImageClick: () => void;
  onLinkClick: () => void;
  noAnimation?: boolean;
}

export default function AddBlock({ isOpen, onClose, onTitleClick, onParagraphClick, onImageClick, onLinkClick, noAnimation = false }: AddBlockProps) {
  if (!isOpen) return null;

  const handleTitleClick = () => {
    onTitleClick();
  };

  const handleParagraphClick = () => {
    onParagraphClick();
  };

  const handleImageClick = () => {
    onImageClick();
  };

  const handleLinkClick = () => {
    onLinkClick();
  };

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
          <h2 className="text-white text-[18px] font-bold">
            {newProjectTexts.addBlockTitle}
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
        <div className="flex-1 p-6 flex flex-col gap-4">
          {/* Title Button */}
          <button
            onClick={handleTitleClick}
            className="group relative w-full h-[60px] bg-[#343434] flex items-center hover:bg-[#FECC39] transition-colors"
          >
            <span className="flex-1 text-[#FECC39] text-[18px] font-bold text-center group-hover:text-[#343434] transition-colors">
              {newProjectTexts.addBlockTitleButton}
            </span>
            <div className="w-[1px] h-full bg-[#FECC39] group-hover:bg-[#343434] transition-colors" />
            <div className="w-[60px] flex items-center justify-center">
              <Image
                src="/title.svg"
                alt="Title"
                width={24}
                height={24}
                className="brightness-0 saturate-100 invert-[0.8] sepia-[1] hue-rotate-[10deg] saturate-[5] group-hover:brightness-0 group-hover:saturate-100 group-hover:invert-[0.2] group-hover:sepia-0 transition-all"
              />
            </div>
          </button>

          {/* Paragraph Button */}
          <button
            onClick={handleParagraphClick}
            className="group relative w-full h-[60px] bg-[#343434] flex items-center hover:bg-[#FECC39] transition-colors"
          >
            <span className="flex-1 text-[#FECC39] text-[18px] font-bold text-center group-hover:text-[#343434] transition-colors">
              {newProjectTexts.addBlockParagraphButton}
            </span>
            <div className="w-[1px] h-full bg-[#FECC39] group-hover:bg-[#343434] transition-colors" />
            <div className="w-[60px] flex items-center justify-center">
              <Image
                src="/paragraph.svg"
                alt="Paragraph"
                width={24}
                height={24}
                className="brightness-0 saturate-100 invert-[0.8] sepia-[1] hue-rotate-[10deg] saturate-[5] group-hover:brightness-0 group-hover:saturate-100 group-hover:invert-[0.2] group-hover:sepia-0 transition-all"
              />
            </div>
          </button>

          {/* Image Button */}
          <button
            onClick={handleImageClick}
            className="group relative w-full h-[60px] bg-[#343434] flex items-center hover:bg-[#FECC39] transition-colors"
          >
            <span className="flex-1 text-[#FECC39] text-[18px] font-bold text-center group-hover:text-[#343434] transition-colors">
              {newProjectTexts.addBlockImageButton}
            </span>
            <div className="w-[1px] h-full bg-[#FECC39] group-hover:bg-[#343434] transition-colors" />
            <div className="w-[60px] flex items-center justify-center">
              <Image
                src="/gallery.svg"
                alt="Image"
                width={24}
                height={24}
                className="brightness-0 saturate-100 invert-[0.8] sepia-[1] hue-rotate-[10deg] saturate-[5] group-hover:brightness-0 group-hover:saturate-100 group-hover:invert-[0.2] group-hover:sepia-0 transition-all"
              />
            </div>
          </button>

          {/* Link Button */}
          <button
            onClick={handleLinkClick}
            className="group relative w-full h-[60px] bg-[#343434] flex items-center hover:bg-[#FECC39] transition-colors"
          >
            <span className="flex-1 text-[#FECC39] text-[18px] font-bold text-center group-hover:text-[#343434] transition-colors">
              {newProjectTexts.addBlockLinkButton}
            </span>
            <div className="w-[1px] h-full bg-[#FECC39] group-hover:bg-[#343434] transition-colors" />
            <div className="w-[60px] flex items-center justify-center">
              <Image
                src="/chain.svg"
                alt="Link"
                width={24}
                height={24}
                className="brightness-0 saturate-100 invert-[0.8] sepia-[1] hue-rotate-[10deg] saturate-[5] group-hover:brightness-0 group-hover:saturate-100 group-hover:invert-[0.2] group-hover:sepia-0 transition-all"
              />
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
