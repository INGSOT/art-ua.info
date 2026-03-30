"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import LatestNews from "../../components/LatestNews";
import JoinCommunityWrapper from "../../components/JoinCommunityWrapper";
import SearchSection from "../../components/SearchSection";
import FilterSection from "../../components/filters/FilterSection";
import { projectsFilters } from "../../components/filters/filterConfig";
import ListOfProjects from "./ListOfProjects";
import PaginationSection from "../../components/PaginationSection";
import Image from "next/image";
import { projectsData } from "../../data/projectsData";

const ITEMS_PER_PAGE = 12;

type SortOption = "Популярні" | "Новіші" | "Давніші";

const parseProjectDate = (dateString: string): number => {
    const [day, month, year] = dateString.split(".").map(Number);
    return new Date(year, month - 1, day).getTime();
};

export default function ProjectsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState<SortOption>("Популярні");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const searchQueryParam = searchParams.get("search") ?? "";

    const artFieldsSection = projectsFilters.find((section) => section.id === "art-fields");
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

    const normalizedSearchQuery = searchQueryParam.trim().toLowerCase();

    const filteredProjectsByCategory = selectedArtCategoryIds.length
        ? projectsData.filter((project) => selectedArtCategoryIds.includes(project.artCategory))
        : projectsData;

    const filteredProjects = normalizedSearchQuery
        ? filteredProjectsByCategory.filter((project) => {
            const titleMatch = project.title.toLowerCase().includes(normalizedSearchQuery);
            const authorMatch = project.authorName.toLowerCase().includes(normalizedSearchQuery);
            return titleMatch || authorMatch;
        })
        : filteredProjectsByCategory;

    const sortedProjects = [...filteredProjects].sort((a, b) => {
        if (sortOption === "Популярні") {
            return b.likes - a.likes;
        }

        const aDate = parseProjectDate(a.date);
        const bDate = parseProjectDate(b.date);

        if (sortOption === "Новіші") {
            return bDate - aDate;
        }

        return aDate - bDate;
    });

    const hasResults = sortedProjects.length > 0;
    const totalPages = hasResults ? Math.ceil(sortedProjects.length / ITEMS_PER_PAGE) : 0;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentProjects = sortedProjects.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSortChange = (option: SortOption) => {
        setSortOption(option);
        setIsSortOpen(false);
    };

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
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Side - Filter */}
                    <FilterSection
                        key={`projects-filters-${selectedArtCategoryIds.slice().sort().join(",") || "all"}`}
                        filters={projectsFilters}
                        onFilterChange={handleFilterChange}
                        initialSelectedFilters={initialSelectedFilters}
                    />

                    {/* Right Side - Sorting and Projects */}
                    <div className="flex-1 w-full">
                        {/* Sorting Dropdown */}
                        <div className="relative mb-4 md:mb-6 inline-block">
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center gap-2 text-white font-bold text-sm md:text-base bg-[#343434] px-3 md:px-4 py-2 md:py-3 hover:text-[#FECC39] transition-colors"
                            >
                                {sortOption}
                                <Image
                                    src={isSortOpen ? "/yellow_triangle_up.svg" : "/white_triangle_down.svg"}
                                    alt=""
                                    width={24}
                                    height={24}
                                />
                            </button>

                            {/* Dropdown Menu */}
                            {isSortOpen && (
                                <div className="absolute top-full left-0 mt-1 bg-[#343434] z-50 w-full border-2 border-[#1a1a1a]">
                                    {(["Популярні", "Новіші", "Давніші"] as SortOption[]).map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => handleSortChange(option)}
                                            className={`w-full text-left px-3 md:px-4 py-2 md:py-3 font-bold text-sm md:text-base transition-colors border-b border-[#1a1a1a] last:border-b-0 ${
                                                sortOption === option
                                                    ? "text-[#FECC39] bg-[#414141]"
                                                    : "text-white hover:text-[#FECC39] hover:bg-[#414141]"
                                            }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Projects Grid */}
                        <ListOfProjects projects={currentProjects} disableInteractions={isSortOpen} />
                    </div>
                </div>
            </section>
            {hasResults && (
                <PaginationSection
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
            <LatestNews />
            <JoinCommunityWrapper />
        </>
    );
}
