'use client';

import { useEffect, useState } from 'react';
import SearchSection from './SearchSection';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setValue('');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000]">
      <div
        className="absolute inset-0 bg-black/60"
        onMouseDown={(e) => {
          // Закрываем только при клике по оверлею, не по самой модалке.
          if (e.target === e.currentTarget) onClose();
        }}
      />

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#414141] w-[900px] h-[640px] p-[30px]"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between">
          <div className="font-bold text-white text-[18px] font-[family-name:var(--font-unbounded)]">
            Пошук
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center"
            aria-label="Закрити"
          >
            <img src="/yellow_cross.svg" alt="Закрити" className="w-8 h-8 md:w-9 md:h-9" />
          </button>
        </div>

        <div className="h-full flex flex-col items-center justify-center">
          {/* <div className="mb-6 font-bold text-white text-[18px] font-[family-name:var(--font-unbounded)] text-center">
            Шукайте митців та їх проекти
          </div> */}

          <div className="w-full">
            <SearchSection
              placeholder="Пошук"
              value={value}
              onChange={setValue}
              maxWidthPx={600}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

