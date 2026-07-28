import Image from "next/image";

interface DescriptionSectionProps {
  descriptionUa: string;
  descriptionEn: string;
  onDescriptionUaChange: (value: string) => void;
  onDescriptionEnChange: (value: string) => void;
}

export default function DescriptionSection({
  descriptionUa,
  descriptionEn,
  onDescriptionUaChange,
  onDescriptionEnChange,
}: DescriptionSectionProps) {
  const maxCharacters = 500;
  const remainingUa = maxCharacters - descriptionUa.length;
  const remainingEn = maxCharacters - descriptionEn.length;

  return (
    <div className="w-full max-w-[1000px] flex flex-col gap-2">
      <label className="font-wix text-white text-sm">Короткий опис проєкту</label>

      <div className="flex flex-col gap-1">
        <div className="relative">
          <textarea
            value={descriptionUa}
            onChange={(e) => onDescriptionUaChange(e.target.value)}
            maxLength={maxCharacters}
            placeholder="Розкажіть про проєкт (до 500 символів)"
            className="font-wix w-full h-[168px] bg-[#343434] text-white placeholder-[#A0A0A0] pl-12 pr-4 pt-4 resize-none"
          />
          <div className="absolute top-4 left-4">
            <Image src="/ua.svg" alt="UA" width={24} height={24} />
          </div>
        </div>
        <p className="text-white text-sm text-right">Залишилось {remainingUa} символів</p>
      </div>

      <div className="flex flex-col gap-1">
        <div className="relative">
          <textarea
            value={descriptionEn}
            onChange={(e) => onDescriptionEnChange(e.target.value)}
            maxLength={maxCharacters}
            placeholder="Tell us about the project (up to 500 characters)"
            className="font-wix w-full h-[168px] bg-[#343434] text-white placeholder-[#A0A0A0] pl-12 pr-4 pt-4 resize-none"
          />
          <div className="absolute top-4 left-4">
            <Image src="/en.svg" alt="EN" width={24} height={24} />
          </div>
        </div>
        <p className="text-white text-sm text-right">{remainingEn} characters remaining</p>
      </div>
    </div>
  );
}
