"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { AdditionalContentBlock } from "./additionalContentBlock";
import ContentBlockItem from "./ContentBlockItem";
import AddContentBlockTypeModal from "./AddContentBlockTypeModal";
import AddHeadingBlockModal from "./AddHeadingBlockModal";
import AddParagraphBlockModal from "./AddParagraphBlockModal";
import AddLinkBlockModal from "./AddLinkBlockModal";
import AddProjectCover from "./AddProjectCover";

interface ContentBlocksSectionProps {
  blocks: AdditionalContentBlock[];
  onBlocksChange: (
    updater: AdditionalContentBlock[] | ((prev: AdditionalContentBlock[]) => AdditionalContentBlock[])
  ) => void;
}

type BlockType = "heading" | "paragraph" | "image" | "link";

// Точний аналог AdditionalInformation.jsx з save-art: список блоків (заголовок/текст/
// зображення/посилання) з можливістю додавання, редагування, видалення та зміни порядку.
// Поля модалок повністю контролюються тут (без внутрішнього useState в самих модалках),
// щоб відкриття/закриття вікна завжди залежало лише від одного джерела правди.
export default function ContentBlocksSection({ blocks, onBlocksChange }: ContentBlocksSectionProps) {
  const t = useTranslations("CreateProject");
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [activeType, setActiveType] = useState<BlockType | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [headingUk, setHeadingUk] = useState("");
  const [headingEn, setHeadingEn] = useState("");
  const [paragraphUk, setParagraphUk] = useState("");
  const [paragraphEn, setParagraphEn] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageValue, setImageValue] = useState<string | null>(null);

  const editingBlock = editingIndex !== null ? blocks[editingIndex] : null;

  const closeAll = () => {
    setIsTypeModalOpen(false);
    setActiveType(null);
    setEditingIndex(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    onBlocksChange((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const handleMoveDown = (index: number) => {
    onBlocksChange((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const handleDelete = (index: number) => {
    onBlocksChange((prev) => prev.filter((_, i) => i !== index));
  };

  const openAddModal = (type: BlockType) => {
    setIsTypeModalOpen(false);
    setEditingIndex(null);
    setHeadingUk("");
    setHeadingEn("");
    setParagraphUk("");
    setParagraphEn("");
    setLinkUrl("");
    setImageValue(null);
    setActiveType(type);
  };

  const openEditModal = (index: number) => {
    const block = blocks[index];
    setIsTypeModalOpen(false);
    setEditingIndex(index);
    setHeadingUk(block.type === "heading" ? block.headingUk : "");
    setHeadingEn(block.type === "heading" ? block.headingEn : "");
    setParagraphUk(block.type === "paragraph" ? block.paragraphUk : "");
    setParagraphEn(block.type === "paragraph" ? block.paragraphEn : "");
    setLinkUrl(block.type === "link" ? block.url : "");
    setImageValue(block.type === "image" ? block.image : null);
    setActiveType(block.type);
  };

  const upsertBlock = (block: AdditionalContentBlock) => {
    if (editingIndex !== null) {
      onBlocksChange((prev) => prev.map((b, i) => (i === editingIndex ? block : b)));
    } else {
      onBlocksChange((prev) => [...prev, block]);
    }
    closeAll();
  };

  const handleConfirmHeading = () => {
    if (!headingUk.trim()) return;
    upsertBlock({
      id: editingBlock?.id ?? Date.now(),
      type: "heading",
      headingUk: headingUk.trim(),
      headingEn: headingEn.trim(),
    });
  };

  const handleConfirmParagraph = () => {
    if (!paragraphUk.trim()) return;
    upsertBlock({
      id: editingBlock?.id ?? Date.now(),
      type: "paragraph",
      paragraphUk: paragraphUk.trim(),
      paragraphEn: paragraphEn.trim(),
    });
  };

  const handleConfirmLink = () => {
    if (!linkUrl.trim()) return;
    upsertBlock({ id: editingBlock?.id ?? Date.now(), type: "link", url: linkUrl.trim() });
  };

  return (
    <div className="w-full max-w-[1000px] flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <p className="text-white">
          {t("additional.intro")}
        </p>
        <p className="text-white">{t("additional.optional")}</p>
      </div>

      {blocks.length > 0 && (
        <div className="flex flex-col gap-10">
          {blocks.map((block, index) => (
            <ContentBlockItem
              key={block.id}
              block={block}
              isFirst={index === 0}
              isLast={index === blocks.length - 1}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              onEdit={() => openEditModal(index)}
              onDelete={() => handleDelete(index)}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsTypeModalOpen(true)}
        className="group flex items-stretch h-[60px] bg-white hover:bg-[#FECC39] transition-colors w-full md:w-[320px] mx-auto"
      >
        <span className="flex items-center justify-center flex-1 px-6 font-button font-bold text-[#343434] text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] whitespace-nowrap">
          {t("additional.addBlockButton")}
        </span>
        <div className="flex items-center justify-center w-[60px] border-l border-[#343434]">
          <Image src="/plus.svg" alt={t("additional.addBlockButton")} width={24} height={24} />
        </div>
      </button>

      <AddContentBlockTypeModal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        onSelectType={openAddModal}
      />

      <AddHeadingBlockModal
        isOpen={activeType === "heading"}
        headingUk={headingUk}
        headingEn={headingEn}
        onHeadingUkChange={setHeadingUk}
        onHeadingEnChange={setHeadingEn}
        onClose={closeAll}
        onBack={closeAll}
        onAdd={handleConfirmHeading}
      />

      <AddParagraphBlockModal
        isOpen={activeType === "paragraph"}
        paragraphUk={paragraphUk}
        paragraphEn={paragraphEn}
        onParagraphUkChange={setParagraphUk}
        onParagraphEnChange={setParagraphEn}
        onClose={closeAll}
        onBack={closeAll}
        onAdd={handleConfirmParagraph}
      />

      <AddProjectCover
        isOpen={activeType === "image"}
        onClose={closeAll}
        onBack={closeAll}
        customTitle={t("contentBlockType.image")}
        noAnimation
        currentImage={imageValue}
        onImageSelect={(imageUrl) =>
          upsertBlock({ id: editingBlock?.id ?? Date.now(), type: "image", image: imageUrl })
        }
        onImageRemove={() => setImageValue(null)}
      />

      <AddLinkBlockModal
        isOpen={activeType === "link"}
        url={linkUrl}
        onUrlChange={setLinkUrl}
        onClose={closeAll}
        onBack={closeAll}
        onAdd={handleConfirmLink}
      />
    </div>
  );
}
