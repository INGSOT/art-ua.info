"use client";

import { useState } from "react";
import Header from "../../components/Header";
import LatestNews from "../../common_elements/LatestNews";
import JoinCommunityWrapper from "../../common_elements/JoinCommunityWrapper";
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

    const totalPages = Math.ceil(catalogsData.length / ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <Header isHomePage={false} />
            <SearchSection />
            
            {/* Main Content Section */}
            <section className="w-full bg-[#414141] py-8 px-4 sm:px-6 md:px-10 lg:px-20">
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
                    <FilterSection filters={catalogsFilters} />

                    {/* Right Side - Sorting and Catalogs */}
                    <div className="flex-1 w-full">
                        {/* Sorting Button */}
                        <button className="flex items-center gap-2 mb-4 md:mb-6 text-white font-bold text-sm md:text-base bg-[#343434] px-3 md:px-4 py-2 md:py-3 hover:text-[#FECC39] transition-colors">
                            Новіші
                            <Image src="/white_triangle_down.svg" alt="" width={24} height={24} />
                        </button>

                        {/* Catalogs Grid */}
                        <ListOfCatalogs currentPage={currentPage} itemsPerPage={ITEMS_PER_PAGE} />
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