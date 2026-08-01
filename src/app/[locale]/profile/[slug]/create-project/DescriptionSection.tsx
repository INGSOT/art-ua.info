import Image from "next/image";
import { useTranslations } from "next-intl";

interface DescriptionSectionProps {
  descriptionUa: string;
  descriptionEn: string;
  onDescriptionUaChange: (value: string) => void;
  onDescriptionEnChange: (value: string) => void;
  errorUa?: string;
  errorEn?: string;
}

export default function DescriptionSection({
  descriptionUa,
  descriptionEn,
  onDescriptionUaChange,
  onDescriptionEnChange,
  errorUa,
  errorEn,
}: DescriptionSectionProps) {
  const t = useTranslations("CreateProject.description");
  const maxCharacters = 500;
  const remainingUa = maxCharacters - descriptionUa.length;
  const remainingEn = maxCharacters - descriptionEn.length;

  return (
    <div className="w-full max-w-[1000px] flex flex-col gap-2">
      <label className="font-wix text-white text-sm">{t("label")}</label>

      <div className="flex flex-col gap-1">
        <div className={`relative ${errorUa ? "border-2 border-red-500" : ""}`}>
          <textarea
            value={descriptionUa}
            onChange={(e) => onDescriptionUaChange(e.target.value)}
            maxLength={maxCharacters}
            placeholder={t("placeholderUa")}
            className="font-wix w-full h-[168px] bg-[#343434] text-white placeholder-[#A0A0A0] pl-12 pr-4 pt-4 resize-none"
          />
          <div className="absolute top-4 left-4">
            <Image src="/ua.svg" alt="UA" width={24} height={24} />
          </div>
        </div>
        {errorUa && <p className="text-red-500 text-sm">{errorUa}</p>}
        <p className="text-white text-sm text-right">{t("remainingUa", { count: remainingUa })}</p>
      </div>

      <div className="flex flex-col gap-1">
        <div className={`relative ${errorEn ? "border-2 border-red-500" : ""}`}>
          <textarea
            value={descriptionEn}
            onChange={(e) => onDescriptionEnChange(e.target.value)}
            maxLength={maxCharacters}
            placeholder={t("placeholderEn")}
            className="font-wix w-full h-[168px] bg-[#343434] text-white placeholder-[#A0A0A0] pl-12 pr-4 pt-4 resize-none"
          />
          <div className="absolute top-4 left-4">
            <Image src="/en.svg" alt="EN" width={24} height={24} />
          </div>
        </div>
        {errorEn && <p className="text-red-500 text-sm">{errorEn}</p>}
        <p className="text-white text-sm text-right">{t("remainingEn", { count: remainingEn })}</p>
      </div>
    </div>
  );
}
