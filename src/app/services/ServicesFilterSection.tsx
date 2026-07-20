'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { servicesFilters } from '../../components/filters/filterConfig';
import { FilterSection as FilterSectionType, FilterItem } from '../../components/filters/filterConfig';
import { CurrencyCode } from '../../data/servicesData';

interface ServicesFilterSectionProps {
    onFilterChange?: (filters: Record<string, boolean>) => void;
    initialSelectedFilters?: Record<string, boolean>;
    selectedCurrency?: CurrencyCode | null;
    onCurrencyChange?: (currency: CurrencyCode | null) => void;
    initialMinPrice?: number;
    initialMaxPrice?: number;
    onPriceApply?: (minPrice: number, maxPrice: number) => void;
    onPriceChange?: (minPrice: number, maxPrice: number) => void;
    initialLocationSearch?: string;
    onLocationSearch?: (location: string) => void;
    onLocationChange?: (location: string) => void;
    variant?: 'sidebar' | 'panel';
}

export default function ServicesFilterSection({
    onFilterChange,
    initialSelectedFilters = {},
    selectedCurrency = null,
    onCurrencyChange,
    initialMinPrice = 0,
    initialMaxPrice = 1000000,
    onPriceApply,
    onPriceChange,
    initialLocationSearch = '',
    onLocationSearch,
    onLocationChange,
    variant = 'sidebar',
}: ServicesFilterSectionProps) {
    const MAX_PRICE = 1000000;
    // Initialize expanded sections
    const initialExpandedSections = servicesFilters.reduce((acc: Record<string, boolean>, section: FilterSectionType) => {
        acc[section.id] = true;
        return acc;
    }, {} as Record<string, boolean>);
    
    // Add custom sections
    initialExpandedSections['cost'] = true;
    initialExpandedSections['location'] = true;

    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(initialExpandedSections);
    const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>(initialSelectedFilters);
    const normalizedInitialMinPrice = Math.max(0, Math.min(initialMinPrice, MAX_PRICE));
    const normalizedInitialMaxPrice = Math.max(
        normalizedInitialMinPrice,
        Math.min(initialMaxPrice, MAX_PRICE)
    );

    const [minPrice, setMinPrice] = useState(normalizedInitialMinPrice);
    const [maxPrice, setMaxPrice] = useState(normalizedInitialMaxPrice);
    const [minPriceInput, setMinPriceInput] = useState(String(normalizedInitialMinPrice));
    const [maxPriceInput, setMaxPriceInput] = useState(String(normalizedInitialMaxPrice));
    const [locationSearch, setLocationSearch] = useState(initialLocationSearch);
    const performerItemIds = new Set(
        servicesFilters.find((section) => section.id === 'performer')?.items?.map((item) => item.id) ?? []
    );

    const initialFiltersKey = JSON.stringify(initialSelectedFilters);

    useEffect(() => {
        setSelectedFilters(initialSelectedFilters);
    }, [initialFiltersKey, initialSelectedFilters]);

    useEffect(() => {
        const nextMin = Math.max(0, Math.min(initialMinPrice, MAX_PRICE));
        const nextMax = Math.max(nextMin, Math.min(initialMaxPrice, MAX_PRICE));
        setMinPrice(nextMin);
        setMaxPrice(nextMax);
    }, [initialMinPrice, initialMaxPrice]);

    useEffect(() => {
        setMinPriceInput(String(minPrice));
    }, [minPrice]);

    useEffect(() => {
        setMaxPriceInput(String(maxPrice));
    }, [maxPrice]);

    useEffect(() => {
        setLocationSearch(initialLocationSearch);
    }, [initialLocationSearch]);

    const updateMinPrice = (value: number) => {
        const nextMin = Math.min(value, maxPrice);
        setMinPrice(nextMin);
        onPriceChange?.(nextMin, maxPrice);
    };

    const updateMaxPrice = (value: number) => {
        const nextMax = Math.max(value, minPrice);
        setMaxPrice(nextMax);
        onPriceChange?.(minPrice, nextMax);
    };

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const toggleFilter = (filterId: string) => {
        const isPerformerFilter = performerItemIds.has(filterId);
        const newFilters = {
            ...selectedFilters,
            ...(isPerformerFilter
                ? Object.fromEntries(Array.from(performerItemIds).map((id) => [id, false]))
                : {}),
            [filterId]: !selectedFilters[filterId]
        };
        setSelectedFilters(newFilters);
        onFilterChange?.(newFilters);
    };

    const normalizeAndApplyPrice = () => {
        const parsedMin = minPriceInput === '' ? 0 : parseInt(minPriceInput, 10);
        const parsedMax = maxPriceInput === '' ? minPrice : parseInt(maxPriceInput, 10);

        const nextMin = Math.max(0, Math.min(parsedMin, MAX_PRICE));
        const nextMax = Math.max(nextMin, Math.min(parsedMax, MAX_PRICE));

        setMinPrice(nextMin);
        setMaxPrice(nextMax);
        onPriceChange?.(nextMin, nextMax);
        onPriceApply?.(nextMin, nextMax);
    };

    const applyLocationSearch = () => {
        onLocationSearch?.(locationSearch);
    };

    const handleLocationInputChange = (value: string) => {
        setLocationSearch(value);
        onLocationChange?.(value);
    };

    const currencies = [
        { id: 'UAH' as CurrencyCode, defaultIcon: '/yellow_hryvnia.svg', activeIcon: '/hryvnia.svg', defaultIconWidth: 26, defaultIconHeight: 24 },
        { id: 'USD' as CurrencyCode, defaultIcon: '/yellow_dollar.svg', activeIcon: '/dollar.svg', defaultIconWidth: 22, defaultIconHeight: 28 },
        { id: 'EUR' as CurrencyCode, defaultIcon: '/yellow_euro.svg', activeIcon: '/euro.svg', defaultIconWidth: 23, defaultIconHeight: 24 },
    ];

    const containerClassName =
        variant === 'panel'
            ? 'flex w-full bg-[#414141] flex-col gap-4 px-0 pb-0'
            : 'hidden lg:flex lg:w-[316px] bg-[#414141] flex-col gap-4 px-2 pb-4';

    return (
        <div className={containerClassName}>
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
                                    <div className="font-wix text-[#FFD700] font-bold text-base px-4 py-1 text-left">
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
                                    defaultIcon={currency.defaultIcon}
                                    activeIcon={currency.activeIcon}
                                    defaultIconWidth={currency.defaultIconWidth}
                                    defaultIconHeight={currency.defaultIconHeight}
                                    isSelected={selectedCurrency === currency.id}
                                    onClick={() => {
                                        if (selectedCurrency === currency.id) {
                                            onCurrencyChange?.(null);
                                        } else {
                                            onCurrencyChange?.(currency.id);
                                        }
                                    }}
                                />
                            ))}
                        </div>

                        {/* Price inputs */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="font-wix text-white text-sm mb-1 block">Від</label>
                                <input
                                    type="text"
                                    value={minPriceInput}
                                    onChange={(e) => {
                                        const rawValue = e.target.value.replace(/\D/g, '');
                                        setMinPriceInput(rawValue);

                                        if (rawValue === '') {
                                            return;
                                        }

                                        const num = parseInt(rawValue, 10);
                                        const clamped = Math.min(num, MAX_PRICE);
                                        updateMinPrice(Math.min(clamped, maxPrice));
                                    }}
                                    onBlur={() => {
                                        if (minPriceInput === '') {
                                            updateMinPrice(0);
                                            return;
                                        }

                                        const num = parseInt(minPriceInput, 10);
                                        const clamped = Math.min(num, MAX_PRICE);
                                        updateMinPrice(Math.min(clamped, maxPrice));
                                    }}
                                    className="font-wix w-full h-10 bg-[#343434] text-white px-3"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="font-wix text-white text-sm mb-1 block">До</label>
                                <input
                                    type="text"
                                    value={maxPriceInput}
                                    onChange={(e) => {
                                        const rawValue = e.target.value.replace(/\D/g, '');
                                        setMaxPriceInput(rawValue);

                                        if (rawValue === '') {
                                            return;
                                        }

                                        const num = parseInt(rawValue, 10);
                                        const clamped = Math.min(num, MAX_PRICE);
                                        updateMaxPrice(Math.max(clamped, minPrice));
                                    }}
                                    onBlur={() => {
                                        if (maxPriceInput === '') {
                                            updateMaxPrice(minPrice);
                                            return;
                                        }

                                        const num = parseInt(maxPriceInput, 10);
                                        const clamped = Math.min(num, MAX_PRICE);
                                        updateMaxPrice(Math.max(clamped, minPrice));
                                    }}
                                    className="font-wix w-full h-10 bg-[#343434] text-white px-3"
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
                                        left: `${(minPrice / MAX_PRICE) * 100}%`,
                                        right: `${100 - (maxPrice / MAX_PRICE) * 100}%`
                                    }}
                                />
                                
                                {/* Min range input */}
                                <input
                                    type="range"
                                    min="0"
                                    max={MAX_PRICE}
                                    value={minPrice}
                                    onChange={(e) => {
                                        const value = Math.min(Number(e.target.value), MAX_PRICE);
                                        if (value <= maxPrice) {
                                            updateMinPrice(value);
                                        }
                                    }}
                                    className="absolute w-full h-full opacity-0 cursor-pointer range-slider"
                                    style={{ 
                                        zIndex: 4,
                                        // Чуть уменьшаем активную область слева справа,
                                        // чтобы при max = MAX_PRICE правый ползунок всегда был доступен
                                        clipPath: `inset(0 ${Math.max(0, 105 - (maxPrice / MAX_PRICE) * 100)}% 0 0)`
                                    }}
                                />
                                
                                {/* Max range input */}
                                <input
                                    type="range"
                                    min="0"
                                    max={MAX_PRICE}
                                    value={maxPrice}
                                    onChange={(e) => {
                                        const value = Math.min(Number(e.target.value), MAX_PRICE);
                                        if (value >= minPrice) {
                                            updateMaxPrice(value);
                                        }
                                    }}
                                    className="absolute w-full h-full opacity-0 cursor-pointer range-slider"
                                    style={{ 
                                        zIndex: 3,
                                        clipPath: `inset(0 0 0 ${(minPrice / MAX_PRICE) * 100}%)`
                                    }}
                                />
                                
                                {/* Min handle */}
                                <div 
                                    className="absolute w-6 h-6 bg-[#FECC39] flex items-center justify-center pointer-events-none"
                                    style={{ 
                                        left: `${(minPrice / MAX_PRICE) * 100}%`, 
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
                                        left: `${(maxPrice / MAX_PRICE) * 100}%`, 
                                        top: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 5
                                    }}
                                >
                                    <div className="w-2 h-2 bg-[#272727]" />
                                </div>
                            </div>
                            <button
                                onClick={normalizeAndApplyPrice}
                                className="w-10 h-10 bg-[#FECC39] flex items-center justify-center hover:bg-white transition-colors"
                            >
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
                                onChange={(e) => handleLocationInputChange(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        applyLocationSearch();
                                    }
                                }}
                                className="font-wix w-full h-full bg-[#343434] text-white placeholder-gray-400 px-4 pr-12 rounded-none"
                            />
                            <button
                                type="button"
                                onClick={applyLocationSearch}
                                className="absolute right-4 top-1/2 -translate-y-1/2"
                                aria-label="Search by location"
                            >
                                <Image
                                    src="/search.svg"
                                    alt="Search"
                                    width={20}
                                    height={20}
                                />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Currency Button Component
function CurrencyButton({ defaultIcon, activeIcon, defaultIconWidth, defaultIconHeight, isSelected, onClick }: {
    defaultIcon: string;
    activeIcon: string;
    defaultIconWidth: number;
    defaultIconHeight: number;
    isSelected: boolean;
    onClick: () => void;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const showActiveIcon = isSelected || isHovered;

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
                src={showActiveIcon ? activeIcon : defaultIcon}
                alt="Currency"
                width={showActiveIcon ? 48 : defaultIconWidth}
                height={showActiveIcon ? 48 : defaultIconHeight}
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
