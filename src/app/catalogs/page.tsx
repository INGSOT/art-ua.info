"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import LatestNews from "../../components/LatestNews";
import JoinCommunityWrapper from "../../components/JoinCommunityWrapper";
import SearchSection from "../../components/SearchSection";
import FilterSection from "../../components/filters/FilterSection";
import { catalogsFilters } from "../../components/filters/filterConfig";
import ListOfCatalogs from "./ListOfCatalogs";
import { catalogsData } from "../../data/catalogsData";
import PaginationSection from "../../components/PaginationSection";
import Image from "next/image";

const ITEMS_PER_PAGE = 10;

export default function CatalogsPage() {
    const [currentPage, setCurrentPage] = useState(1);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const searchQueryParam = searchParams.get("search") ?? "";

    const artFieldsSection = catalogsFilters.find((section) => section.id === "art-fields");
    const artItems =
        artFieldsSection?.subsections?.flatMap((sub) => sub.items ?? []) ?? [];

    const allowedArtCategoryIds = new Set(artItems.map((item) => item.id));
    const selectedArtCategoryIds = searchParams
        .getAll("art_subcategory")
        .filter((value) => allowedArtCategoryIds.has(value));

    const [searchInput, setSearchInput] = useState(searchQueryParam);

    useEffect(() => {
        setSearchInput(searchQueryParam);
    }, [searchQueryParam]);

    const initialSelectedFilters: Record<string, boolean> = Object.fromEntries(
        artItems.map((item) => [item.id, selectedArtCategoryIds.includes(item.id)])
    );

    const handleFilterChange = (filters: Record<string, boolean>) => {
        setCurrentPage(1);

        const selectedIds = artItems
            .map((item) => item.id)
            .filter((id) => !!filters[id]);

        const params = new URLSearchParams(searchParams.toString());
        params.delete("art_subcategory");

        selectedIds.forEach((id) => {
            params.append("art_subcategory", id);
        });

        const search = params.toString();
        router.push(search ? `${pathname}?${search}` : pathname, { scroll: false });
    };

    const normalizedSearchQuery = searchQueryParam.trim().toLowerCase();

    const filteredCatalogsByCategory = selectedArtCategoryIds.length
        ? catalogsData.filter((catalog) => selectedArtCategoryIds.includes(catalog.artCategory))
        : catalogsData;

    const filteredCatalogs = normalizedSearchQuery
        ? filteredCatalogsByCategory.filter((catalog) => {
            const titleMatch = catalog.title.toLowerCase().includes(normalizedSearchQuery);
            const authorMatch = catalog.authorName.toLowerCase().includes(normalizedSearchQuery);
            return titleMatch || authorMatch;
        })
        : filteredCatalogsByCategory;

    const hasResults = filteredCatalogs.length > 0;
    const totalPages = hasResults ? Math.ceil(filteredCatalogs.length / ITEMS_PER_PAGE) : 0;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentCatalogs = filteredCatalogs.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());
        const trimmedValue = searchInput.trim();

        if (trimmedValue) {
            params.set("search", trimmedValue);
        } else {
            params.delete("search");
        }

        setCurrentPage(1);
        const search = params.toString();
        router.push(search ? `${pathname}?${search}` : pathname, { scroll: false });
    };

    const handleClearSearch = () => {
        setSearchInput("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("search");

        setCurrentPage(1);
        const search = params.toString();
        router.push(search ? `${pathname}?${search}` : pathname, { scroll: false });
    };

    return (
        <>
            <Header isHomePage={false} />
            <SearchSection value={searchInput} onChange={setSearchInput} onSearch={handleSearch} />

            {normalizedSearchQuery && (
                <div className="bg-[#414141] flex flex-col items-center justify-center pt-4 pb-6 px-4">
                    <p className="text-white text-center font-wix text-[18px] leading-[24px]">
                        Результат пошуку
                    </p>
                </div>
            )}
            
            {/* Main Content Section */}
            <section className="w-full bg-[#414141] py-8 px-4 sm:px-6 md:px-10 lg:px-20">
                {hasResults ? (
                    <>
                        {/* Title Section */}
                        <div className="mb-6 md:mb-8">
                            <p className="text-[#FECC39] text-sm font-bold mb-2">Каталоги</p>
                            <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-[40px] leading-tight max-w-[600px] whitespace-normal md:whitespace-nowrap" style={{ fontWeight: 600 }}>
                                Каталоги наших митців
                            </h1>
                        </div>

                        {/* Filter and Content Section */}
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left Side - Filter */}
                            <FilterSection
                                key={`catalogs-filters-${selectedArtCategoryIds.slice().sort().join(",") || "all"}`}
                                filters={catalogsFilters}
                                onFilterChange={handleFilterChange}
                                initialSelectedFilters={initialSelectedFilters}
                            />

                            {/* Right Side - Sorting and Catalogs */}
                            <div className="flex-1 w-full">
                                {/* Sorting Button */}
                                <button className="flex items-center gap-2 mb-4 md:mb-6 text-white font-bold text-sm md:text-base bg-[#343434] px-3 md:px-4 py-2 md:py-3 hover:text-[#FECC39] transition-colors">
                                    Новіші
                                    <Image src="/white_triangle_down.svg" alt="" width={24} height={24} />
                                </button>

                                {/* Catalogs Grid */}
                                <ListOfCatalogs catalogs={currentCatalogs} />
                            </div>
                        </div>
                    </>
                ) : null}
            </section>
            {hasResults ? (
                <PaginationSection
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            ) : (
                <div className="bg-[#414141] flex flex-col items-center justify-center pb-8 px-4">
                    {normalizedSearchQuery ? (
                        <>
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="mb-6 flex items-center justify-center"
                            >
                                <img src="/yellow_cross.svg" alt="Очистити пошук" className="w-8 h-8 md:w-9 md:h-9" />
                            </button>
                            <h2 className="text-white text-xl md:text-3xl font-bold text-center max-w-[800px]">
                                Нічого не знайдено. Спробуйте іншу назву або автора.
                            </h2>
                        </>
                    ) : (
                        <h2 className="text-white text-xl md:text-3xl font-bold text-center max-w-[800px]">
                            Нічого не знайдено за фільтрами
                        </h2>
                    )}
                </div>
            )}
            <LatestNews />
            <JoinCommunityWrapper />
        </>
    );
}