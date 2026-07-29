"use client";

import Image from "next/image";

interface AddContentBlockTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: "heading" | "paragraph" | "image" | "link") => void;
}

const MENU_ITEMS: { label: string; type: "heading" | "paragraph" | "image" | "link" }[] = [
  { label: "Заголовок", type: "heading" },
  { label: "Текст", type: "paragraph" },
  { label: "Зображення", type: "image" },
  { label: "Посилання", type: "link" },
];

export default function AddContentBlockTypeModal({
  isOpen,
  onClose,
  onSelectType,
}: AddContentBlockTypeModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[55]" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-[#414141] z-[56] flex flex-col">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-white text-[18px] font-bold flex-1">Додати блок</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#343434] transition-colors"
          >
            <Image src="/yellow_cross.svg" alt="Close" width={24} height={24} />
          </button>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-2">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => onSelectType(item.type)}
              className="flex items-center justify-between px-6 py-4 bg-[#343434] text-white font-bold hover:bg-[#4a4a4a] transition-colors"
            >
              <span>{item.label}</span>
              <Image src="/yellow_triangle_right.svg" alt="" width={16} height={16} />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
