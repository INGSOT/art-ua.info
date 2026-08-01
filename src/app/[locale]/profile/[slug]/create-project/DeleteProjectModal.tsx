"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteProjectModal({ isOpen, onClose, onConfirm }: DeleteProjectModalProps) {
  const t = useTranslations("CreateProject.publication.deleteModal");
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-[#414141] z-50 flex flex-col">
        <div className="p-6 md:p-[30px] flex-1">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-bold text-white text-[18px] font-[family-name:var(--font-unbounded)]">
              {t("title")}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#343434] transition-colors"
              aria-label={t("close")}
            >
              <Image src="/yellow_cross.svg" alt={t("close")} width={24} height={24} />
            </button>
          </div>

          <p className="mt-8 font-wix text-white text-[18px] leading-[1.4]">
            {t("confirmText")}
            <br />
            <br />
            {t("confirmSubtext")}
          </p>

          <div className="mt-8 w-full border-t border-[#343434]" />

          <button
            type="button"
            onClick={onConfirm}
            className="mt-8 w-full h-[60px] bg-[#343434] text-[#FECC39] font-bold text-[16px] leading-[1.2] font-[family-name:var(--font-unbounded)] hover:bg-[#FECC39] hover:text-[#343434] transition-colors"
          >
            {t("confirmButton")}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="mt-8 w-full h-[60px] bg-[#FECC39] text-[#343434] font-bold text-[16px] leading-[1.2] font-[family-name:var(--font-unbounded)] hover:bg-white transition-colors"
          >
            {t("cancelButton")}
          </button>
        </div>
      </div>
    </>
  );
}
