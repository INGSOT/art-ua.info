"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import WorkMediaSlider from "./WorkMediaSlider";
import type { ProjectWorkMediaItem } from "./projectWorkMedia";

interface MediaSectionProps {
  projectCover: string | null;
  workGalleryItems: ProjectWorkMediaItem[];
  tagsUa: string[];
  tagsEn: string[];
  addCoverText: string;
  addCoverOptional: string;
  workUploadText: string;
  tagsLabel: string;
  tagsPlaceholder: string;
  tagsPlaceholderEn: string;
  tagsHint: string;
  workError?: string;
  onOpenCoverModal: () => void;
  onOpenGalleryModal: () => void;
  onOpenWorkModal: () => void;
  onTagsUaChange: (tags: string[]) => void;
  onTagsEnChange: (tags: string[]) => void;
}

interface TagsFieldProps {
  flag: "ua" | "en";
  tags: string[];
  placeholder: string;
  onTagsChange: (tags: string[]) => void;
}

// Список тегів з полем вводу — додавання по Enter/пробілу, видалення чіпа по кліку,
// точний аналог тег-інпуту з save-art (EnterName.jsx).
function TagsField({ flag, tags, placeholder, onTagsChange }: TagsFieldProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === " ") && inputValue.trim()) {
      e.preventDefault();
      onTagsChange([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Image src={`/${flag}.svg`} alt={flag.toUpperCase()} width={24} height={24} />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
        />
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-2 pl-4 pr-2 py-2 bg-[#343434] text-white text-sm"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="w-5 h-5 flex items-center justify-center text-[#A0A0A0] hover:text-[#FECC39]"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MediaSection({
  projectCover,
  workGalleryItems,
  tagsUa,
  tagsEn,
  addCoverText,
  addCoverOptional,
  workUploadText,
  tagsLabel,
  tagsPlaceholder,
  tagsPlaceholderEn,
  tagsHint,
  workError,
  onOpenCoverModal,
  onOpenGalleryModal,
  onOpenWorkModal,
  onTagsUaChange,
  onTagsEnChange,
}: MediaSectionProps) {
  const t = useTranslations("CreateProject.media");
  const workBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (workError) {
      workBlockRef.current?.focus();
    }
  }, [workError]);

  return (
    <>
      <div className="w-full max-w-[1000px] flex flex-col gap-2">
        <label className="font-wix text-white text-sm">{t("coverLabel")}</label>
        <div className="flex justify-center">
          <div
            onClick={() => !projectCover && onOpenCoverModal()}
            className={`relative flex flex-col items-center justify-center gap-4 w-full h-[800px] bg-[#343434] transition-colors ${!projectCover ? "cursor-pointer hover:bg-[#3a3a3a]" : ""}`}
          >
            {projectCover ? (
              <>
                <Image
                  src={projectCover}
                  alt="Project cover"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCoverModal();
                  }}
                  className="absolute top-4 right-4 w-12 h-12 bg-[#343434] flex items-center justify-center hover:bg-[#414141] transition-colors z-10"
                >
                  <Image src="/yellow_cross.svg" alt="Edit" width={24} height={24} />
                </button>
              </>
            ) : (
              <>
                <Image src="/upload.svg" alt="upload" width={48} height={48} />
                <div className="text-white text-center">
                  <p>{addCoverText}</p>
                  <p>{addCoverOptional}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1000px] flex flex-col gap-2">
        <label className="font-wix text-white text-sm">{t("workLabel")}</label>
        <div
          ref={workBlockRef}
          tabIndex={-1}
          className={`flex justify-center ${workError ? "border-2 border-red-500 p-2" : ""}`}
        >
          {workGalleryItems.length > 0 ? (
            <WorkMediaSlider items={workGalleryItems} onEditClick={onOpenGalleryModal} />
          ) : (
            <div
              onClick={onOpenWorkModal}
              className="flex flex-col items-center justify-center gap-4 w-full h-[800px] bg-[#343434] cursor-pointer hover:bg-[#3a3a3a] transition-colors"
            >
              <Image src="/upload.svg" alt="upload" width={48} height={48} />
              <p className="text-white text-center">{workUploadText}</p>
            </div>
          )}
        </div>
        {workError && <p className="text-red-500 text-sm">{workError}</p>}
      </div>

      <div className="w-full max-w-[1000px] flex flex-col gap-3">
        <label className="font-wix text-white text-sm">{tagsLabel}</label>
        <TagsField flag="ua" tags={tagsUa} placeholder={tagsPlaceholder} onTagsChange={onTagsUaChange} />
        <TagsField flag="en" tags={tagsEn} placeholder={tagsPlaceholderEn} onTagsChange={onTagsEnChange} />
        <p className="text-white text-sm text-right">{tagsHint}</p>
      </div>
    </>
  );
}
