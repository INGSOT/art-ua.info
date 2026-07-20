'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ServicesFilterSection from '../../app/services/ServicesFilterSection';
import { CurrencyCode } from '../../data/servicesData';

export interface ServicesFilterDraft {
    filters: Record<string, boolean>;
    currency: CurrencyCode | null;
    minPrice: number;
    maxPrice: number;
    applyPrice: boolean;
    location: string;
}

interface ServicesFiltersModalProps {
    onClose: () => void;
    initialSelectedFilters: Record<string, boolean>;
    selectedCurrency: CurrencyCode | null;
    initialMinPrice: number;
    initialMaxPrice: number;
    hasPriceFilter: boolean;
    initialLocation: string;
    getResultCount: (draft: ServicesFilterDraft) => number;
    onApply: (draft: ServicesFilterDraft) => void;
    onCancel: () => void;
}

export default function ServicesFiltersModal({
    onClose,
    initialSelectedFilters,
    selectedCurrency,
    initialMinPrice,
    initialMaxPrice,
    hasPriceFilter,
    initialLocation,
    getResultCount,
    onApply,
    onCancel,
}: ServicesFiltersModalProps) {
    const [draftFilters, setDraftFilters] = useState(initialSelectedFilters);
    const [draftCurrency, setDraftCurrency] = useState<CurrencyCode | null>(selectedCurrency);
    const [draftMinPrice, setDraftMinPrice] = useState(initialMinPrice);
    const [draftMaxPrice, setDraftMaxPrice] = useState(initialMaxPrice);
    const [draftApplyPrice, setDraftApplyPrice] = useState(hasPriceFilter);
    const [draftLocation, setDraftLocation] = useState(initialLocation);

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

    const draft: ServicesFilterDraft = {
        filters: draftFilters,
        currency: draftCurrency,
        minPrice: draftMinPrice,
        maxPrice: draftMaxPrice,
        applyPrice: draftApplyPrice,
        location: draftLocation,
    };

    const foundCount = getResultCount(draft);

    const handleCancel = () => {
        onCancel();
        onClose();
    };

    const handleApply = () => {
        onApply(draft);
        onClose();
    };

    const handlePriceChange = (minPrice: number, maxPrice: number) => {
        setDraftMinPrice(minPrice);
        setDraftMaxPrice(maxPrice);
        setDraftApplyPrice(true);
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
                <ServicesFilterSection
                    variant="panel"
                    initialSelectedFilters={initialSelectedFilters}
                    onFilterChange={setDraftFilters}
                    selectedCurrency={draftCurrency}
                    onCurrencyChange={setDraftCurrency}
                    initialMinPrice={initialMinPrice}
                    initialMaxPrice={initialMaxPrice}
                    onPriceChange={handlePriceChange}
                    onPriceApply={handlePriceChange}
                    initialLocationSearch={initialLocation}
                    onLocationChange={setDraftLocation}
                    onLocationSearch={setDraftLocation}
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
