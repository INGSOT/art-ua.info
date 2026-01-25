"use client";

import { useState } from "react";
import Header from "../../components/Header";
import LatestNews from "../../common_elements/LatestNews";
import JoinCommunityWrapper from "../../common_elements/JoinCommunityWrapper";
import SearchSection from "../../components/SearchSection";
import FilterSection from "../../components/filters/FilterSection";
import { authorsFilters } from "../../components/filters/filterConfig";
import Participant from "./Participant";
import SortingControls from "./SortingControls";
import PaginationSection from "../../components/PaginationSection";
import { participantsData } from "./participantsData";

const ITEMS_PER_PAGE = 10;

export default function AuthorsPage() {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(participantsData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentParticipants = participantsData.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <Header isHomePage={false} />
            <SearchSection />
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8 bg-[#414141] max-w-full overflow-hidden">
                <div className="hidden lg:block">
                    <FilterSection filters={authorsFilters} />
                </div>
                <div className="flex-1 flex flex-col gap-4 md:gap-6 lg:gap-8 min-w-0">
                    <SortingControls />
                    {currentParticipants.map((participant) => (
                        <Participant
                            key={participant.id}
                            artistPhoto={participant.artistPhoto}
                            artistName={participant.artistName}
                            artistType={participant.artistType}
                            tags={participant.tags}
                            photos={participant.photos}
                        />
                    ))}
                </div>
            </div>
            <PaginationSection
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            <LatestNews />
            <JoinCommunityWrapper />
        </>
    )
}