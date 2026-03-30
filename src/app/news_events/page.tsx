"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import JoinCommunityWrapper from "../../components/JoinCommunityWrapper";
import SearchSection from "../../components/SearchSection";
import ListOfNews from "./ListOfNews";
import { newsData } from "../../data/newsData";
import PaginationSection from "../../components/PaginationSection";
import Image from "next/image";

const ITEMS_PER_PAGE = 12;

type SortOption = "Новіші" | "Давніші";

const parseNewsDate = (dateValue: string) => {
    const [day, month, year] = dateValue.split(".").map(Number);
    return new Date(year, month - 1, day).getTime();
};

export default function NewsEventsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState<SortOption>("Новіші");
    const [isSortOpen, setIsSortOpen] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const searchQueryParam = searchParams.get("search") ?? "";
    const [searchInput, setSearchInput] = useState(searchQueryParam);

    useEffect(() => {
        setSearchInput(searchQueryParam);
    }, [searchQueryParam]);

    const normalizedSearchQuery = searchQueryParam.trim().toLowerCase();
    const filteredNews = normalizedSearchQuery
        ? newsData.filter((newsItem) => newsItem.title.toLowerCase().includes(normalizedSearchQuery))
        : newsData;

    const sortedNews = [...filteredNews].sort((a, b) => {
        const dateA = parseNewsDate(a.date);
        const dateB = parseNewsDate(b.date);

        return sortOption === "Новіші" ? dateB - dateA : dateA - dateB;
    });

    const hasResults = sortedNews.length > 0;
    const totalPages = hasResults ? Math.ceil(sortedNews.length / ITEMS_PER_PAGE) : 0;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentNews = sortedNews.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSortChange = (option: SortOption) => {
        setSortOption(option);
        setCurrentPage(1);
        setIsSortOpen(false);
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
            
            {hasResults ? (
                <section className="w-full bg-[#414141] py-8 px-4 sm:px-6 md:px-10 lg:px-20">
                    {/* Title Section */}
                    <div className="mb-6 md:mb-8">
                        <p className="font-wix text-[#FECC39]  font-bold mb-2">Новини та події</p>
                        <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-[40px] leading-tight max-w-[600px] whitespace-normal md:whitespace-nowrap" style={{ fontWeight: 600 }}>
                            Актуальні новини та події у спільноті
                        </h1>
                    </div>

                    {/* Sorting and News Section */}
                    <div className="flex flex-col w-full">
                        {/* Sorting Dropdown */}
                        <div className="relative z-20 mb-4 md:mb-6 inline-block w-fit">
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
                                <div className="absolute top-full left-0 mt-1 bg-[#343434] z-30 min-w-[200px] border-2 border-[#1a1a1a]">
                                    {(["Новіші", "Давніші"] as SortOption[]).map((option) => (
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

                        {/* News Grid */}
                        <ListOfNews news={currentNews} disableHover={isSortOpen} />
                    </div>
                </section>
            ) : null}
            {hasResults ? (
                <PaginationSection
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            ) : (
                <div className="bg-[#414141] flex flex-col items-center justify-center pb-8 px-4">
                    <button
                        type="button"
                        onClick={handleClearSearch}
                        className="mb-6 flex items-center justify-center"
                    >
                        <img src="/yellow_cross.svg" alt="Очистити пошук" className="w-8 h-8 md:w-9 md:h-9" />
                    </button>
                    <h2 className="text-white text-xl md:text-3xl font-bold text-center max-w-[800px]">
                        Нічого не знайдено. Спробуйте іншу назву новини.
                    </h2>
                </div>
            )}
            <JoinCommunityWrapper />
        </>
    );
}
