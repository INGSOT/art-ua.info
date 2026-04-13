"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuthorProfile } from "../../AuthorProfileContext";
import Message from "../../../../components/Message";

export default function OrderForm() {
    const { serviceDetailsData, id: authorProfileId } = useAuthorProfile();
    const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});
    const [hoveredOptions, setHoveredOptions] = useState<Record<string, boolean>>({});
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [formValues, setFormValues] = useState<Record<string, string>>({});
    const [notification, setNotification] = useState<{ type: "error" | "success"; text: string } | null>(null);

    useEffect(() => {
        setSelectedOptions({});
        setFormValues({});
        setNotification(null);
    }, [authorProfileId]);

    const toggleOption = (id: string) => {
        setSelectedOptions(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const setHovered = (id: string, hovered: boolean) => {
        setHoveredOptions(prev => ({ ...prev, [id]: hovered }));
    };

    const handleInputChange = (id: string, value: string) => {
        setFormValues(prev => ({ ...prev, [id]: value }));
    };

    const validateForm = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset previous notification
        setNotification(null);

        // Check if at least one option is selected
        const hasSelectedOption = Object.values(selectedOptions).some(value => value);
        if (!hasSelectedOption) {
            setNotification({ type: "error", text: "Оберіть опцію" });
            return;
        }

        // Check if all fields are filled
        const allFieldsFilled = serviceDetailsData.formFields.every(
            field => formValues[field.id]?.trim()
        );
        if (!allFieldsFilled) {
            setNotification({ type: "error", text: "Заповніть всі поля форми" });
            return;
        }

        // Validate name field (no digits)
        const nameField = formValues["name"];
        if (nameField && /\d/.test(nameField)) {
            setNotification({ type: "error", text: "Ім'я не має містити цифр" });
            return;
        }

        // Validate email field (must contain @)
        const emailField = formValues["email"];
        if (emailField && !emailField.includes("@")) {
            setNotification({ type: "error", text: "Електронна пошта повинна містити символ @" });
            return;
        }

        // Validate phone field (only digits)
        const phoneField = formValues["phone"];
        if (phoneField && !/^\d+$/.test(phoneField)) {
            setNotification({ type: "error", text: "Телефон повинен містити тільки цифри" });
            return;
        }

        // If all validations pass, submit form to server
        try {
            // В fetch нужно ввести URL, который будет обрабатывать запрос формы на сервере
            const response = await fetch('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    selectedOptions,
                    formValues,
                }),
            });

            if (response.ok) {
                setNotification({ type: "success", text: "Запит надіслано" });
                setSelectedOptions({});
                setFormValues({});
                console.log("Form submitted successfully");
            } else {
                setNotification({ type: "error", text: "Помилка при надіслані запиту" });
                console.error("Form submission failed with status:", response.status);
            }
        } catch (error) {
            setNotification({ type: "error", text: "Помилка при надіслані запиту" });
            console.error("Form submission error:", error);
        }
    };

    return (
        <div className="w-full bg-[#414141] p-8 lg:p-12">
            {notification && (
                <Message
                    type={notification.type}
                    message={notification.text}
                    onClose={() => setNotification(null)}
                />
            )}
            <form onSubmit={validateForm}>
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
                            type="button"
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
                        <label className="font-wix text-white text-sm">{field.label}</label>
                        {field.type === "textarea" ? (
                            <textarea
                                placeholder={field.placeholder}
                                rows={field.rows || 5}
                                value={formValues[field.id] || ""}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                className="font-wix w-full bg-[#343434] text-white px-4 py-3 placeholder:text-[#4a4a4a] resize-none"
                            />
                        ) : (
                            <input
                                type={field.type}
                                placeholder={field.placeholder}
                                value={formValues[field.id] || ""}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                className="font-wix w-full h-[50px] bg-[#343434] text-white px-4 placeholder:text-[#4a4a4a]"
                            />
                        )}
                    </div>
                ))}

                {/* Submit Button */}
                <button
                    type="submit"
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
            </form>
        </div>
    );
}
