"use client";

import { useState } from "react";
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

export default function ProjectsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState<SortOption>("Популярні");
    const [isSortOpen, setIsSortOpen] = useState(false);

    const totalPages = Math.ceil(projectsData.length / ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSortChange = (option: SortOption) => {
        setSortOption(option);
        setIsSortOpen(false);
    };

    return (
        <>
            <Header isHomePage={false} />
            <SearchSection />
            
            {/* Main Content Section */}
            <section className="w-full bg-[#414141] py-8 px-4 sm:px-6 md:px-10 lg:px-20">
               
                {/* Filter and Content Section */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Side - Filter */}
                    <FilterSection filters={projectsFilters} />

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
                                <div className="absolute top-full left-0 mt-1 bg-[#343434] z-10 w-full border-2 border-[#1a1a1a]">
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
                        <ListOfProjects currentPage={currentPage} itemsPerPage={ITEMS_PER_PAGE} />
                    </div>
                </div>
            </section>
                <PaginationSection
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            <LatestNews />
            <JoinCommunityWrapper />
        </>
    );
}
