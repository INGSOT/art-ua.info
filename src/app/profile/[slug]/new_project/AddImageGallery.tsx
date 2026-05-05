"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { newProjectTexts } from "../../../../data/newProjectData";
import { getVideoInfo } from "../../../../utils/videoUtils";
import type { ProjectWorkMediaItem } from "./projectWorkMedia";

interface AddImageGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onItemsSelect: (items: ProjectWorkMediaItem[]) => void;
  onItemsUpdate?: (items: ProjectWorkMediaItem[]) => void;
  currentItems: ProjectWorkMediaItem[];
  noAnimation?: boolean;
  onBack?: () => void;
}

const MAX_ITEMS = 10;

function readImageFileAsGalleryItem(file: File): Promise<ProjectWorkMediaItem> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({ kind: "image", src: reader.result as string });
    };
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

function VideoThumbCell({ url }: { url: string }) {
  const info = getVideoInfo(url);
  const [vimeoThumb, setVimeoThumb] = useState<string | null>(null);

  useEffect(() => {
    if (!info || info.provider !== "vimeo") {
      setVimeoThumb(null);
      return;
    }
    let cancelled = false;
    fetch(
      `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`
    )
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: { thumbnail_url?: string }) => {
        if (!cancelled && typeof data.thumbnail_url === "string") {
          setVimeoThumb(data.thumbnail_url);
        }
      })
      .catch(() => {
        if (!cancelled) setVimeoThumb(null);
      });
    return () => {
      cancelled = true;
    };
  }, [url, info]);

  if (!info) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#2a2a2a] text-[10px] text-[#A0A0A0] px-1 text-center">
        ?
      </div>
    );
  }

  if (info.provider === "youtube" && info.thumbnail) {
    return (
      <Image
        src={info.thumbnail}
        alt="YouTube"
        fill
        className="object-cover"
        sizes="120px"
      />
    );
  }

  const thumb = vimeoThumb;
  if (thumb) {
    return (
      <Image
        src={thumb}
        alt="Vimeo"
        fill
        className="object-cover"
        sizes="120px"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#2a2a2a] text-[10px] text-[#A0A0A0]">
      Vimeo…
    </div>
  );
}

export default function AddImageGallery({
  isOpen,
  onClose,
  onItemsSelect,
  onItemsUpdate,
  currentItems,
  noAnimation = false,
  onBack,
}: AddImageGalleryProps) {
  const [items, setItems] = useState<ProjectWorkMediaItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<ProjectWorkMediaItem[]>([]);

  itemsRef.current = items;

  useEffect(() => {
    setItems(currentItems);
  }, [currentItems]);

  const applyItems = (
    updater: React.SetStateAction<ProjectWorkMediaItem[]>,
    notifyParent?: boolean
  ) => {
    setItems((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (notifyParent !== false && onItemsUpdate) {
        onItemsUpdate(next);
      }
      return next;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const picked = input.files;
    if (!picked?.length) return;
    const fileArray = Array.from(picked);
    input.value = "";

    const prev = itemsRef.current;
    const slots = MAX_ITEMS - prev.length;
    if (slots <= 0) return;

    const filesToProcess = fileArray.slice(0, slots);
    void Promise.all(filesToProcess.map(readImageFileAsGalleryItem))
      .then((newImages) => {
        setItems((prevNow) => {
          const next = [...prevNow, ...newImages].slice(0, MAX_ITEMS);
          onItemsUpdate?.(next);
          return next;
        });
      })
      .catch(() => {});
  };

  const handleUploadClick = () => {
    if (items.length < MAX_ITEMS) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveItem = (index: number) => {
    applyItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveLeft = (index: number) => {
    if (index <= 0) return;
    applyItems((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const handleMoveRight = (index: number) => {
    applyItems((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const handleAddItemsClick = () => {
    onItemsSelect(items);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div
        className={`fixed right-0 top-0 h-full w-full md:w-[600px] bg-[#414141] z-50 flex flex-col ${
          noAnimation ? "" : "animate-slide-in"
        }`}
      >
        <div className="flex items-center justify-between p-6">
          {onBack ? (
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#343434] transition-colors"
            >
              <Image
                src="/yellow_triangle_left.svg"
                alt="Назад"
                width={20}
                height={20}
              />
            </button>
          ) : null}

          <h2
            className={`text-white text-[18px] font-bold ${
              onBack ? "flex-1 text-left" : ""
            }`}
          >
            {newProjectTexts.addImageGalleryTitle}
          </h2>

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#343434] transition-colors"
          >
            <Image
              src="/yellow_cross.svg"
              alt="Закрити"
              width={24}
              height={24}
            />
          </button>
        </div>

        <p className="px-6 text-white text-left text-sm mb-2">
          {newProjectTexts.addImageGallerySubtitle}
          {newProjectTexts.addImageGalleryMixedHint}
        </p>

        <div className="flex-1 px-6 pb-6 pt-4 flex flex-col overflow-y-auto">
          <div
            onClick={handleUploadClick}
            className={`relative w-full h-[240px] bg-[#343434] border-2 border-dashed border-black flex flex-col items-center justify-center mb-4 ${
              items.length < MAX_ITEMS
                ? "cursor-pointer hover:bg-[#3a3a3a]"
                : "cursor-not-allowed opacity-50"
            } transition-colors`}
          >
            <Image
              src="/upload.svg"
              alt="Завантажити"
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
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          <p className="text-white text-sm text-center mb-4">
            {newProjectTexts.addImageGalleryHint}
          </p>

          {items.length > 0 ? (
            <div className="grid grid-cols-5 gap-2">
              {items.map((item, index) => (
                <div key={`${index}-${item.kind}-${item.kind === "image" ? item.src.slice(0, 32) : item.url}`} className="flex flex-col gap-1">
                  <div className="relative w-full aspect-square bg-[#343434] overflow-hidden">
                    {item.kind === "image" ? (
                      <Image
                        src={item.src}
                        alt={`Зображення ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                    ) : (
                      <>
                        <VideoThumbCell url={item.url} />
                        <span className="pointer-events-none absolute bottom-1 left-1 rounded bg-black/65 px-1 text-[10px] text-white z-[1]">
                          ▶
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex gap-1 bg-[#343434] p-1">
                    <button
                      type="button"
                      onClick={() => handleMoveLeft(index)}
                      disabled={index === 0}
                      className="flex-1 flex items-center justify-center h-6 hover:bg-[#414141] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Image
                        src="/yellow_triangle_left.svg"
                        alt="Ліворуч"
                        width={12}
                        height={12}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveRight(index)}
                      disabled={index === items.length - 1}
                      className="flex-1 flex items-center justify-center h-6 hover:bg-[#414141] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Image
                        src="/yellow_triangle_right.svg"
                        alt="Праворуч"
                        width={12}
                        height={12}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="flex-1 flex items-center justify-center h-6 hover:bg-[#414141] transition-colors"
                    >
                      <Image
                        src="/yellow_cross.svg"
                        alt="Видалити"
                        width={12}
                        height={12}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="p-6 flex justify-center">
          <button
            type="button"
            onClick={handleAddItemsClick}
            disabled={items.length === 0}
            className="w-full md:w-[320px] h-[60px] bg-[#FECC39] text-[#343434] font-bold text-[18px] hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {newProjectTexts.addImageGalleryAddButton}
          </button>
        </div>
      </div>
    </>
  );
}
