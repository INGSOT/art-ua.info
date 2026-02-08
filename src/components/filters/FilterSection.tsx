'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FilterSection as FilterSectionType, FilterItem } from './filterConfig';

interface FilterSectionProps {
    filters: FilterSectionType[];
    onFilterChange?: (filters: Record<string, boolean>) => void;
}

export default function FilterSection({ filters, onFilterChange }: FilterSectionProps) {
    // Initialize expanded sections - all sections expanded by default
    const initialExpandedSections = filters.reduce((acc, section) => {
        acc[section.id] = true;
        return acc;
    }, {} as Record<string, boolean>);

    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(initialExpandedSections);
    const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({});

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const toggleFilter = (filterId: string) => {
        const newFilters = {
            ...selectedFilters,
            [filterId]: !selectedFilters[filterId]
        };
        setSelectedFilters(newFilters);
        onFilterChange?.(newFilters);
    };

    return (
        <div className="hidden lg:flex lg:w-[360px] bg-[#414141] flex-col gap-4 px-2 pb-4">
            {filters.map((section) => (
                <div key={section.id}>
                    {/* Section Header */}
                    <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full h-[50px] bg-[#343434] flex items-center justify-between px-4 cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        <span className="text-white font-bold text-base text-left">
                            {section.title}
                        </span>
                        <Image
                            src={expandedSections[section.id] ? '/white_triangle_down.svg' : '/white_triangle_up.svg'}
                            alt="toggle"
                            width={24}
                            height={24}
                        />
                    </button>

                    {/* Section Content */}
                    {expandedSections[section.id] && (
                        <div className="mt-2 flex flex-col gap-2">
                            {section.type === 'simple' && section.items?.map((item) => (
                                <FilterItemCheckbox
                                    key={item.id}
                                    item={item}
                                    isSelected={selectedFilters[item.id] || false}
                                    onToggle={() => toggleFilter(item.id)}
                                />
                            ))}

                            {section.type === 'nested' && section.subsections?.map((subsection) => (
                                <div key={subsection.id} className="flex flex-col gap-2">
                                    <div className="text-[#FFD700] font-bold text-base px-4 py-1 text-left">
                                        {subsection.title}
                                    </div>
                                    {subsection.items.map((item) => (
                                        <FilterItemCheckmark
                                            key={item.id}
                                            item={item}
                                            isSelected={selectedFilters[item.id] || false}
                                            onToggle={() => toggleFilter(item.id)}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// Checkbox component
function FilterItemCheckbox({ item, isSelected, onToggle }: {
    item: FilterItem;
    isSelected: boolean;
    onToggle: () => void;
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={onToggle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full h-[50px] bg-[#343434] flex items-center gap-3 px-4 cursor-pointer transition-colors"
        >
            {/* Checkbox */}
            <div
                className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
                    isSelected || isHovered ? 'border-[#FFD700]' : 'border-white'
                }`}
            >
                {isSelected && (
                    <div className="w-3 h-3 bg-[#FFD700]"></div>
                )}
            </div>

            {/* Label */}
            <span className={`flex-1 text-left font-bold text-base transition-colors ${
                isSelected || isHovered ? 'text-[#FFD700]' : 'text-white'
            }`}>
                {item.label}
            </span>
        </button>
    );
}

// Checkmark component
function FilterItemCheckmark({ item, isSelected, onToggle }: {
    item: FilterItem;
    isSelected: boolean;
    onToggle: () => void;
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={onToggle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full h-[50px] bg-[#343434] flex items-center gap-3 px-4 cursor-pointer transition-colors"
        >
            {/* Checkmark */}
            <div
                className={`w-5 h-5 flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-[#FFD700]' : 'bg-[#414141]'
                }`}
            >
                <Image
                    src={isHovered && !isSelected ? '/yellow_check.svg' : '/grey_check.svg'}
                    alt="check"
                    width={12}
                    height={12}
                />
            </div>

            {/* Label */}
            <span className={`flex-1 text-left font-bold text-base transition-colors ${
                isSelected || isHovered ? 'text-[#FFD700]' : 'text-white'
            }`}>
                {item.label}
            </span>
        </button>
    );
}
