import Image from "next/image";

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
  onProjectNameUaChange,
  onProjectNameEnChange,
  onOpenArtFieldModal,
}: NameSectionProps) {
  return (
    <>
      <div className="w-full max-w-[1000px] flex flex-col gap-2">
        <label className="font-wix text-white text-sm">{projectNameLabel}</label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Image src="/ua.svg" alt="UA" width={24} height={24} />
          </div>
          <input
            type="text"
            value={projectNameUa}
            onChange={(e) => onProjectNameUaChange(e.target.value)}
            placeholder={projectNamePlaceholder}
            className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
          />
        </div>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Image src="/en.svg" alt="EN" width={24} height={24} />
          </div>
          <input
            type="text"
            value={projectNameEn}
            onChange={(e) => onProjectNameEnChange(e.target.value)}
            placeholder={projectNamePlaceholderEn}
            className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
          />
        </div>
      </div>

      <div className="w-full max-w-[1000px] flex flex-col gap-2">
        <label className="font-wix text-white text-sm">Галузь мистецтва</label>
        <button
          type="button"
          onClick={onOpenArtFieldModal}
          className="font-wix w-full flex items-center justify-between gap-4 px-6 py-4 bg-[#343434] text-white hover:bg-[#3a3a3a] transition-colors"
        >
          <span>{selectedArtField ? selectedArtField.label : artFieldButton}</span>
          <Image src="/white_triangle_left.svg" alt="arrow" width={20} height={20} />
        </button>
      </div>
    </>
  );
}
