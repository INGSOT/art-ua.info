import { useEffect, useRef } from "react";
import Image from "next/image";

interface OwnerItem {
  id: string;
  name: string;
  avatar?: string;
}

interface OwnerSelectionSectionProps {
  owners: OwnerItem[];
  selectedOwner: string | null;
  hoveredOwner: string | null;
  showError?: boolean;
  errorMessage?: string;
  onOwnerSelect: (ownerId: string) => void;
  onOwnerHover: (ownerId: string | null) => void;
}

export default function OwnerSelectionSection({
  owners,
  selectedOwner,
  hoveredOwner,
  showError,
  errorMessage,
  onOwnerSelect,
  onOwnerHover,
}: OwnerSelectionSectionProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showError) {
      listRef.current?.focus();
    }
  }, [showError]);

  return (
    <div className="w-full max-w-[1000px] flex flex-col items-center gap-4">
      <p className="font-wix text-white text-[18px] font-semibold text-center">
        Вкажіть власника проєкту
      </p>
      <div
        ref={listRef}
        tabIndex={-1}
        className={`flex flex-col gap-4 ${
          showError ? "border-2 border-red-500 p-2" : ""
        }`}
      >
        {owners.map((owner) => (
          <button
            key={owner.id}
            type="button"
            onClick={() => onOwnerSelect(owner.id)}
            onMouseEnter={() => onOwnerHover(owner.id)}
            onMouseLeave={() => onOwnerHover(null)}
            className="flex items-center justify-start gap-3 px-4 py-3 bg-[#343434] relative whitespace-nowrap h-[60px] w-[400px]"
          >
            {owner.avatar ? (
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={owner.avatar}
                  alt={owner.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#414141] flex items-center justify-center flex-shrink-0 text-[#A0A0A0] text-xl leading-none">
                +
              </div>
            )}

            <span className="font-wix text-white flex-1 text-left">{owner.name}</span>

            <div
              className={`w-5 h-5 flex items-center justify-center transition-colors ${
                selectedOwner === owner.id ? "bg-[#FFD700]" : "bg-[#414141]"
              }`}
            >
              <Image
                src={
                  hoveredOwner === owner.id && selectedOwner !== owner.id
                    ? "/yellow_check.svg"
                    : "/grey_check.svg"
                }
                alt="check"
                width={12}
                height={12}
              />
            </div>
          </button>
        ))}
      </div>
      {showError && (
        <p className="font-wix text-red-500 text-sm text-center">
          {errorMessage || "Оберіть власника проєкту"}
        </p>
      )}
    </div>
  );
}
