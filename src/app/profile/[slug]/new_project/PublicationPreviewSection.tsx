"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { getVideoInfo } from "../../../../utils/videoUtils";
import WorkVideoEmbed from "./WorkVideoEmbed";

interface Characteristic {
  id: string;
  name: string;
  description: string;
}

interface PublicationPreviewSectionProps {
  projectNameUa: string;
  selectedArtFieldLabel: string | null;
  workImage: string | null;
  workVideoUrl: string | null;
  galleryImages: string[];
  descriptionUa: string;
  characteristics: Characteristic[];
}

export default function PublicationPreviewSection({
  projectNameUa,
  selectedArtFieldLabel,
  workImage,
  workVideoUrl,
  galleryImages,
  descriptionUa,
  characteristics,
}: PublicationPreviewSectionProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const videoInfo = workVideoUrl ? getVideoInfo(workVideoUrl) : null;
  const hasVideoOnlyPreview =
    Boolean(videoInfo) &&
    galleryImages.length === 0 &&
    !workImage &&
    Boolean(workVideoUrl);

  const mediaSlides = useMemo(() => {
    if (galleryImages.length > 0) return galleryImages;
    if (workImage) return [workImage];
    return [];
  }, [galleryImages, workImage]);

  const safeSlideIndex = Math.min(activeSlide, Math.max(mediaSlides.length - 1, 0));
  const previewTitle = projectNameUa.trim() || "«Назва проєкту»";
  const previewGenre = selectedArtFieldLabel || "Жанр не обрано";
  const previewDescription = descriptionUa.trim() || "Текст опису проєкту";
  const previewCharacteristics = characteristics.filter(
    (item) => item.name.trim() || item.description.trim()
  );

  const showImageMedia = mediaSlides.length > 0;
  const showMediaBlock = showImageMedia || hasVideoOnlyPreview;

  return (
    <section className="w-full max-w-[1000px] min-w-0 flex flex-col items-center gap-6 px-4 md:px-0">
      <h2 className="text-white text-xl md:text-[28px] font-bold text-center break-words max-w-full">
        {previewTitle}
      </h2>

      <div className="bg-[#343434] px-6 py-3">
        <p className="text-white text-sm md:text-base">{previewGenre}</p>
      </div>

      {showMediaBlock ? (
        <div className="w-full flex flex-col items-center gap-4">
          <div
            className={`relative w-full bg-[#343434] ${
              hasVideoOnlyPreview && workVideoUrl ? "" : "aspect-video"
            }`}
          >
            {hasVideoOnlyPreview && workVideoUrl ? (
              <WorkVideoEmbed workVideoUrl={workVideoUrl} />
            ) : showImageMedia ? (
              <>
                <Image
                  src={mediaSlides[safeSlideIndex]}
                  alt="Project media"
                  fill
                  className="object-cover"
                />
              </>
            ) : null}
          </div>

          {mediaSlides.length > 1 && (
            <div className="flex items-center justify-center gap-4 min-w-0 flex-wrap max-w-full">
              <button
                type="button"
                onClick={() =>
                  setActiveSlide((prev) =>
                    prev === 0 ? mediaSlides.length - 1 : prev - 1
                  )
                }
              >
                <Image
                  src="/white-arrow-left-slider.svg"
                  alt="Previous"
                  width={32}
                  height={32}
                />
              </button>
              <div className="flex gap-2">
                {mediaSlides.map((_, index) => (
                  <Image
                    key={index}
                    src={
                      safeSlideIndex === index
                        ? "/white-slider-item-active.svg"
                        : "/white-slider-item-non-active.svg"
                    }
                    alt=""
                    width={20}
                    height={20}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setActiveSlide((prev) =>
                    prev === mediaSlides.length - 1 ? 0 : prev + 1
                  )
                }
              >
                <Image
                  src="/white-arrow-right-slider.svg"
                  alt="Next"
                  width={32}
                  height={32}
                />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full aspect-video bg-[#343434]" />
      )}

      <p className="text-white font-bold">Проєкт на save-art.in.ua</p>

      <div className="bg-[#343434] flex items-stretch justify-center h-16">
        <div className="flex items-center justify-center w-16">
          <span className="text-[#FECC39] font-bold text-base">0</span>
        </div>
        <div className="w-[2px] bg-black" />
        <div className="flex items-center justify-center w-16">
          <Image src="/yellow_like.svg" alt="Like" width={24} height={24} />
        </div>
      </div>

      <div className="w-full min-w-0">
        <p className="font-wix text-white text-base whitespace-pre-line break-words">{previewDescription}</p>
      </div>

      <div className="w-full min-w-0">
        <h3 className="text-white font-bold text-lg mb-4">Характеристики проєкту:</h3>

        <div className="grid grid-cols-2 gap-4 mb-2">
          <span className="font-wix text-white text-sm">Назва</span>
          <span className="font-wix text-white text-sm">Опис</span>
        </div>

        <div className="flex flex-col gap-[2px]">
          {(previewCharacteristics.length > 0
            ? previewCharacteristics
            : [{ id: "empty", name: "-", description: "-" }]
          ).map((item) => (
            <div key={item.id} className="grid grid-cols-2 gap-[2px]">
              <div className="font-wix bg-[#343434] px-6 py-4 text-white text-base break-words min-w-0">
                {item.name || "-"}
              </div>
              <div className="font-wix bg-[#343434] px-6 py-4 text-white text-base break-words min-w-0">
                {item.description || "-"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
