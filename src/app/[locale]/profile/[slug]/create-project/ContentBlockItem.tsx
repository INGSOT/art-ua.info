"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getVideoInfo } from "../../../../../utils/videoUtils";
import WorkVideoEmbed from "./WorkVideoEmbed";
import type { AdditionalContentBlock } from "./additionalContentBlock";

interface ContentBlockItemProps {
  block: AdditionalContentBlock;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

interface BlockRow {
  content: ReactNode;
  variant: "text" | "textTall" | "media";
}

function FlagRow({ flag, text }: { flag: "ua" | "en"; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <Image src={`/${flag}.svg`} alt={flag.toUpperCase()} width={24} height={24} className="shrink-0" />
      <p className="text-white whitespace-pre-line">{text}</p>
    </div>
  );
}

function getRows(block: AdditionalContentBlock): BlockRow[] {
  switch (block.type) {
    case "heading": {
      const rows: BlockRow[] = [{ content: <FlagRow flag="ua" text={block.headingUk} />, variant: "text" }];
      if (block.headingEn) {
        rows.push({ content: <FlagRow flag="en" text={block.headingEn} />, variant: "text" });
      }
      return rows;
    }
    case "paragraph": {
      const rows: BlockRow[] = [
        { content: <FlagRow flag="ua" text={block.paragraphUk} />, variant: "textTall" },
      ];
      if (block.paragraphEn) {
        rows.push({ content: <FlagRow flag="en" text={block.paragraphEn} />, variant: "textTall" });
      }
      return rows;
    }
    case "image":
      return [
        {
          content: (
            <div className="relative w-full aspect-[16/9]">
              <Image src={block.image} alt="" fill className="object-cover" />
            </div>
          ),
          variant: "media",
        },
      ];
    case "link": {
      const videoInfo = getVideoInfo(block.url);
      return [
        {
          content: videoInfo ? (
            <WorkVideoEmbed workVideoUrl={block.url} />
          ) : (
            <a
              href={block.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[#FECC39] underline break-all"
            >
              {block.url}
            </a>
          ),
          variant: videoInfo ? "media" : "text",
        },
      ];
    }
    default:
      return [];
  }
}

export default function ContentBlockItem({
  block,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}: ContentBlockItemProps) {
  const t = useTranslations("CreateProject.additional");
  const rows = getRows(block);

  return (
    <div className="w-full flex items-stretch gap-3">
      <div className="flex-1 min-w-0 flex flex-col gap-[3px]">
        {rows.map((row, index) => (
          <div
            key={index}
            className={`bg-[#343434] overflow-hidden ${
              row.variant === "media"
                ? ""
                : row.variant === "textTall"
                  ? "px-6 py-6 min-h-[110px] flex items-center"
                  : "px-6 py-5"
            }`}
          >
            {row.content}
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-center items-center gap-3 shrink-0 w-14 bg-[#2b2b2b]">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          className="w-8 h-8 flex items-center justify-center disabled:opacity-30"
        >
          <Image src="/yellow_triangle_up.svg" alt={t("moveUp")} width={16} height={16} />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          className="w-8 h-8 flex items-center justify-center disabled:opacity-30"
        >
          <Image src="/yellow_triangle_down.svg" alt={t("moveDown")} width={16} height={16} />
        </button>
        <button type="button" onClick={onEdit} className="w-8 h-8 flex items-center justify-center">
          <Image src="/edit_yellow.svg" alt={t("edit")} width={16} height={16} />
        </button>
        <button type="button" onClick={onDelete} className="w-8 h-8 flex items-center justify-center">
          <Image src="/yellow_cross.svg" alt={t("delete")} width={16} height={16} />
        </button>
      </div>
    </div>
  );
}
