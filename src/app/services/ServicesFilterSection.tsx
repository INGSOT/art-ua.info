'use client';

import { useState } from 'react';
import Image from 'next/image';
import { servicesFilters } from '../../components/filters/filterConfig';
import { FilterSection as FilterSectionType, FilterItem } from '../../components/filters/filterConfig';

export default function ServicesFilterSection() {
    // Initialize expanded sections
    const initialExpandedSections = servicesFilters.reduce((acc: Record<string, boolean>, section: FilterSectionType) => {
        acc[section.id] = true;
        return acc;
    }, {} as Record<string, boolean>);
    
    // Add custom sections
    initialExpandedSections['cost'] = true;
    initialExpandedSections['location'] = true;

    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(initialExpandedSections);
    const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({});
    const [selectedCurrency, setSelectedCurrency] = useState<'hryvnia' | 'dollar' | 'euro' | null>(null);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000000);
    const [locationSearch, setLocationSearch] = useState('');

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
    };

    const currencies = [
        { id: 'hryvnia', icon: '/hryvnia.svg' },
        { id: 'dollar', icon: '/dollar.svg' },
        { id: 'euro', icon: '/euro.svg' },
    ];

    return (
        <div className="hidden lg:flex lg:w-[360px] bg-[#414141] flex-col gap-4 px-2 pb-4">
            {/* Regular filters */}
            {servicesFilters.map((section: FilterSectionType) => (
                <div key={section.id}>
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

                    {expandedSections[section.id] && (
                        <div className="mt-2 flex flex-col gap-2">
                            {section.type === 'simple' && section.items?.map((item: FilterItem) => (
                                <FilterItemCheckbox
                                    key={item.id}
                                    item={item}
                                    isSelected={selectedFilters[item.id] || false}
                                    onToggle={() => toggleFilter(item.id)}
                                />
                            ))}

                            {section.type === 'nested' && section.subsections?.map((subsection: any) => (
                                <div key={subsection.id} className="flex flex-col gap-2">
                                    <div className="text-[#FFD700] font-bold text-base px-4 py-1 text-left">
                                        {subsection.title}
                                    </div>
                                    {subsection.items.map((item: FilterItem) => (
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

            {/* Cost Section */}
            <div>
                <button
                    onClick={() => toggleSection('cost')}
                    className="w-full h-[50px] bg-[#343434] flex items-center justify-between px-4 cursor-pointer hover:opacity-90 transition-opacity"
                >
                    <span className="text-white font-bold text-base text-left">
                        Вартість
                    </span>
                    <Image
                        src={expandedSections['cost'] ? '/white_triangle_down.svg' : '/white_triangle_up.svg'}
                        alt="toggle"
                        width={24}
                        height={24}
                    />
                </button>

                {expandedSections['cost'] && (
                    <div className="mt-2 flex flex-col gap-4 py-4">
                        {/* Currency selector */}
                        <div className="flex gap-4">
                            {currencies.map((currency) => (
                                <CurrencyButton
                                    key={currency.id}
                                    icon={currency.icon}
                                    isSelected={selectedCurrency === currency.id}
                                    onClick={() => {
                                        if (selectedCurrency === currency.id) {
                                            setSelectedCurrency(null);
                                        } else {
                                            setSelectedCurrency(currency.id as any);
                                        }
                                    }}
                                />
                            ))}
                        </div>

                        {/* Price inputs */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-white text-sm mb-1 block">Від</label>
                                <input
                                    type="text"
                                    value={minPrice.toLocaleString()}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        const num = value ? parseInt(value) : 0;
                                        setMinPrice(Math.min(num, maxPrice));
                                    }}
                                    className="w-full h-10 bg-[#343434] text-white px-3 outline-none"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-white text-sm mb-1 block">До</label>
                                <input
                                    type="text"
                                    value={maxPrice.toLocaleString()}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        const num = value ? parseInt(value) : 0;
                                        setMaxPrice(Math.max(num, minPrice));
                                    }}
                                    className="w-full h-10 bg-[#343434] text-white px-3 outline-none"
                                />
                            </div>
                        </div>

                        {/* Price slider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 relative h-8 mx-4">
                                {/* Track background */}
                                <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-[#272727] rounded-full" />
                                
                                {/* Active range */}
                                <div 
                                    className="absolute top-1/2 -translate-y-1/2 h-2 bg-[#FECC39] rounded-full pointer-events-none"
                                    style={{
                                        left: `${(minPrice / 1000000) * 100}%`,
                                        right: `${100 - (maxPrice / 1000000) * 100}%`
                                    }}
                                />
                                
                                {/* Min range input */}
                                <input
                                    type="range"
                                    min="0"
                                    max="1000000"
                                    value={minPrice}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        if (value <= maxPrice) {
                                            setMinPrice(value);
                                        }
                                    }}
                                    className="absolute w-full h-full opacity-0 cursor-pointer range-slider"
                                    style={{ 
                                        zIndex: minPrice > (maxPrice - 50000) ? 5 : 3,
                                        pointerEvents: 'auto'
                                    }}
                                />
                                
                                {/* Max range input */}
                                <input
                                    type="range"
                                    min="0"
                                    max="1000000"
                                    value={maxPrice}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        if (value >= minPrice) {
                                            setMaxPrice(value);
                                        }
                                    }}
                                    className="absolute w-full h-full opacity-0 cursor-pointer range-slider"
                                    style={{ 
                                        zIndex: maxPrice < (minPrice + 50000) ? 5 : 4,
                                        pointerEvents: 'auto'
                                    }}
                                />
                                
                                {/* Min handle */}
                                <div 
                                    className="absolute w-6 h-6 bg-[#FECC39] flex items-center justify-center pointer-events-none"
                                    style={{ 
                                        left: `${(minPrice / 1000000) * 100}%`, 
                                        top: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 5
                                    }}
                                >
                                    <div className="w-2 h-2 bg-[#272727]" />
                                </div>
                                
                                {/* Max handle */}
                                <div 
                                    className="absolute w-6 h-6 bg-[#FECC39] flex items-center justify-center pointer-events-none"
                                    style={{ 
                                        left: `${(maxPrice / 1000000) * 100}%`, 
                                        top: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 5
                                    }}
                                >
                                    <div className="w-2 h-2 bg-[#272727]" />
                                </div>
                            </div>
                            <button className="w-10 h-10 bg-[#FECC39] flex items-center justify-center hover:bg-white transition-colors">
                                <Image
                                    src="/grey_check.svg"
                                    alt="Apply"
                                    width={16}
                                    height={16}
                                />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Location Section */}
            <div>
                <button
                    onClick={() => toggleSection('location')}
                    className="w-full h-[50px] bg-[#343434] flex items-center justify-between px-4 cursor-pointer hover:opacity-90 transition-opacity"
                >
                    <span className="text-white font-bold text-base text-left">
                        Місцезнаходження
                    </span>
                    <Image
                        src={expandedSections['location'] ? '/white_triangle_down.svg' : '/white_triangle_up.svg'}
                        alt="toggle"
                        width={24}
                        height={24}
                    />
                </button>

                {expandedSections['location'] && (
                    <div className="mt-2">
                        <div className="relative w-full h-[50px]">
                            <input
                                type="text"
                                placeholder="Пошук"
                                value={locationSearch}
                                onChange={(e) => setLocationSearch(e.target.value)}
                                className="w-full h-full bg-[#343434] text-white placeholder-gray-400 px-4 pr-12 rounded-none outline-none"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Image
                                    src="/search.svg"
                                    alt="Search"
                                    width={20}
                                    height={20}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Currency Button Component
function CurrencyButton({ icon, isSelected, onClick }: {
    icon: string;
    isSelected: boolean;
    onClick: () => void;
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`flex-1 h-12 flex items-center justify-center transition-colors ${
                isSelected || isHovered ? 'bg-[#FECC39]' : 'bg-[#343434]'
            }`}
        >
            <Image
                src={icon}
                alt="Currency"
                width={48}
                height={48}
                className={`transition-all ${
                    isSelected || isHovered ? 'brightness-0' : 'brightness-100'
                }`}
            />
        </button>
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
            <div
                className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
                    isSelected || isHovered ? 'border-[#FFD700]' : 'border-white'
                }`}
            >
                {isSelected && (
                    <div className="w-3 h-3 bg-[#FFD700]"></div>
                )}
            </div>

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

            <span className={`flex-1 text-left font-bold text-base transition-colors ${
                isSelected || isHovered ? 'text-[#FFD700]' : 'text-white'
            }`}>
                {item.label}
            </span>
        </button>
    );
}
