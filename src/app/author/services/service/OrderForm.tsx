"use client";

import { useState } from "react";
import Image from "next/image";
import { serviceDetailsData } from "../../../../data/authorData";

export default function OrderForm() {
    const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});
    const [hoveredOptions, setHoveredOptions] = useState<Record<string, boolean>>({});
    const [isButtonHovered, setIsButtonHovered] = useState(false);

    const toggleOption = (id: string) => {
        setSelectedOptions(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const setHovered = (id: string, hovered: boolean) => {
        setHoveredOptions(prev => ({ ...prev, [id]: hovered }));
    };

    return (
        <div className="w-full bg-[#414141] p-8 lg:p-12">
            {/* Title */}
            <h2 className="text-white font-bold text-2xl mb-6">Замовлення</h2>

            {/* Options with Checkmarks */}
            <div className="flex flex-col gap-4 mb-6">
                {serviceDetailsData.options.map((option) => {
                    const isSelected = selectedOptions[option.id];
                    const isHovered = hoveredOptions[option.id];
                    
                    return (
                        <button
                            key={option.id}
                            onClick={() => toggleOption(option.id)}
                            onMouseEnter={() => setHovered(option.id, true)}
                            onMouseLeave={() => setHovered(option.id, false)}
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
                                {option.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-6">
                {serviceDetailsData.formFields.map((field) => (
                    <div key={field.id} className="flex flex-col gap-2">
                        <label className="text-white text-sm">{field.label}</label>
                        {field.type === "textarea" ? (
                            <textarea
                                placeholder={field.placeholder}
                                rows={field.rows || 5}
                                className="w-full bg-[#343434] text-white px-4 py-3 placeholder:text-[#4a4a4a] resize-none"
                            />
                        ) : (
                            <input
                                type={field.type}
                                placeholder={field.placeholder}
                                className="w-full h-[50px] bg-[#343434] text-white px-4 placeholder:text-[#4a4a4a]"
                            />
                        )}
                    </div>
                ))}

                {/* Submit Button */}
                <button
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => setIsButtonHovered(false)}
                    className={`w-full h-[60px] flex items-stretch transition-colors overflow-hidden ${
                        isButtonHovered ? 'bg-white' : 'bg-[#FECC39]'
                    }`}
                >
                    <span className="flex items-center justify-center flex-1 px-6 font-bold text-[#343434]">
                        {serviceDetailsData.submitButtonLabel}
                    </span>
                    <div className="flex items-center justify-center w-[60px] border-l border-[#343434]">
                        <Image
                            src="/grey_triangle_right.svg"
                            alt="Arrow"
                            width={24}
                            height={24}
                        />
                    </div>
                </button>
            </div>
        </div>
    );
}
