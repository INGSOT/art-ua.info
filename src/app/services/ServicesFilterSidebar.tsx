"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { publicServicesAPI, type ServicesFilterCategory, type ServiceCurrency } from "../../lib/api/publicServices";

const MAX_PRICE = 1000000;

interface ServicesFilterSidebarProps {
  className?: string;
  categories: ServicesFilterCategory[];
  selectedSubcategories: string[];
  onToggleSubcategory: (slug: string) => void;
  selectedCurrency: ServiceCurrency | null;
  onCurrencyChange: (currency: ServiceCurrency | null) => void;
  initialMinPrice: number;
  initialMaxPrice: number;
  onApplyPrice: (minPrice: number, maxPrice: number) => void;
  locationInput: string;
  onLocationInputChange: (value: string) => void;
  onApplyLocation: () => void;
  onSelectLocation: (city: string) => void;
}

const CURRENCIES: { id: ServiceCurrency; defaultIcon: string; activeIcon: string; width: number; height: number }[] = [
  { id: "UAH", defaultIcon: "/yellow_hryvnia.svg", activeIcon: "/hryvnia.svg", width: 26, height: 24 },
  { id: "USD", defaultIcon: "/yellow_dollar.svg", activeIcon: "/dollar.svg", width: 22, height: 28 },
  { id: "EUR", defaultIcon: "/yellow_euro.svg", activeIcon: "/euro.svg", width: 23, height: 24 },
];

