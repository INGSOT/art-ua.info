"use client";

import { useState } from "react";
import Image from "next/image";
import { newProjectTexts } from "../../../data/newProjectData";

interface AddTitleProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onAdd: (titleUa: string, titleEn: string) => void;
}

export default function AddTitle({
  isOpen,
  onClose,
  onBack,
  onAdd,
}: AddTitleProps) {
  const [titleUa, setTitleUa] = useState("");
  const [titleEn, setTitleEn] = useState("");

  if (!isOpen) return null;

  const handleAdd = () => {
    if (titleUa.trim() || titleEn.trim()) {
      onAdd(titleUa, titleEn);
      setTitleUa("");
      setTitleEn("");
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-[#414141] z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          {/* Back Button */}
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

          <h2 className="text-white text-[18px] font-bold flex-1 text-center">
            {newProjectTexts.addTitleModalTitle}
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
          {/* Ukrainian Input */}
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm">
              {newProjectTexts.addTitleLabelUa}
            </label>
            <input
              type="text"
              value={titleUa}
              onChange={(e) => setTitleUa(e.target.value)}
              placeholder={newProjectTexts.addTitlePlaceholderUa}
              className="w-full px-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
            />
          </div>

          {/* English Input */}
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm">
              {newProjectTexts.addTitleLabelEn}
            </label>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder={newProjectTexts.addTitlePlaceholderEn}
              className="w-full px-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
            />
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-6 flex justify-center">
          <button
            onClick={handleAdd}
            disabled={!titleUa.trim() && !titleEn.trim()}
            className="w-full md:w-[320px] h-[60px] bg-[#FECC39] text-[#343434] font-bold text-[18px] hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {newProjectTexts.addTitleButton}
          </button>
        </div>
      </div>
    </>
  );
}
