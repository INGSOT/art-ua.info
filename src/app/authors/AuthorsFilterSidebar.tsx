"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import type { AuthorsFilterParameter } from "../../lib/api/authorProfiles";

export type ParticipantFilter = "artist" | "organization" | "team" | "all";

const PARTICIPANT_OPTIONS: { id: ParticipantFilter; label: string }[] = [
    { id: "all", label: "Усі" },
    { id: "artist", label: "Митці" },
    { id: "organization", label: "Організації" },
    { id: "team", label: "Команди" },
];

interface AuthorsFilterSidebarProps {
    className?: string;
    participant: ParticipantFilter;
    onParticipantChange: (participant: ParticipantFilter) => void;
    parameters: AuthorsFilterParameter[];
    selectedParameterValueIds: string[];
    onToggleParameterValue: (id: number) => void;
}

// Лівий сайдбар /authors: учасники платформи (одиничний вибір) + характеристики
// проєктів обраної галузі мистецтва (мультивибір), за зразком ProjectsFilterSidebar.
export default function AuthorsFilterSidebar({
    className = "",
    participant,
    onParticipantChange,
    parameters,
    selectedParameterValueIds,
    onToggleParameterValue,
}: AuthorsFilterSidebarProps) {
    return (
        <div className={`flex flex-col w-full lg:w-[300px] flex-shrink-0 ${className}`}>
            <Unit title="Учасники платформи" isLast={!parameters.length}>
                {PARTICIPANT_OPTIONS.map((option) => (
                    <CheckRow
                        key={option.id}
                        label={option.label}
                        isSelected={participant === option.id}
                        onToggle={() => onParticipantChange(option.id)}
                    />
                ))}
            </Unit>

            {!!parameters.length && (
                <Unit title="Параметри" isLast>
                    {parameters.map((parameter) => (
                        <div key={parameter.id} className="flex flex-col gap-px mb-3 last:mb-0">
                            <p className="text-[#FECC39] text-sm mb-2">{parameter.name}</p>
                            {parameter.values.map((value) => (
                                <CheckRow
                                    key={value.id}
                                    label={value.value}
                                    count={value.authors_count}
                                    isSelected={selectedParameterValueIds.includes(String(value.id))}
                                    onToggle={() => onToggleParameterValue(value.id)}
                                />
                            ))}
                        </div>
                    ))}
                </Unit>
            )}
        </div>
    );
}

function Unit({ title, children, isLast = false }: { title: string; children: ReactNode; isLast?: boolean }) {
    const [open, setOpen] = useState(true);

    return (
        <div className={`pb-5 mb-5 ${isLast ? "" : "border-b border-[#343434]"}`}>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="w-full bg-[#343434] flex items-center justify-between px-3 py-3 mb-3 transition-colors hover:text-[#FECC39]"
            >
                <span className="font-bold text-sm text-white">{title}</span>
                <Image
                    src={open ? "/white_triangle_down.svg" : "/white_triangle_up.svg"}
                    alt=""
                    width={16}
                    height={16}
                />
            </button>
            {open && <div className="flex flex-col gap-px">{children}</div>}
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
    const isDisabled = typeof count === "number" && !isSelected && !count;

    return (
        <button
            type="button"
            onClick={isDisabled ? undefined : onToggle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={isDisabled}
            className={`w-full h-11 px-3 flex items-center gap-3 text-left bg-[#343434] transition-colors ${
                isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
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
