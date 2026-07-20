'use client';

import Image from 'next/image';

interface FiltersButtonProps {
    onClick?: () => void;
    isActive?: boolean;
    className?: string;
    selectedCount?: number;
}

export default function FiltersButton({
    onClick,
    isActive = false,
    className = '',
    selectedCount = 0,
}: FiltersButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-expanded={isActive}
            className={`flex items-center gap-2 h-[44px] md:h-[48px] px-2 md:px-3 bg-[#343434] hover:bg-[#3a3a3a] transition-colors flex-shrink-0 min-w-0 ${className}`}
        >
            <span className="font-bold text-[#FECC39] text-sm md:text-base whitespace-nowrap">
                Фільтри ({selectedCount})
            </span>
            <span className="w-px self-stretch bg-[#FECC39] my-2" aria-hidden="true" />
            <Image src="/filters.svg" alt="" width={16} height={16} className="w-4 h-4 flex-shrink-0" />
        </button>
    );
}
