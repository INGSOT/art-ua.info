"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import WorkVideoEmbed from "../WorkVideoEmbed";
import { getVideoInfo } from "../../utils/videoUtils";
import { useToast } from "../../context/ToastContext";

// Стандартні share-intent URL. DeviantArt офіційного share-intent для довільних
// зовнішніх посилань не має — для нього замість попапу копіюємо посилання.
function buildShareUrl(network: string, pageUrl: string, title: string): string | null {
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(title);

  switch (network) {
    case "Facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "X":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    case "Pinterest":
      return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`;
    case "LinkedIn":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    default:
      return null;
  }
}

export interface ProjectResultShowcaseTag {
  text: string;
  icon?: string;
}

export interface ProjectResultShowcaseAuthor {
  avatarUrl: string;
  name: string;
  profileHref?: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
}

export interface ProjectResultShowcaseCharacteristic {
  id: string | number;
  name: string;
  description: string;
}

export interface ProjectResultContentBlock {
  type: string;
  headingLevel?: string;
  headingText?: string;
  paragraphText?: string;
  image?: string | null;
  imageCaption?: string;
  url?: string | null;
}

interface ProjectResultShowcaseProps {
  title: string;
  tags: ProjectResultShowcaseTag[];
  slides: string[];
  likesCount: number;
  isLiked?: boolean;
  onLikeClick?: () => void;
  likeDisabled?: boolean;
  editHref?: string;
  author: ProjectResultShowcaseAuthor;
  socialLinks?: { icon: string; alt: string }[];
  dateLabel?: string;
  dateValue?: string;
  characteristicsTitle: string;
  tableHeaders: { name: string; description: string };
  characteristics: ProjectResultShowcaseCharacteristic[];
  descriptionParagraphs: string[];
  contentBlocks?: ProjectResultContentBlock[];
}

// Розміри заголовків content_blocks — точно як .project_description .content-blocks
// у save-art (h2:24px, h3:20px, h4:18px, h5:16px, h6:14px).
const HEADING_SIZE_CLASS: Record<string, string> = {
  h1: "text-3xl",
  h2: "text-2xl",
  h3: "text-xl",
  h4: "text-lg",
  h5: "text-base",
  h6: "text-sm",
};

function renderContentBlocks(blocks: ProjectResultContentBlock[]) {
  return blocks.map((block, index) => {
    switch (block.type) {
      case "heading": {
        if (!block.headingText) return null;
        const level = block.headingLevel && HEADING_SIZE_CLASS[block.headingLevel] ? block.headingLevel : "h3";
        const HeadingTag = level as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
        return (
          <HeadingTag key={index} className={`text-white font-bold break-words ${HEADING_SIZE_CLASS[level]}`}>
            {block.headingText}
          </HeadingTag>
        );
      }
      case "paragraph": {
        if (!block.paragraphText) return null;
        return (
          <p key={index} className="text-white text-base whitespace-pre-wrap break-words">
            {block.paragraphText}
          </p>
        );
      }
      case "image": {
        if (!block.image) return null;
        return (
          <figure key={index} className="flex flex-col gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- довільний контент-блок без наперед відомих розмірів */}
            <img src={block.image} alt="" className="w-full h-auto" />
            {block.imageCaption && <figcaption className="text-[#A0A0A0] text-sm">{block.imageCaption}</figcaption>}
          </figure>
        );
      }
      case "link": {
        if (!block.url) return null;
        const videoInfo = getVideoInfo(block.url);
        if (videoInfo) {
          return (
            <div key={index} className="relative w-full aspect-video bg-[#2A2A2A]">
              <WorkVideoEmbed workVideoUrl={block.url} />
            </div>
          );
        }
        return (
          <p key={index}>
            <a
              href={block.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FECC39] underline break-all"
            >
              {block.url}
            </a>
          </p>
        );
      }
      default:
        return null;
    }
  });
}

/**
 * Точна візуальна копія блоку "завершений проєкт" з save-art
 * (ProjectCollectedDone + CollectionProjectCardDone): слайдер результату
 * 1000x562 з мініатюрами й крапками, лічильник лайків, картка автора зліва
 * та дата/характеристики/опис справа. Використовується і на публічній
 * сторінці проєкту, і в прев'ю вкладки "Публікація" візарда.
 */
export default function ProjectResultShowcase({
  title,
  tags,
  slides,
  likesCount,
  isLiked,
  onLikeClick,
  likeDisabled,
  editHref,
  author,
  socialLinks,
  dateLabel,
  dateValue,
  characteristicsTitle,
  tableHeaders,
  characteristics,
  descriptionParagraphs,
  contentBlocks,
}: ProjectResultShowcaseProps) {
  const t = useTranslations("Projects.showcase");
  const [activeSlide, setActiveSlide] = useState(0);
  const safeIndex = Math.min(activeSlide, Math.max(slides.length - 1, 0));
  const { showToast } = useToast();
  const [hoveredSocialIndex, setHoveredSocialIndex] = useState<number | null>(null);

  const handleShareClick = async (network: string) => {
    const pageUrl = window.location.href;
    const shareUrl = buildShareUrl(network, pageUrl, title);

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=600");
      return;
    }

    try {
      await navigator.clipboard.writeText(pageUrl);
      showToast(t("linkCopied"), "green");
    } catch {
      showToast(t("linkCopyFailed"), "red");
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-20">
      <div className="w-full max-w-[1000px] flex flex-col items-center gap-10">
        <h5 className="text-white text-xl md:text-2xl font-bold text-center break-words max-w-full">
          {title}
        </h5>

        {tags.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-3.5 bg-[#343434] px-3 py-3"
              >
                {tag.icon && <Image src={tag.icon} alt="" width={18} height={18} />}
                <p className="text-white text-sm">{tag.text}</p>
              </div>
            ))}
          </div>
        )}

        {slides.length > 0 ? (
          <div className="w-full flex flex-col items-center gap-[30px]">
            <div className="relative w-full aspect-[1000/562] bg-[#2A2A2A] overflow-hidden">
              {slides.map((slide, index) => {
                const videoInfo = getVideoInfo(slide);
                return (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      index === safeIndex ? "opacity-100 z-[1]" : "opacity-0"
                    }`}
                  >
                    {videoInfo ? (
                      <WorkVideoEmbed workVideoUrl={slide} />
                    ) : (
                      <Image src={slide} alt="" fill className="object-cover" />
                    )}
                  </div>
                );
              })}
            </div>

            {slides.length > 1 && (
              <div className="w-full flex gap-3 overflow-x-auto">
                {slides.map((slide, index) => {
                  const videoInfo = getVideoInfo(slide);
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveSlide(index)}
                      className={`flex-shrink-0 w-[120px] h-[90px] bg-[#343434] flex items-center justify-center box-border ${
                        index === safeIndex ? "border border-[#FECC39]" : "border border-transparent"
                      }`}
                    >
                      {videoInfo?.thumbnail ? (
                        <Image
                          src={videoInfo.thumbnail}
                          alt=""
                          width={120}
                          height={90}
                          unoptimized
                          className="w-full h-full object-cover"
                        />
                      ) : videoInfo ? (
                        <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[12px] border-l-[#FECC39] ml-1" />
                      ) : (
                        <Image
                          src={slide}
                          alt=""
                          width={120}
                          height={90}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
              >
                <Image src="/white-arrow-left-slider.svg" alt={t("prevSlide")} width={24} height={24} />
              </button>
              <div className="flex items-center gap-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`w-2 h-2 border-2 ${
                      index === safeIndex ? "bg-white border-white" : "bg-transparent border-white"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))}
              >
                <Image src="/white-arrow-right-slider.svg" alt={t("nextSlide")} width={24} height={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full aspect-[1000/562] bg-[#2A2A2A]" />
        )}

        {editHref && (
          <Link
            href={editHref}
            className="w-[350px] max-w-full flex items-stretch h-[60px] bg-[#FECC39] hover:bg-white transition-colors"
          >
            <span className="flex items-center justify-center flex-1 px-6 font-bold text-[#343434] whitespace-nowrap">
              {t("editProject")}
            </span>
            <div className="flex items-center justify-center w-[60px] flex-shrink-0 border-l border-[#343434]">
              <Image src="/edit.svg" alt={t("editAlt")} width={20} height={20} />
            </div>
          </Link>
        )}

        <div className="bg-[#343434] flex items-stretch h-[60px]">
          <div className="flex items-center justify-center w-[60px]">
            <span className="text-[#FECC39] font-bold text-sm">{likesCount}</span>
          </div>
          <div className="w-px bg-[#272727]" />
          <button
            type="button"
            onClick={onLikeClick}
            disabled={likeDisabled}
            className={`flex items-center justify-center w-[60px] transition-colors ${
              isLiked ? "bg-[#FECC39]" : ""
            } ${likeDisabled ? "cursor-wait opacity-60" : ""}`}
          >
            <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 16C8.64137 15.8678 0 12.5515 0 5.71041C0 0.615962 5.72931 -1.91752 9 1.70397C12.2362 -1.89649 18 0.574211 18 5.71041C18 12.552 9.35904 15.8682 9 16Z"
                fill={isLiked ? "#343434" : "#FECC39"}
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="w-full max-w-[1760px] mx-auto flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-20 px-4">
        <aside className="w-full lg:w-[400px] flex-shrink-0 h-max lg:sticky lg:top-[30px] bg-[#343434] border border-transparent hover:border-[#FECC39] transition-colors">
          <div className="flex flex-col items-start gap-3 p-3 border-b border-[#414141]">
            <Image
              src={author.avatarUrl}
              alt={author.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border border-[#272727]"
            />
            {author.profileHref ? (
              <Link href={author.profileHref} className="text-white font-bold text-lg">
                {author.name}
              </Link>
            ) : (
              <h6 className="text-white font-bold text-lg">{author.name}</h6>
            )}
            {author.description && <p className="text-white text-sm">{author.description}</p>}
            {author.linkHref && (
              <a
                href={author.linkHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-sm text-white hover:text-[#FECC39] transition-colors"
              >
                {author.linkLabel || author.linkHref}
              </a>
            )}
          </div>

          {socialLinks && socialLinks.length > 0 && (
            <div className="flex items-center justify-center gap-[30px] p-[30px]">
              {socialLinks.map((social, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleShareClick(social.alt)}
                  onMouseEnter={() => setHoveredSocialIndex(index)}
                  onMouseLeave={() => setHoveredSocialIndex(null)}
                  aria-label={buildShareUrl(social.alt, "", "") ? t("shareIn", { network: social.alt }) : t("copyProjectLink")}
                  className="w-11 h-11 flex items-center justify-center hover:bg-[#FECC39] transition-colors"
                >
                  <Image
                    src={hoveredSocialIndex === index ? social.icon.replace("_yellow", "_black") : social.icon}
                    alt={social.alt}
                    width={20}
                    height={20}
                  />
                </button>
              ))}
            </div>
          )}
        </aside>

        <div className="flex-1 min-w-0 flex flex-col gap-10">
          {dateValue && (
            <p className="text-white text-sm">
              {dateLabel}
              <span className="ml-2">{dateValue}</span>
            </p>
          )}

          {characteristics.length > 0 && (
            <div className="flex flex-col gap-1">
              <h6 className="text-white font-bold text-lg mb-3">{characteristicsTitle}</h6>
              <div className="flex justify-between gap-1 mb-[-2px] relative z-[1]">
                <p className="flex-1 min-w-0 text-white text-sm">{tableHeaders.name}</p>
                <p className="flex-1 min-w-0 text-white text-sm">{tableHeaders.description}</p>
              </div>
              {characteristics.map((item) => (
                <div key={item.id} className="flex justify-between gap-1">
                  <p className="flex-1 min-w-0 h-[60px] flex items-center bg-[#343434] p-3 text-white text-sm break-words">
                    {item.name}
                  </p>
                  <p className="flex-1 min-w-0 h-[60px] flex items-center bg-[#343434] p-3 text-white text-sm break-words">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {descriptionParagraphs.length > 0 && (
            <div className="flex flex-col gap-3 text-white text-base whitespace-pre-wrap break-words">
              {descriptionParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}

          {contentBlocks && contentBlocks.length > 0 && (
            <div className="flex flex-col gap-4">{renderContentBlocks(contentBlocks)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