export default function ServicesFilterSidebar({
  className = "",
  categories,
  selectedSubcategories,
  onToggleSubcategory,
  selectedCurrency,
  onCurrencyChange,
  initialMinPrice,
  initialMaxPrice,
  onApplyPrice,
  locationInput,
  onLocationInputChange,
  onApplyLocation,
  onSelectLocation,
}: ServicesFilterSidebarProps) {
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [minPriceInput, setMinPriceInput] = useState(String(initialMinPrice));
  const [maxPriceInput, setMaxPriceInput] = useState(String(initialMaxPrice));
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [isLocationFocused, setIsLocationFocused] = useState(false);

  useEffect(() => {
    const query = locationInput.trim();
    if (!query) {
      setLocationSuggestions([]);
      return;
    }

    let ignore = false;
    const timeout = setTimeout(async () => {
      try {
        const results = await publicServicesAPI.locations(query);
        if (!ignore) setLocationSuggestions(results);
      } catch {
        if (!ignore) setLocationSuggestions([]);
      }
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(timeout);
    };
  }, [locationInput]);

  const selectLocation = (city: string) => {
    setLocationSuggestions([]);
    onSelectLocation(city);
  };

  useEffect(() => {
    setMinPrice(initialMinPrice);
    setMinPriceInput(String(initialMinPrice));
  }, [initialMinPrice]);

  useEffect(() => {
    setMaxPrice(initialMaxPrice);
    setMaxPriceInput(String(initialMaxPrice));
  }, [initialMaxPrice]);

  const updateMinPrice = (value: number) => {
    const next = Math.min(value, maxPrice);
    setMinPrice(next);
    setMinPriceInput(String(next));
  };

  const updateMaxPrice = (value: number) => {
    const next = Math.max(value, minPrice);
    setMaxPrice(next);
    setMaxPriceInput(String(next));
  };

  const applyPrice = () => {
    const parsedMin = minPriceInput === "" ? 0 : parseInt(minPriceInput, 10);
    const parsedMax = maxPriceInput === "" ? minPrice : parseInt(maxPriceInput, 10);
    const nextMin = Math.max(0, Math.min(parsedMin, MAX_PRICE));
    const nextMax = Math.max(nextMin, Math.min(parsedMax, MAX_PRICE));
    setMinPrice(nextMin);
    setMaxPrice(nextMax);
    onApplyPrice(nextMin, nextMax);
  };

  return (
    <div className={`flex flex-col w-full lg:w-[300px] flex-shrink-0 ${className}`}>
      <Unit title="Вартість" isLast={false}>
        <div className="flex flex-col gap-4 px-1 py-2">
          <div className="flex gap-2">
            {CURRENCIES.map((currency) => {
              const isSelected = selectedCurrency === currency.id;

              return (
                <button
                  key={currency.id}
                  type="button"
                  onClick={() => onCurrencyChange(isSelected ? null : currency.id)}
                  className={`flex-1 h-11 flex items-center justify-center transition-colors ${
                    isSelected ? "bg-[#FECC39]" : "bg-[#343434] hover:bg-[#3a3a3a]"
                  }`}
                >
                  <Image
                    src={isSelected ? currency.activeIcon : currency.defaultIcon}
                    alt={currency.id}
                    width={currency.width}
                    height={currency.height}
                  />
                </button>
              );
            })}
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="font-wix text-white text-sm mb-1 block">Від</label>
              <input
                type="text"
                inputMode="numeric"
                value={minPriceInput}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, "");
                  setMinPriceInput(rawValue);
                  if (rawValue === "") return;
                  updateMinPrice(Math.min(parseInt(rawValue, 10), MAX_PRICE));
                }}
                onBlur={applyPrice}
                className="font-wix w-full h-10 bg-[#343434] text-white px-3"
              />
            </div>
            <div className="flex-1">
              <label className="font-wix text-white text-sm mb-1 block">До</label>
              <input
                type="text"
                inputMode="numeric"
                value={maxPriceInput}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, "");
                  setMaxPriceInput(rawValue);
                  if (rawValue === "") return;
                  updateMaxPrice(Math.min(parseInt(rawValue, 10), MAX_PRICE));
                }}
                onBlur={applyPrice}
                className="font-wix w-full h-10 bg-[#343434] text-white px-3"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 relative h-8 mx-2">
              {/* Track background */}
              <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-[#272727] rounded-full" />

              {/* Active range */}
              <div
                className="absolute top-1/2 -translate-y-1/2 h-2 bg-[#FECC39] rounded-full pointer-events-none"
                style={{
                  left: `${(minPrice / MAX_PRICE) * 100}%`,
                  right: `${100 - (maxPrice / MAX_PRICE) * 100}%`,
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
                  if (value <= maxPrice) updateMinPrice(value);
                }}
                onMouseUp={applyPrice}
                onTouchEnd={applyPrice}
                className="absolute w-full h-full opacity-0 cursor-pointer range-slider"
                style={{
                  zIndex: 4,
                  clipPath: `inset(0 ${Math.max(0, 105 - (maxPrice / MAX_PRICE) * 100)}% 0 0)`,
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
                  if (value >= minPrice) updateMaxPrice(value);
                }}
                onMouseUp={applyPrice}
                onTouchEnd={applyPrice}
                className="absolute w-full h-full opacity-0 cursor-pointer range-slider"
                style={{
                  zIndex: 3,
                  clipPath: `inset(0 0 0 ${(minPrice / MAX_PRICE) * 100}%)`,
                }}
              />

              {/* Min handle */}
              <div
                className="absolute w-5 h-5 bg-[#FECC39] flex items-center justify-center pointer-events-none"
                style={{
                  left: `${(minPrice / MAX_PRICE) * 100}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 5,
                }}
              >
                <div className="w-2 h-2 bg-[#272727]" />
              </div>

              {/* Max handle */}
              <div
                className="absolute w-5 h-5 bg-[#FECC39] flex items-center justify-center pointer-events-none"
                style={{
                  left: `${(maxPrice / MAX_PRICE) * 100}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 5,
                }}
              >
                <div className="w-2 h-2 bg-[#272727]" />
              </div>
            </div>
            <button
              type="button"
              onClick={applyPrice}
              className="w-9 h-9 bg-[#FECC39] flex items-center justify-center hover:bg-white transition-colors flex-shrink-0"
              aria-label="Застосувати ціну"
            >
              <Image src="/grey_check.svg" alt="" width={14} height={14} />
            </button>
          </div>
        </div>
      </Unit>

      <Unit title="Місцезнаходження" isLast={false}>
        <div className="relative w-full">
          <div className="relative w-full h-[50px]">
            <input
              type="text"
              placeholder="Пошук"
              value={locationInput}
              onChange={(e) => onLocationInputChange(e.target.value)}
              onFocus={() => setIsLocationFocused(true)}
              onBlur={() => setIsLocationFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onApplyLocation();
              }}
              className="font-wix w-full h-full bg-[#343434] text-white placeholder-gray-400 px-4 pr-12"
            />
            <button
              type="button"
              onClick={onApplyLocation}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              aria-label="Search by location"
            >
              <Image src="/search.svg" alt="Search" width={20} height={20} />
            </button>
          </div>

          {isLocationFocused && locationSuggestions.length > 0 && (
            <div className="flex flex-col gap-px mt-px">
              {locationSuggestions.map((city) => {
                const query = locationInput.trim();
                const matchIndex = query ? city.toLowerCase().indexOf(query.toLowerCase()) : -1;
                const matched = matchIndex === 0 ? city.slice(0, query.length) : "";
                const rest = matchIndex === 0 ? city.slice(query.length) : city;

                return (
                  <button
                    key={city}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectLocation(city)}
                    className="w-full min-h-[50px] px-3 py-3 flex items-center justify-between gap-3 bg-[#343434] text-left transition-colors hover:bg-[#3a3a3a]"
                  >
                    <span className="text-sm font-bold">
                      <span className="text-[#FECC39]">{matched}</span>
                      <span className="text-white">{rest}</span>
                    </span>
                    <Image src="/yellow_plus.svg" alt="" width={16} height={16} className="flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </Unit>

      {categories.map((category, index) => {
        const isLast = index === categories.length - 1;
        return category.subcategories.length > 0 ? (
          <Unit key={category.slug} title={category.name} isLast={isLast}>
            {category.subcategories.map((sub) => (
              <CheckRow
                key={sub.slug}
                label={sub.name}
                count={sub.services_count}
                isSelected={selectedSubcategories.includes(sub.slug)}
                onToggle={() => onToggleSubcategory(sub.slug)}
              />
            ))}
          </Unit>
        ) : (
          <Unit key={category.slug} title={category.name} isLast={isLast} standalone>
            <CheckRow
              label="Показати"
              count={category.services_count}
              isSelected={selectedSubcategories.includes(category.slug)}
              onToggle={() => onToggleSubcategory(category.slug)}
            />
          </Unit>
        );
      })}
    </div>
  );
}

function Unit({
  title,
  children,
  isLast = false,
  standalone = false,
}: {
  title: string;
  children: ReactNode;
  isLast?: boolean;
  standalone?: boolean;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className={`pb-5 mb-5 ${isLast ? "" : "border-b border-[#343434]"}`}>
      <button
        type="button"
        onClick={() => (standalone ? undefined : setOpen((prev) => !prev))}
        className="w-full bg-[#343434] flex items-center justify-between px-3 py-3 mb-3 transition-colors hover:text-[#FECC39]"
      >
        <span className="font-bold text-sm text-white">{title}</span>
        {!standalone && (
          <Image
            src={open ? "/white_triangle_down.svg" : "/white_triangle_up.svg"}
            alt=""
            width={16}
            height={16}
          />
        )}
      </button>
      {(standalone || open) && <div className="flex flex-col gap-px">{children}</div>}
    </div>
  );
}

function CheckRow({
  label,
  count,
  isSelected,
  onToggle,
}: {
  label: string;
  count?: number;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isDisabled = !isSelected && !count;

  return (
    <button
      type="button"
      onClick={isDisabled ? undefined : onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isDisabled}
      className={`w-full h-11 px-3 flex items-center gap-3 text-left bg-[#343434] transition-colors ${
        isDisabled ? "opacity-40 cursor-not-allowed" : ""
      }`}
    >
      <div
        className={`w-5 h-5 flex items-center justify-center flex-shrink-0 transition-colors ${
          isSelected ? "bg-[#FECC39]" : "bg-[#414141]"
        }`}
      >
        <Image
          src={isHovered && !isSelected && !isDisabled ? "/yellow_check.svg" : "/grey_check.svg"}
          alt=""
          width={12}
          height={12}
        />
      </div>
      <span
        className={`text-sm font-bold transition-colors ${
          isSelected ? "text-[#FECC39]" : isHovered && !isDisabled ? "text-[#FECC39]" : "text-white"
        }`}
      >
        {label}
        {typeof count === "number" && count > 0 ? ` (${count})` : ""}
      </span>
    </button>
  );
}
