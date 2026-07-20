'use client';

import Image from 'next/image';
import { FilterChip } from './filterChipUtils';

interface SelectedFiltersBarProps {
    chips: FilterChip[];
    onRemove: (chipId: string) => void;
    onClearAll: () => void;
}

export default function SelectedFiltersBar({ chips, onRemove, onClearAll }: SelectedFiltersBarProps) {
    if (chips.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
                type="button"
                onClick={onClearAll}
                className="text-[#FECC39] font-normal text-sm md:text-base underline hover:opacity-80 transition-opacity"
            >
                Скинути все
            </button>

            {chips.map((chip) => (
                <div
                    key={chip.id}
                    className="flex items-center gap-2 bg-[#343434] px-3 py-2"
                >
                    <span className="text-white font-bold text-sm md:text-base whitespace-nowrap">
                        {chip.label}
                    </span>
                    <button
                        type="button"
                        onClick={() => onRemove(chip.id)}
                        className="flex items-center justify-center hover:opacity-80 transition-opacity"
                        aria-label={`Видалити фільтр ${chip.label}`}
                    >
                        <Image
                            src="/yellow_cross.svg"
                            alt=""
                            width={16}
                            height={16}
                        />
                    </button>
                </div>
            ))}
        </div>
    );
}
