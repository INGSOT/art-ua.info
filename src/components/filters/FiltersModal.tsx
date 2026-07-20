'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import FilterSection from './FilterSection';
import { FilterSection as FilterSectionType } from './filterConfig';

interface FiltersModalProps {
    onClose: () => void;
    filters: FilterSectionType[];
    initialSelectedFilters: Record<string, boolean>;
    getResultCount: (filters: Record<string, boolean>) => number;
    onApply: (filters: Record<string, boolean>) => void;
    onCancel: () => void;
}

export default function FiltersModal({
    onClose,
    filters,
    initialSelectedFilters,
    getResultCount,
    onApply,
    onCancel,
}: FiltersModalProps) {
    const [draftFilters, setDraftFilters] = useState(initialSelectedFilters);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        const mediaQuery = window.matchMedia('(min-width: 1024px)');
        const onViewportChange = (event: MediaQueryListEvent) => {
            if (event.matches) onClose();
        };

        window.addEventListener('keydown', onKeyDown);
        mediaQuery.addEventListener('change', onViewportChange);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
            mediaQuery.removeEventListener('change', onViewportChange);
        };
    }, [onClose]);

    const foundCount = getResultCount(draftFilters);

    const handleCancel = () => {
        onCancel();
        onClose();
    };

    const handleApply = () => {
        onApply(draftFilters);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[100] lg:hidden flex flex-col bg-[#414141]"
            role="dialog"
            aria-modal="true"
            aria-label="Фільтри"
        >
            <div className="flex items-center justify-between px-4 pt-5 pb-3 flex-shrink-0">
                <button
                    type="button"
                    onClick={onClose}
                    className="w-10 h-10 flex items-center justify-center"
                    aria-label="Закрити"
                >
                    <Image src="/yellow_cross.svg" alt="" width={28} height={28} className="w-7 h-7" />
                </button>
                <p className="text-white font-bold text-base md:text-lg">
                    Знайдено: {foundCount}
                </p>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-4">
                <FilterSection
                    filters={filters}
                    initialSelectedFilters={initialSelectedFilters}
                    onFilterChange={setDraftFilters}
                    variant="panel"
                />
            </div>

            <div className="flex flex-shrink-0 w-full gap-3 px-4 pt-4 pb-5 bg-[#414141]">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 h-[44px] md:h-[48px] bg-white text-[#343434] font-bold text-sm md:text-base hover:bg-[#f0f0f0] transition-colors"
                >
                    Скасувати
                </button>
                <button
                    type="button"
                    onClick={handleApply}
                    className="flex-1 h-[44px] md:h-[48px] bg-[#343434] text-[#FECC39] font-bold text-sm md:text-base hover:bg-[#3a3a3a] transition-colors"
                >
                    Застосувати
                </button>
            </div>
        </div>
    );
}
