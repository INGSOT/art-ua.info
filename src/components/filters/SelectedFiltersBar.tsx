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
        <div className="flex flex-nowrap items-center gap-2 mb-4 overflow-x-auto scrollbar-hide">
            <button
                type="button"
                onClick={onClearAll}
                className="flex-shrink-0 font-wix text-[#FECC39] font-normal text-xs leading-4 underline hover:opacity-80 transition-opacity"
            >
                Скинути все
            </button>

            {chips.map((chip) => (
                <div
                    key={chip.id}
                    className="flex flex-shrink-0 items-center gap-1.5 bg-[#343434] px-2 py-1.5"
                >
                    <span className="font-wix text-white font-normal text-xs leading-4 whitespace-nowrap">
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
                            width={12}
                            height={12}
                        />
                    </button>
                </div>
            ))}
        </div>
    );
}
