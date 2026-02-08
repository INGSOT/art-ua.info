"use client";

import { useState } from "react";
import Image from "next/image";

export default function OrderForm() {
    const [option1, setOption1] = useState(false);
    const [option2, setOption2] = useState(false);
    const [isHovered1, setIsHovered1] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);

    return (
        <div className="w-full bg-[#414141] p-8 lg:p-12">
            {/* Title */}
            <h2 className="text-white font-bold text-2xl mb-6">Замовлення</h2>

            {/* Options with Checkmarks */}
            <div className="flex flex-col gap-4 mb-6">
                {/* Option 1 */}
                <button
                    onClick={() => setOption1(!option1)}
                    onMouseEnter={() => setIsHovered1(true)}
                    onMouseLeave={() => setIsHovered1(false)}
                    className="w-full h-[50px] bg-[#343434] flex items-center gap-3 px-4 cursor-pointer transition-colors"
                >
                    {/* Checkmark */}
                    <div
                        className={`w-5 h-5 flex items-center justify-center transition-colors ${
                            option1 ? 'bg-[#FFD700]' : 'bg-[#414141]'
                        }`}
                    >
                        <Image
                            src={isHovered1 && !option1 ? '/yellow_check.svg' : '/grey_check.svg'}
                            alt="check"
                            width={12}
                            height={12}
                        />
                    </div>

                    {/* Label */}
                    <span className={`flex-1 text-left font-bold text-base transition-colors ${
                        option1 || isHovered1 ? 'text-[#FFD700]' : 'text-white'
                    }`}>
                        Опція
                    </span>
                </button>

                {/* Option 2 */}
                <button
                    onClick={() => setOption2(!option2)}
                    onMouseEnter={() => setIsHovered2(true)}
                    onMouseLeave={() => setIsHovered2(false)}
                    className="w-full h-[50px] bg-[#343434] flex items-center gap-3 px-4 cursor-pointer transition-colors"
                >
                    {/* Checkmark */}
                    <div
                        className={`w-5 h-5 flex items-center justify-center transition-colors ${
                            option2 ? 'bg-[#FFD700]' : 'bg-[#414141]'
                        }`}
                    >
                        <Image
                            src={isHovered2 && !option2 ? '/yellow_check.svg' : '/grey_check.svg'}
                            alt="check"
                            width={12}
                            height={12}
                        />
                    </div>

                    {/* Label */}
                    <span className={`flex-1 text-left font-bold text-base transition-colors ${
                        option2 || isHovered2 ? 'text-[#FFD700]' : 'text-white'
                    }`}>
                        Ще одна опція
                    </span>
                </button>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-6">
                {/* Name Field */}
                <div className="flex flex-col gap-2">
                    <label className="text-white text-sm">Як до вас звертатись</label>
                    <input
                        type="text"
                        placeholder="Ваше ім'я та прізвище"
                        className="w-full h-[50px] bg-[#343434] text-white px-4 placeholder:text-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                    />
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-2">
                    <label className="text-white text-sm">Електронна пошта</label>
                    <input
                        type="email"
                        placeholder="Вкажіть адресу електронної пошти"
                        className="w-full h-[50px] bg-[#343434] text-white px-4 placeholder:text-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                    />
                </div>

                {/* Phone Field */}
                <div className="flex flex-col gap-2">
                    <label className="text-white text-sm">Телефон</label>
                    <input
                        type="tel"
                        placeholder="Вкажіть номер телефону"
                        className="w-full h-[50px] bg-[#343434] text-white px-4 placeholder:text-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                    />
                </div>

                {/* Message Field */}
                <div className="flex flex-col gap-2">
                    <label className="text-white text-sm">Повідомлення</label>
                    <textarea
                        placeholder="Ваше повідомлення"
                        rows={5}
                        className="w-full bg-[#343434] text-white px-4 py-3 placeholder:text-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#FFD700] resize-none"
                    />
                </div>

                {/* Submit Button */}
                <button
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => setIsButtonHovered(false)}
                    className={`w-full h-[60px] flex items-stretch transition-colors overflow-hidden ${
                        isButtonHovered ? 'bg-white' : 'bg-[#FECC39]'
                    }`}
                >
                    <span className="flex items-center justify-center flex-1 px-6 font-bold text-[#343434]">
                        Відправити запит
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
