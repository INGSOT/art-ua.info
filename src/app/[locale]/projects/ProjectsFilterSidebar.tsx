"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ProjectsFilterOption, ProjectsFilterParameter } from "../../../lib/api/projects";

interface ProjectsFilterSidebarProps {
    className?: string;
    statuses: ProjectsFilterOption[];
    selectedStatuses: string[];
    onToggleStatus: (slug: string) => void;
    parameters: ProjectsFilterParameter[];
    selectedParameterValueIds: string[];
    onToggleParameterValue: (id: number) => void;
}

// Порт бічної панелі save-art (SidePanelProjectsPage.jsx): статуси + характеристики
// обраної підкатегорії. Підкатегорії тут не дублюються — ними керують таби зверху сторінки.
export default function ProjectsFilterSidebar({
    className = "",
    statuses,
    selectedStatuses,
    onToggleStatus,
    parameters,
    selectedParameterValueIds,
    onToggleParameterValue,
}: ProjectsFilterSidebarProps) {
    const t = useTranslations("Projects.filters");
    // save-art приховує статус "Продані" на сторінці проєктів.
    const visibleStatuses = statuses.filter((status) => status.slug !== "sold");

    return (
        <div className={`flex flex-col w-full lg:w-[300px] flex-shrink-0 ${className}`}>
            <Unit title={t("statusTitle")}>
                {visibleStatuses.map((status) => (
                    <CheckRow
                        key={status.slug}
                        label={status.name}
                        count={status.projects_count}
                        isSelected={selectedStatuses.includes(status.slug)}
                        onToggle={() => onToggleStatus(status.slug)}
                    />
                ))}
            </Unit>

            {!!parameters.length && (
                <Unit title={t("parametersTitle")} isLast>
                    {parameters.map((parameter) => (
                        <div key={parameter.id} className="flex flex-col gap-px mb-3 last:mb-0">
                            <p className="text-[#FECC39] text-sm mb-2">{parameter.name}</p>
                            {parameter.values.map((value) => (
                                <CheckRow
                                    key={value.id}
                                    label={value.value}
                                    count={value.projects_count}
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
    const isDisabled = !isSelected && !count;

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
