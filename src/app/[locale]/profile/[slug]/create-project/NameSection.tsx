import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ArtFieldOption {
  id: string;
  label: string;
}

interface NameSectionProps {
  projectNameLabel: string;
  projectNamePlaceholder: string;
  projectNamePlaceholderEn: string;
  artFieldButton: string;
  projectNameUa: string;
  projectNameEn: string;
  selectedArtField: ArtFieldOption | null;
  errorUa?: string;
  errorEn?: string;
  artFieldError?: string;
  onProjectNameUaChange: (value: string) => void;
  onProjectNameEnChange: (value: string) => void;
  onOpenArtFieldModal: () => void;
}

export default function NameSection({
  projectNameLabel,
  projectNamePlaceholder,
  projectNamePlaceholderEn,
  artFieldButton,
  projectNameUa,
  projectNameEn,
  selectedArtField,
  errorUa,
  errorEn,
  artFieldError,
  onProjectNameUaChange,
  onProjectNameEnChange,
  onOpenArtFieldModal,
}: NameSectionProps) {
  const t = useTranslations("CreateProject.name");
  const inputUaRef = useRef<HTMLInputElement>(null);
  const inputEnRef = useRef<HTMLInputElement>(null);
  const artFieldButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (errorUa) {
      inputUaRef.current?.focus();
    } else if (errorEn) {
      inputEnRef.current?.focus();
    } else if (artFieldError) {
      artFieldButtonRef.current?.focus();
    }
  }, [errorUa, errorEn, artFieldError]);

  return (
    <>
      <div className="w-full max-w-[1000px] flex flex-col gap-2">
        <label className="font-wix text-white text-sm">{projectNameLabel}</label>
        <div
          className={`relative ${errorUa ? "border-2 border-red-500" : ""}`}
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Image src="/ua.svg" alt="UA" width={24} height={24} />
          </div>
          <input
            ref={inputUaRef}
            type="text"
            value={projectNameUa}
            onChange={(e) => onProjectNameUaChange(e.target.value)}
            placeholder={projectNamePlaceholder}
            className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
          />
        </div>
        {errorUa && <p className="text-red-500 text-sm">{errorUa}</p>}
        <div
          className={`relative ${errorEn ? "border-2 border-red-500" : ""}`}
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Image src="/en.svg" alt="EN" width={24} height={24} />
          </div>
          <input
            ref={inputEnRef}
            type="text"
            value={projectNameEn}
            onChange={(e) => onProjectNameEnChange(e.target.value)}
            placeholder={projectNamePlaceholderEn}
            className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
          />
        </div>
        {errorEn && <p className="text-red-500 text-sm">{errorEn}</p>}
      </div>

      <div className="w-full max-w-[1000px] flex flex-col gap-2">
        <label className="font-wix text-white text-sm">{t("artFieldLabel")}</label>
        <button
          ref={artFieldButtonRef}
          type="button"
          onClick={onOpenArtFieldModal}
          className={`font-wix w-full flex items-center justify-between gap-4 px-6 py-4 bg-[#343434] text-white hover:bg-[#3a3a3a] transition-colors ${
            artFieldError ? "border-2 border-red-500" : ""
          }`}
        >
          <span>{selectedArtField ? selectedArtField.label : artFieldButton}</span>
          <Image src="/white_triangle_left.svg" alt="arrow" width={20} height={20} />
        </button>
        {artFieldError && <p className="text-red-500 text-sm">{artFieldError}</p>}
      </div>
    </>
  );
}
