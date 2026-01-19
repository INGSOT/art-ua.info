'use client';

import { useState } from 'react';
import Image from 'next/image';

// Filter data structure
interface FilterItem {
    id: string;
    label: string;
    type: 'checkbox' | 'checkmark';
}

interface FilterSubsection {
    id: string;
    title: string;
    items: FilterItem[];
}

interface FilterSection {
    id: string;
    title: string;
    type: 'simple' | 'nested';
    items?: FilterItem[];
    subsections?: FilterSubsection[];
}

// Filter data collection
const FILTER_DATA: FilterSection[] = [
    {
        id: 'platform-participants',
        title: 'Учасники платформи',
        type: 'simple',
        items: [
            { id: 'all', label: 'Усі', type: 'checkbox' },
            { id: 'artists', label: 'Митці', type: 'checkbox' },
            { id: 'organizations', label: 'Організації', type: 'checkbox' },
            { id: 'teams', label: 'Команди', type: 'checkbox' },
        ]
    },
    {
        id: 'art-fields',
        title: 'Галузі мистецтва',
        type: 'nested',
        subsections: [
            {
                id: 'stage-art',
                title: 'Сценічне мистецтво',
                items: [
                    { id: 'directing', label: 'Режисура', type: 'checkmark' },
                    { id: 'acting', label: 'Акторське мистецтво', type: 'checkmark' },
                    { id: 'music', label: 'Музичне мистецтво', type: 'checkmark' },
                    { id: 'choreography', label: 'Хореографічне мистецтво', type: 'checkmark' },
                    { id: 'original-genre', label: 'Оригінальний жанр', type: 'checkmark' },
                ]
            },
            {
                id: 'visual-art',
                title: 'Візуальне мистецтво',
                items: [
                    { id: 'art-photography', label: 'Художня фотографія', type: 'checkmark' },
                    { id: 'video-editing', label: 'Відеозйомка та монтаж', type: 'checkmark' },
                    { id: 'cinema', label: 'Повнометражний кінематограф', type: 'checkmark' },
                    { id: 'ar', label: 'Доповнена реальність', type: 'checkmark' },
                ]
            },
            {
                id: 'fine-art',
                title: 'Образотворче мистецтво',
                items: [
                    { id: 'painting', label: 'Живопис', type: 'checkmark' },
                    { id: 'sculpture', label: 'Скульптура', type: 'checkmark' },
                    { id: 'graphics', label: 'Графіка', type: 'checkmark' },
                ]
            },
            {
                id: 'literature',
                title: 'Література',
                items: [
                    { id: 'poetry', label: 'Поезія', type: 'checkmark' },
                    { id: 'prose', label: 'Проза', type: 'checkmark' },
                ]
            }
        ]
    }
];

interface FilterSectionProps {
    onFilterChange?: (filters: Record<string, boolean>) => void;
}

export default function FilterSection({ onFilterChange }: FilterSectionProps) {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        'platform-participants': true,
        'art-fields': true,
    });
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
        <div className="w-[360px] bg-[#414141] flex flex-col gap-4 px-2 pb-4">
            {FILTER_DATA.map((section) => (
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

// Checkbox component for "Учасники платформи"
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

// Checkmark component for "Галузі мистецтва"
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
                    src={isHovered && !isSelected ? '/yellow_check.svg.svg' : '/grey_check.svg.svg'}
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
