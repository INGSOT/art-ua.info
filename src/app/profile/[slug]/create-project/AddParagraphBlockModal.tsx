"use client";

import Image from "next/image";

interface AddParagraphBlockModalProps {
  isOpen: boolean;
  paragraphUk: string;
  paragraphEn: string;
  onParagraphUkChange: (value: string) => void;
  onParagraphEnChange: (value: string) => void;
  onClose: () => void;
  onBack: () => void;
  onAdd: () => void;
}

// Керується повністю з батька (ContentBlocksSection) — без власного useState, щоб
// уникнути розсинхронізації стану при відкритті/закритті вікна.
export default function AddParagraphBlockModal({
  isOpen,
  paragraphUk,
  paragraphEn,
  onParagraphUkChange,
  onParagraphEnChange,
  onClose,
  onBack,
  onAdd,
}: AddParagraphBlockModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[55]" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-[#414141] z-[56] flex flex-col">
        <div className="flex items-center justify-between p-6">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#343434] transition-colors"
          >
            <Image src="/yellow_triangle_left.svg" alt="Back" width={20} height={20} />
          </button>
          <h2 className="text-white text-[18px] font-bold flex-1 text-center">Текст</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#343434] transition-colors"
          >
            <Image src="/yellow_cross.svg" alt="Close" width={24} height={24} />
          </button>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-wix text-white text-sm">Текст українською</label>
            <textarea
              value={paragraphUk}
              onChange={(e) => onParagraphUkChange(e.target.value)}
              placeholder="Введіть текст"
              className="font-wix w-full h-[140px] px-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0] resize-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-wix text-white text-sm">Текст англійською</label>
            <textarea
              value={paragraphEn}
              onChange={(e) => onParagraphEnChange(e.target.value)}
              placeholder="Enter text"
              className="font-wix w-full h-[140px] px-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0] resize-none"
            />
          </div>
        </div>

        <div className="p-6 flex justify-center">
          <button
            type="button"
            onClick={onAdd}
            disabled={!paragraphUk.trim()}
            className="w-full md:w-[320px] h-[60px] bg-[#FECC39] text-[#343434] font-bold text-[18px] hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Додати
          </button>
        </div>
      </div>
    </>
  );
}
