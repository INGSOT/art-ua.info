import Image from "next/image";

interface Characteristic {
  id: string;
  name: string;
  description: string;
}

interface CharacteristicsSectionProps {
  description: string;
  characteristicNameLabel: string;
  characteristicDescLabel: string;
  characteristicNamePlaceholder: string;
  characteristicNamePlaceholderEn: string;
  characteristicDescPlaceholder: string;
  characteristicDescPlaceholderEn: string;
  characteristics: Characteristic[];
  onUpdateCharacteristic: (
    id: string,
    field: "name" | "description",
    value: string
  ) => void;
  onMoveCharacteristic: (id: string, direction: "up" | "down") => void;
  onDeleteCharacteristic: (id: string) => void;
  onAddCharacteristic: () => void;
}

export default function CharacteristicsSection({
  description,
  characteristicNameLabel,
  characteristicDescLabel,
  characteristicNamePlaceholder,
  characteristicNamePlaceholderEn,
  characteristicDescPlaceholder,
  characteristicDescPlaceholderEn,
  characteristics,
  onUpdateCharacteristic,
  onMoveCharacteristic,
  onDeleteCharacteristic,
  onAddCharacteristic,
}: CharacteristicsSectionProps) {
  return (
    <div className="w-full max-w-[1000px] flex flex-col gap-6">
      <p className="text-white whitespace-pre-line">{description}</p>

      {characteristics.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-wix text-white text-sm">
                {characteristicNameLabel}
              </label>
            </div>
            <div className="flex-1">
              <label className="font-wix text-white text-sm">
                {characteristicDescLabel}
              </label>
            </div>
            {characteristics.length > 1 && <div className="w-[160px]" />}
          </div>
        </div>
      )}

      {characteristics.map((char, index) => (
        <div key={char.id} className="flex gap-4">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Image src="/ua.svg" alt="UA" width={24} height={24} />
                </div>
                <input
                  type="text"
                  value={char.name}
                  onChange={(e) =>
                    onUpdateCharacteristic(char.id, "name", e.target.value)
                  }
                  placeholder={characteristicNamePlaceholder}
                  className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
                />
              </div>
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Image src="/ua.svg" alt="UA" width={24} height={24} />
                </div>
                <input
                  type="text"
                  value={char.description}
                  onChange={(e) =>
                    onUpdateCharacteristic(char.id, "description", e.target.value)
                  }
                  placeholder={characteristicDescPlaceholder}
                  className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Image src="/en.svg" alt="EN" width={24} height={24} />
                </div>
                <input
                  type="text"
                  placeholder={characteristicNamePlaceholderEn}
                  className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
                />
              </div>
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Image src="/en.svg" alt="EN" width={24} height={24} />
                </div>
                <input
                  type="text"
                  placeholder={characteristicDescPlaceholderEn}
                  className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
                />
              </div>
            </div>
          </div>

          {characteristics.length > 1 && (
            <div className="flex flex-col justify-center gap-1 bg-[#343434] px-2 h-full">
              <button
                type="button"
                onClick={() => onMoveCharacteristic(char.id, "up")}
                disabled={index === 0}
                className="w-[40px] h-[36px] flex items-center justify-center hover:bg-[#414141] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Image
                  src="/yellow_triangle_up.svg"
                  alt="Move up"
                  width={20}
                  height={20}
                />
              </button>
              <button
                type="button"
                onClick={() => onMoveCharacteristic(char.id, "down")}
                disabled={index === characteristics.length - 1}
                className="w-[40px] h-[36px] flex items-center justify-center hover:bg-[#414141] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Image
                  src="/yellow_triangle_down.svg"
                  alt="Move down"
                  width={20}
                  height={20}
                />
              </button>
              <button
                type="button"
                onClick={() => onDeleteCharacteristic(char.id)}
                className="w-[40px] h-[36px] flex items-center justify-center hover:bg-[#414141] transition-colors"
              >
                <Image src="/yellow_cross.svg" alt="Delete" width={20} height={20} />
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onAddCharacteristic}
          className="w-[60px] h-[60px] bg-[#FECC39] flex items-center justify-center hover:bg-[#ffd557] transition-colors"
        >
          <Image src="/plus.svg" alt="add" width={24} height={24} />
        </button>
      </div>
    </div>
  );
}
