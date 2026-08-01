"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { useSearchParams } from "next/navigation";
import Header from "../../../components/Header";
import LatestNews from "../../../components/LatestNews";
import JoinCommunityWrapper from "../../../components/JoinCommunityWrapper";
import SearchSection from "../../../components/SearchSection";
import SelectedFiltersBar from "../../../components/filters/SelectedFiltersBar";
import FiltersButton from "../../../components/filters/FiltersButton";
import { FilterChip } from "../../../components/filters/filterChipUtils";
import ListOfProjects from "./ListOfProjects";
import ProjectsFilterSidebar from "./ProjectsFilterSidebar";
import PaginationSection from "../../../components/PaginationSection";
import Image from "next/image";
import {
    projectsAPI,
    type ProjectListCardItem,
    type ProjectsListFilters,
} from "../../../lib/api/projects";

const ITEMS_PER_PAGE = 12;

function getDefaultFilters(t: (key: string) => string): ProjectsListFilters {
    return {
        sort_options: [
            { slug: "date", name: t("sortByDate") },
            { slug: "name", name: t("sortByName") },
        ],
        categories: [],
        statuses: [],
        parameters: [],
    };
}

export default function ProjectsPage() {
    const t = useTranslations("Projects.list");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const searchQueryParam = searchParams.get("search") ?? "";
    const artCategoryParam = searchParams.get("art_category") ?? "";
    const subcategoryParam = searchParams.get("art_subcategory") ?? "";
    const selectedSubcategories = subcategoryParam ? subcategoryParam.split(",").filter(Boolean) : [];
    const statusParam = searchParams.get("status") ?? "";
    const selectedStatuses = statusParam ? statusParam.split(",").filter(Boolean) : [];
    const parameterValueParam = searchParams.get("parameter_value_id") ?? "";
    const selectedParameterValueIds = parameterValueParam ? parameterValueParam.split(",").filter(Boolean) : [];
    const sortBy = searchParams.get("sort_by") ?? "date";
    const currentPage = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

    const [searchInput, setSearchInput] = useState(searchQueryParam);
    const [projects, setProjects] = useState<ProjectListCardItem[]>([]);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: ITEMS_PER_PAGE, total: 0 });
    const [filtersData, setFiltersData] = useState<ProjectsListFilters>(() => getDefaultFilters(t));
    const [loading, setLoading] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        setSearchInput(searchQueryParam);
    }, [searchQueryParam]);

    useEffect(() => {
        let ignore = false;

        const fetchProjects = async () => {
            setLoading(true);
            try {
                const result = await projectsAPI.browse({
                    page: currentPage,
                    per_page: ITEMS_PER_PAGE,
                    ...(artCategoryParam ? { art_category: artCategoryParam } : {}),
                    ...(selectedSubcategories.length ? { art_subcategory: selectedSubcategories.join(",") } : {}),
                    ...(selectedStatuses.length ? { status: selectedStatuses.join(",") } : {}),
                    ...(selectedParameterValueIds.length
                        ? { parameter_value_id: selectedParameterValueIds.join(",") }
                        : {}),
                    ...(sortBy ? { sort_by: sortBy } : {}),
                    ...(searchQueryParam ? { search: searchQueryParam } : {}),
                });

                if (ignore) return;
                setProjects(result.data);
                setMeta(result.meta);
                setFiltersData(result.filters);
            } catch (error) {
                if (ignore) return;
                console.error("Failed to load projects:", error);
                setProjects([]);
            } finally {
                if (!ignore) {
                    setLoading(false);
                    setHasLoaded(true);
                }
            }
        };

        fetchProjects();
        return () => {
            ignore = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentPage,
        artCategoryParam,
        subcategoryParam,
        statusParam,
        parameterValueParam,
        sortBy,
        searchQueryParam,
    ]);

    const pushParams = (mutate: (params: URLSearchParams) => void, resetPage = true) => {
        const params = new URLSearchParams(searchParams.toString());
        mutate(params);
        if (resetPage) {
            params.delete("page");
        }
        const search = params.toString();
        router.push(search ? `${pathname}?${search}` : pathname, { scroll: false });
    };

    // Клік по батьківській категорії скидає підкатегорії й обрані параметри —
    // вони належать попередньому вибору і більше не актуальні.
    const handleCategoryClick = (slug: string | null) => {
        pushParams((params) => {
            if (slug) {
                params.set("art_category", slug);
            } else {
                params.delete("art_category");
            }
            params.delete("art_subcategory");
            params.delete("parameter_value_id");
        });
    };

    // Підкатегорії — мультивибір (чекбокси в бічній панелі й пілюлі зверху
    // керують тим самим станом), скидаємо обрані параметри при будь-якій зміні.
    const handleSubcategoryToggle = (slug: string) => {
        pushParams((params) => {
            const next = selectedSubcategories.includes(slug)
                ? selectedSubcategories.filter((s) => s !== slug)
                : [...selectedSubcategories, slug];
            if (next.length) {
                params.set("art_subcategory", next.join(","));
            } else {
                params.delete("art_subcategory");
            }
            params.delete("parameter_value_id");
        });
    };

    const handleParameterValueToggle = (valueId: number) => {
        pushParams((params) => {
            const id = String(valueId);
            const next = selectedParameterValueIds.includes(id)
                ? selectedParameterValueIds.filter((v) => v !== id)
                : [...selectedParameterValueIds, id];
            if (next.length) {
                params.set("parameter_value_id", next.join(","));
            } else {
                params.delete("parameter_value_id");
            }
        });
    };

    const handleStatusToggle = (slug: string) => {
        pushParams((params) => {
            const next = selectedStatuses.includes(slug)
                ? selectedStatuses.filter((s) => s !== slug)
                : [...selectedStatuses, slug];
            if (next.length) {
                params.set("status", next.join(","));
            } else {
                params.delete("status");
            }
        });
    };

    const handleSortSelect = (slug: string) => {
        setIsSortOpen(false);
        pushParams((params) => {
            params.set("sort_by", slug);
        }, false);
    };

    const handlePageChange = (page: number) => {
        pushParams((params) => {
            if (page > 1) {
                params.set("page", String(page));
            } else {
                params.delete("page");
            }
        }, false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSearch = () => {
        pushParams((params) => {
            const trimmed = searchInput.trim();
            if (trimmed) {
                params.set("search", trimmed);
            } else {
                params.delete("search");
            }
        });
    };

    const handleClearSearch = () => {
        setSearchInput("");
        pushParams((params) => {
            params.delete("search");
        });
    };

    const handleClearAllFilters = () => {
        pushParams((params) => {
            params.delete("art_category");
            params.delete("art_subcategory");
            params.delete("parameter_value_id");
            params.delete("status");
        });
    };

    const activeCategory = filtersData.categories.find((c) => c.slug === artCategoryParam);
    const categoryNameMap = Object.fromEntries(filtersData.categories.map((c) => [c.slug, c.name]));
    const subcategoryNameMap = Object.fromEntries(
        filtersData.categories.flatMap((c) => c.subcategories.map((s) => [s.slug, s.name]))
    );
    const statusNameMap = Object.fromEntries(filtersData.statuses.map((s) => [s.slug, s.name]));
    const parameterValueNameMap = Object.fromEntries(
        filtersData.parameters.flatMap((p) => p.values.map((v) => [String(v.id), v.value]))
    );

    const selectedFilterChips: FilterChip[] = [
        ...(artCategoryParam
            ? [{ id: `art_category:${artCategoryParam}`, label: categoryNameMap[artCategoryParam] ?? artCategoryParam }]
            : []),
        ...selectedSubcategories.map((slug) => ({
            id: `art_subcategory:${slug}`,
            label: subcategoryNameMap[slug] ?? slug,
        })),
        ...selectedStatuses.map((slug) => ({
            id: `status:${slug}`,
            label: statusNameMap[slug] ?? slug,
        })),
        ...selectedParameterValueIds.map((id) => ({
            id: `parameter_value_id:${id}`,
            label: parameterValueNameMap[id] ?? id,
        })),
    ];

    const handleRemoveFilterChip = (chipId: string) => {
        if (chipId.startsWith("art_category:")) {
            handleCategoryClick(null);
            return;
        }
        if (chipId.startsWith("art_subcategory:")) {
            handleSubcategoryToggle(chipId.slice("art_subcategory:".length));
            return;
        }
        if (chipId.startsWith("status:")) {
            handleStatusToggle(chipId.slice("status:".length));
            return;
        }
        if (chipId.startsWith("parameter_value_id:")) {
            handleParameterValueToggle(Number(chipId.slice("parameter_value_id:".length)));
        }
    };

    const normalizedSearchQuery = searchQueryParam.trim();
    const noSearchResults = hasLoaded && !loading && normalizedSearchQuery && projects.length === 0;
    const sortOptions = filtersData.sort_options;
    const activeSortOption = sortOptions.find((option) => option.slug === sortBy) ?? sortOptions[0];

    const sidebar = (
        <ProjectsFilterSidebar
            statuses={filtersData.statuses}
            selectedStatuses={selectedStatuses}
            onToggleStatus={handleStatusToggle}
            parameters={filtersData.parameters}
            selectedParameterValueIds={selectedParameterValueIds}
            onToggleParameterValue={handleParameterValueToggle}
        />
    );

    const sortDropdown = (
        <div className="relative w-full">
            <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-[#343434] font-bold text-sm bg-[#FECC39] hover:bg-white transition-colors"
            >
                {activeSortOption?.name}
                <Image
                    src="/black_triangle_down.svg"
                    alt=""
                    width={12}
                    height={8}
                    className={`w-3 h-2 flex-shrink-0 transition-transform ${isSortOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isSortOpen && (
                <div className="absolute top-full right-0 lg:left-0 lg:right-auto w-full z-50 mt-px flex flex-col gap-px">
                    {sortOptions.map((option) => (
                        <button
                            key={option.slug}
                            onClick={() => handleSortSelect(option.slug)}
                            className={`block w-full text-left px-3 py-3 font-bold text-sm whitespace-nowrap transition-colors bg-[#343434] ${
                                sortBy === option.slug ? "text-[#FECC39]" : "text-white hover:text-[#FECC39]"
                            }`}
                        >
                            {option.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <>
            <Header isHomePage={false} />
            <SearchSection value={searchInput} onChange={setSearchInput} onSearch={handleSearch} />

            {normalizedSearchQuery && (
                <div className="bg-[#414141] flex flex-col items-center justify-center pt-4 pb-6 px-4">
                    <p className="text-white text-center font-wix text-[18px] leading-[24px]">
                        {t("searchResultsLabel")}
                    </p>
                </div>
            )}
            {noSearchResults && (
                <div className="bg-[#414141] flex flex-col items-center justify-center pb-8 px-4">
                    <button
                        type="button"
                        onClick={handleClearSearch}
                        className="mb-6 flex items-center justify-center"
                    >
                        <img src="/yellow_cross.svg" alt={t("clearSearchAlt")} className="w-8 h-8 md:w-9 md:h-9" />
                    </button>
                    <h2 className="mt-2 text-white text-xl md:text-3xl font-bold text-center max-w-[800px]">
                        {t("noResults")}
                    </h2>
                </div>
            )}

            {!noSearchResults && (
                <>
                    <section className="w-full bg-[#414141] py-8 px-4 sm:px-6 md:px-10 lg:px-20">
                        {/* Категорії мистецтва зверху сторінки — горизонтальний скрол на всіх шириноах,
                            без переносу на новий рядок (як .category_tabs у save-art, тільки без
                            wrap на десктопі). */}
                        <div className="flex flex-nowrap gap-2 mb-3 overflow-x-auto scrollbar-hide">
                            <button
                                type="button"
                                onClick={() => handleCategoryClick(null)}
                                className={`px-5 py-3 font-bold text-[13px] leading-[18px] whitespace-nowrap transition-colors ${
                                    !artCategoryParam
                                        ? "bg-[#FECC39] text-[#272727]"
                                        : "bg-[#343434] text-[#FECC39] hover:bg-[#2a2a2a]"
                                }`}
                            >
                                {t("allCategories")}
                            </button>
                            {filtersData.categories.map((category) => (
                                <button
                                    key={category.slug}
                                    type="button"
                                    onClick={() => handleCategoryClick(category.slug)}
                                    className={`px-5 py-3 font-bold text-[13px] leading-[18px] whitespace-nowrap transition-colors ${
                                        artCategoryParam === category.slug
                                            ? "bg-[#FECC39] text-[#272727]"
                                            : "bg-[#343434] text-[#FECC39] hover:bg-[#2a2a2a]"
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        {/* Підкатегорії обраної категорії — той самий стан, що й чекбокси в сайдбарі */}
                        {!!activeCategory?.subcategories.length && (
                            <div className="flex flex-nowrap gap-x-5 gap-y-2 mb-5 overflow-x-auto scrollbar-hide">
                                {activeCategory.subcategories.map((sub) => (
                                    <button
                                        key={sub.slug}
                                        type="button"
                                        onClick={() => handleSubcategoryToggle(sub.slug)}
                                        className={`font-wix text-sm leading-5 transition-colors ${
                                            selectedSubcategories.includes(sub.slug)
                                                ? "text-[#FECC39]"
                                                : "text-white hover:text-[#FECC39]"
                                        }`}
                                    >
                                        {sub.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Фільтри/сортування + чіпи — липкий (sticky) блок, як .active_filters
                            у save-art: лишається на екрані під час скролу і на мобілці, і на
                            десктопі (там .top/.active_filters мають position: sticky; top: 0). */}
                        <div className="sticky top-0 z-40 bg-[#414141] py-2 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-10 md:px-10 lg:-mx-20 lg:px-20 mb-4 lg:mb-6">
                            <div className="flex items-center justify-between gap-1 md:gap-2 mb-3 lg:hidden">
                                <FiltersButton
                                    className="lg:hidden"
                                    onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
                                    isActive={isMobileFiltersOpen}
                                    selectedCount={selectedFilterChips.length}
                                />
                                <div className="relative ml-auto min-w-0 flex-1 max-w-[220px] sm:max-w-[260px]">
                                    {sortDropdown}
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                <div className="min-w-0">
                                    <SelectedFiltersBar
                                        chips={selectedFilterChips}
                                        onRemove={handleRemoveFilterChip}
                                        onClearAll={handleClearAllFilters}
                                    />
                                </div>
                                <div className="hidden lg:block relative lg:w-[260px] lg:flex-shrink-0">
                                    {sortDropdown}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="hidden lg:block">{sidebar}</div>

                            <div className="flex-1 w-full min-w-0">
                                {isMobileFiltersOpen && <div className="lg:hidden mb-6">{sidebar}</div>}

                                {loading && !hasLoaded ? (
                                    <div className="w-full min-h-[420px] flex items-center justify-center">
                                        <p className="font-wix text-white text-lg md:text-2xl">{t("loading")}</p>
                                    </div>
                                ) : (
                                    <ListOfProjects projects={projects} disableInteractions={isSortOpen} />
                                )}
                            </div>
                        </div>
                    </section>
                    {meta.last_page > 1 && (
                        <PaginationSection
                            currentPage={meta.current_page}
                            totalPages={meta.last_page}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
            <LatestNews />
            <JoinCommunityWrapper />
        </>
    );
}
