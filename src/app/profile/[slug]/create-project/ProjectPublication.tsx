"use client";

import { useState } from "react";
import Image from "next/image";
import { newProjectTexts } from "../../../../data/newProjectData";
import Message from "../../../../components/Message";

interface ProjectPublicationProps {
  // Валідацію обов'язкових полів проєкту (власник/назва/жанр/робота) виконує сервер
  // (POST /v1/art-ua-info/projects) — ця функція надсилає запит і повертає результат;
  // сама сторінка (ProjectCreating) відповідає за розбір 422-помилок по полях і
  // перемикання на вкладку з помилкою.
  onPublish: () => Promise<{ type: "success" | "error"; text: string }>;
  onSaveDraft: () => Promise<{ type: "success" | "error"; text: string }>;
  onDelete: () => Promise<{ type: "success" | "error"; text: string }>;
}

export default function ProjectPublication({ onPublish, onSaveDraft, onDelete }: ProjectPublicationProps) {
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
  const [isDraftHovered, setIsDraftHovered] = useState(false);
  const [isPublishHovered, setIsPublishHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [notification, setNotification] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    const result = await onPublish();
    setNotification(result);
  };

  const handleSaveDraftClick = async () => {
    setNotification(null);
    setIsSavingDraft(true);
    const result = await onSaveDraft();
    setIsSavingDraft(false);
    setNotification(result);
  };

  const handleDeleteClick = async () => {
    if (!window.confirm("Видалити проєкт? Цю дію не можна скасувати.")) return;
    setNotification(null);
    setIsDeleting(true);
    const result = await onDelete();
    setIsDeleting(false);
    setNotification(result);
  };

  return (
    <section className="w-full bg-[#FFFCF5] flex flex-col items-center py-10 border-b-[2px] border-[#343434]">
      {notification && (
        <Message
          type={notification.type}
          message={notification.text}
          onClose={() => setNotification(null)}
        />
      )}
      <form onSubmit={handlePublish} className="flex flex-col items-center w-full max-w-[1000px] px-4 md:px-10 lg:px-[75px]">
      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-[1000px] justify-between">
        {/* Delete Button */}
        <button
          type="button"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          onMouseEnter={() => setIsDeleteHovered(true)}
          onMouseLeave={() => setIsDeleteHovered(false)}
          className={`h-[60px] flex items-stretch transition-all duration-300 w-full md:flex-1 disabled:opacity-60 ${
            isDeleteHovered ? "bg-[#FECC39]" : "bg-[#343434]"
          }`}
        >
          <span
            className={`flex items-center justify-center flex-1 px-6 font-bold whitespace-nowrap transition-colors ${
              isDeleteHovered ? "text-[#343434]" : "text-[#FECC39]"
            }`}
          >
            {newProjectTexts.deleteButton}
          </span>
          <div
            className={`flex items-center justify-center w-[60px] flex-shrink-0 border-l transition-colors ${
              isDeleteHovered ? "border-[#343434]" : "border-[#FECC39]"
            }`}
          >
            <Image
              src={isDeleteHovered ? "/black_cross.svg" : "/yellow_cross.svg"}
              alt="Delete"
              width={24}
              height={24}
            />
          </div>
        </button>

        {/* Save Draft Button */}
        <button
          type="button"
          onClick={handleSaveDraftClick}
          disabled={isSavingDraft}
          onMouseEnter={() => setIsDraftHovered(true)}
          onMouseLeave={() => setIsDraftHovered(false)}
          className={`h-[60px] flex items-stretch transition-all duration-300 w-full md:flex-1 disabled:opacity-60 ${
            isDraftHovered ? "bg-[#FECC39]" : "bg-[#343434]"
          }`}
        >
          <span
            className={`flex items-center justify-center flex-1 px-6 font-bold whitespace-nowrap transition-colors ${
              isDraftHovered ? "text-[#343434]" : "text-[#FECC39]"
            }`}
          >
            {newProjectTexts.saveDraftButton}
          </span>
          <div
            className={`flex items-center justify-center w-[60px] h-[60px] flex-shrink-0 border-l transition-colors ${
              isDraftHovered ? "border-[#343434]" : "border-[#FECC39]"
            }`}
          >
            <Image
              src={isDraftHovered ? "/black_draft.svg" : "/yellow_draft.svg"}
              alt="Draft"
              width={20}
              height={20}
            />
          </div>
        </button>

        {/* Publish Button */}
        <button
          type="submit"
          onMouseEnter={() => setIsPublishHovered(true)}
          onMouseLeave={() => setIsPublishHovered(false)}
          className={`h-[60px] flex items-stretch transition-all duration-300 w-full md:flex-1 ${
            isPublishHovered ? 'bg-white' : 'bg-[#FECC39]'
          }`}
        >
          <span className="flex items-center justify-center flex-1 px-6 font-bold text-[#343434] whitespace-nowrap">
            {newProjectTexts.publishButton}
          </span>
          <div className="flex items-center justify-center w-[60px] flex-shrink-0 border-l border-[#343434]">
            <Image
              src="/grey_check.svg"
              alt="Publish"
              width={20}
              height={20}
            />
          </div>
        </button>
      </div>
      </form>
    </section>
  );
}
