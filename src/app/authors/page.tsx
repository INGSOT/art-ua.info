"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import LatestNews from "../../common_elements/LatestNews";
import JoinCommunityWrapper from "../../common_elements/JoinCommunityWrapper";
import SearchSection from "../../components/SearchSection";
import FilterSection from "../../components/filters/FilterSection";
import { authorsFilters } from "../../components/filters/filterConfig";
import Participant from "./Participant";
import SortingControls from "./SortingControls";
import PaginationSection from "../../components/PaginationSection";
import { artistsData, teamsData, TeamData, ArtistData } from "../../data/participantsData";

const ITEMS_PER_PAGE = 10;

export default function AuthorsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const participantParam = searchParams.get("participant");

    type ParticipantFilter = "artist" | "team" | "all";

    const currentParticipantFilter: ParticipantFilter =
        participantParam === "artist"
            ? "artist"
            : participantParam === "team"
                ? "team"
                : "all";

    const [currentPage, setCurrentPage] = useState(1);

    const initialSelectedFilters: Record<string, boolean> = (() => {
        const base: Record<string, boolean> = {
            all: false,
            artists: false,
            organizations: false,
            teams: false,
        };

        if (currentParticipantFilter === "artist") {
            base.artists = true;
        } else if (currentParticipantFilter === "team") {
            base.teams = true;
        } else {
            base.all = true;
        }

        return base;
    })();

    const handleFilterChange = (filters: Record<string, boolean>) => {
        setCurrentPage(1);

        const artistsSelected = !!filters["artists"];
        const teamsSelected = !!filters["teams"];
        const allSelected = !!filters["all"];

        let nextFilter: ParticipantFilter = "all";

        if (artistsSelected && !teamsSelected && !allSelected) {
            nextFilter = "artist";
        } else if (teamsSelected && !artistsSelected && !allSelected) {
            nextFilter = "team";
        } else {
            nextFilter = "all";
        }

        const params = new URLSearchParams(searchParams.toString());

        if (nextFilter === "artist") {
            params.set("participant", "artist");
        } else if (nextFilter === "team") {
            params.set("participant", "team");
        } else {
            params.delete("participant");
        }

        const search = params.toString();
        router.push(search ? `${pathname}?${search}` : pathname, { scroll: false });
    };

    let activeData: (ArtistData | TeamData)[] = [];

    if (currentParticipantFilter === "artist") {
        activeData = artistsData;
    } else if (currentParticipantFilter === "team") {
        activeData = teamsData;
    } else {
        activeData = [...artistsData, ...teamsData];
    }

    const totalPages = Math.ceil(activeData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentParticipants = activeData.slice(startIndex, endIndex);

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
                    <FilterSection
                        filters={authorsFilters}
                        onFilterChange={handleFilterChange}
                        initialSelectedFilters={initialSelectedFilters}
                    />
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
                            catalogButtonText={
                                "catalogButtonText" in participant && !("teamMembers" in participant)
                                    ? participant.catalogButtonText
                                    : ""
                            }
                            isTeam={"teamMembers" in participant}
                            memberAvatars={
                                "teamMembers" in participant
                                    ? (participant as TeamData).teamMembers
                                    : undefined
                            }
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