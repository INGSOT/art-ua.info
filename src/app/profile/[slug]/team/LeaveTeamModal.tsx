"use client";

import { useEffect } from "react";
import { useState } from "react";

interface LeaveTeamModalProps {
  isOpen: boolean;
  teamName: string;
  onClose: () => void;
  onLeave: () => void;
}

export default function LeaveTeamModal({
  isOpen,
  teamName,
  onClose,
  onLeave,
}: LeaveTeamModalProps) {
  const [isConfirmStep, setIsConfirmStep] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setIsConfirmStep(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-[#414141] z-50 flex flex-col">
        <div className="p-6 md:p-[30px] flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="font-bold text-white text-[18px] font-[family-name:var(--font-unbounded)]">
              {teamName}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#343434] transition-colors"
              aria-label="Закрити"
            >
              <img src="/yellow_cross.svg" alt="Закрити" className="w-8 h-8" />
            </button>
          </div>

          {!isConfirmStep ? (
            <button
              type="button"
              onClick={() => setIsConfirmStep(true)}
              className="mt-8 w-full h-[60px] bg-[#FECC39] text-[#343434] font-bold text-[16px] leading-[1.2] font-[family-name:var(--font-unbounded)] hover:bg-white transition-colors"
            >
              Покинути команду
            </button>
          ) : (
            <div className="mt-8">
              <p className="font-wix text-white text-[18px] leading-[1.4]">
                Ви впевнені, що хочете покинути команду?
              </p>

              <div className="mt-8 w-full border-t border-[#343434]" />

              <button
                type="button"
                onClick={onLeave}
                className="mt-8 w-full h-[60px] bg-[#343434] text-[#FECC39] font-bold text-[16px] leading-[1.2] font-[family-name:var(--font-unbounded)] hover:bg-[#FECC39] hover:text-[#343434] transition-colors"
              >
                Так, піти
              </button>

              <button
                type="button"
                onClick={onClose}
                className="mt-8 w-full h-[60px] bg-[#FECC39] text-[#343434] font-bold text-[16px] leading-[1.2] font-[family-name:var(--font-unbounded)] hover:bg-white transition-colors"
              >
                Ні, залишитись
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
