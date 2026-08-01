"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { useSearchParams } from "next/navigation";
import Header from "../../../components/Header";
import LatestNews from "../../../components/LatestNews";
import JoinCommunityWrapper from "../../../components/JoinCommunityWrapper";
import SearchSection from "../../../components/SearchSection";
import SelectedFiltersBar from "../../../components/filters/SelectedFiltersBar";
import FiltersButton from "../../../components/filters/FiltersButton";
import { FilterChip } from "../../../components/filters/filterChipUtils";
import ListOfCatalogs from "./ListOfCatalogs";
import CatalogsFilterSidebar from "./CatalogsFilterSidebar";
import PaginationSection from "../../../components/PaginationSection";
import Image from "next/image";
import {
    publicCatalogsAPI,
    type PublicCatalog,
    type CatalogsListFilters,
} from "../../../lib/api/publicCatalogs";
import { localeToApiLanguage, type Locale } from "../../../i18n/routing";

const ITEMS_PER_PAGE = 10;

const SORT_SLUGS = ["likes", "date_desc", "date_asc"] as const;
type SortSlug = (typeof SORT_SLUGS)[number];

function sortParamsFor(sortSlug: string): { sort_by: string; sort_dir: string } {
    if (sortSlug === "date_asc") return { sort_by: "date", sort_dir: "asc" };
    if (sortSlug === "date_desc") return { sort_by: "date", sort_dir: "desc" };
    return { sort_by: "likes", sort_dir: "desc" };
}

const DEFAULT_FILTERS: CatalogsListFilters = { categories: [] };

export default function CatalogsPage() {
    const t = useTranslations("Catalogs.list");
    const locale = useLocale() as Locale;
    const language = localeToApiLanguage(locale);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const SORT_OPTIONS = [
        { slug: "likes" as const, name: t("sortPopular") },
        { slug: "date_desc" as const, name: t("sortNewest") },
        { slug: "date_asc" as const, name: t("sortOldest") },
    ];

    const searchQueryParam = searchParams.get("search") ?? "";
    const subcategoryParam = searchParams.get("art_subcategory") ?? "";
    const selectedSubcategories = subcategoryParam ? subcategoryParam.split(",").filter(Boolean) : [];
    const sortSlug = (searchParams.get("sort") ?? "likes") as SortSlug;
    const currentPage = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

    const [searchInput, setSearchInput] = useState(searchQueryParam);
    const [catalogs, setCatalogs] = useState<PublicCatalog[]>([]);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: ITEMS_PER_PAGE, total: 0 });
    const [filtersData, setFiltersData] = useState<CatalogsListFilters>(DEFAULT_FILTERS);
    const [loading, setLoading] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        setSearchInput(searchQueryParam);
    }, [searchQueryParam]);

    useEffect(() => {
        let ignore = false;

        const fetchCatalogs = async () => {
            setLoading(true);
            try {
                const { sort_by, sort_dir } = sortParamsFor(sortSlug);
                const result = await publicCatalogsAPI.browse(language, {
                    page: currentPage,
                    per_page: ITEMS_PER_PAGE,
                    ...(selectedSubcategories.length ? { art_subcategory: selectedSubcategories.join(",") } : {}),
                    sort_by,
                    sort_dir,
                    ...(searchQueryParam ? { search: searchQueryParam } : {}),
                });

                if (ignore) return;
                setCatalogs(result.data);
                setMeta(result.meta);
                setFiltersData(result.filters);
            } catch (error) {
                if (ignore) return;
                console.error("Failed to load catalogs:", error);
                setCatalogs([]);
            } finally {
                if (!ignore) {
                    setLoading(false);
                    setHasLoaded(true);
                }
            }
        };

        fetchCatalogs();
        return () => {
            ignore = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, subcategoryParam, sortSlug, searchQueryParam, language]);

    const pushParams = (mutate: (params: URLSearchParams) => void, resetPage = true) => {
        const params = new URLSearchParams(searchParams.toString());
        mutate(params);
        if (resetPage) {
            params.delete("page");
        }
        const search = params.toString();
        router.push(search ? `${pathname}?${search}` : pathname, { scroll: false });
    };

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
        });
    };

    const handleSortSelect = (slug: SortSlug) => {
        setIsSortOpen(false);
        pushParams((params) => {
            params.set("sort", slug);
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
            params.delete("art_subcategory");
        });
    };

    const subcategoryNameMap = Object.fromEntries(
        filtersData.categories.flatMap((c) =>
            c.subcategories.length ? c.subcategories.map((s) => [s.slug, s.name]) : [[c.slug, c.name]]
        )
    );

    const selectedFilterChips: FilterChip[] = selectedSubcategories.map((slug) => ({
        id: slug,
        label: subcategoryNameMap[slug] ?? slug,
    }));

    const handleRemoveFilterChip = (chipId: string) => {
        handleSubcategoryToggle(chipId);
    };

    const normalizedSearchQuery = searchQueryParam.trim();
    const noSearchResults = hasLoaded && !loading && normalizedSearchQuery && catalogs.length === 0;
    const activeSortOption = SORT_OPTIONS.find((option) => option.slug === sortSlug) ?? SORT_OPTIONS[0];

    const sidebar = (
        <CatalogsFilterSidebar
            categories={filtersData.categories}
            selectedSubcategories={selectedSubcategories}
            onToggleSubcategory={handleSubcategoryToggle}
        />
    );

    const sortDropdown = (
        <div className="relative w-full">
            <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-[#343434] font-bold text-sm bg-[#FECC39] hover:bg-white transition-colors"
            >
                {activeSortOption.name}
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
                    {SORT_OPTIONS.map((option) => (
                        <button
                            key={option.slug}
                            onClick={() => handleSortSelect(option.slug)}
                            className={`block w-full text-left px-3 py-3 font-bold text-sm whitespace-nowrap transition-colors bg-[#343434] ${
                                sortSlug === option.slug ? "text-[#FECC39]" : "text-white hover:text-[#FECC39]"
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
                        {t("searchResult")}
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
                        <img src="/yellow_cross.svg" alt={t("clearSearch")} className="w-8 h-8 md:w-9 md:h-9" />
                    </button>
                    <h2 className="mt-2 text-white text-xl md:text-3xl font-bold text-center max-w-[800px]">
                        {t("noSearchResults")}
                    </h2>
                </div>
            )}

            {!noSearchResults && (
                <>
                    <section className="w-full bg-[#414141] py-8 px-4 sm:px-6 md:px-10 lg:px-20">
                        <div className="mb-6 md:mb-8">
                            <p className="text-[#FECC39] text-sm font-bold mb-2">{t("tagline")}</p>
                            <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-[40px] leading-tight max-w-[600px] whitespace-normal md:whitespace-nowrap" style={{ fontWeight: 600 }}>
                                {t("title")}
                            </h1>
                        </div>

                        {/* Фільтри/сортування + чіпи — липкий (sticky) блок, як на сторінці проєктів:
                            лишається на екрані під час скролу і на мобілці, і на десктопі. */}
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
                                    <ListOfCatalogs catalogs={catalogs} disableInteractions={isSortOpen} />
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
