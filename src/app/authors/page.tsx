"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import LatestNews from "../../components/LatestNews";
import JoinCommunityWrapper from "../../components/JoinCommunityWrapper";
import SearchSection from "../../components/SearchSection";
import FilterSection from "../../components/filters/FilterSection";
import { authorsFilters } from "../../components/filters/filterConfig";
import Participant from "../../components/Participant";
import SortingControls from "./SortingControls";
import PaginationSection from "../../components/PaginationSection";
import { artistsData, type ArtistData } from "../../data/artistsData";
import { teamData, type TeamProfile } from "../../data/teamData";

const ITEMS_PER_PAGE = 10;

export default function AuthorsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const participantParam = searchParams.get("participant");
    const searchQueryParam = searchParams.get("search") ?? "";
    const artFieldsSection = authorsFilters.find((section) => section.id === "art-fields");
    const artItems =
        artFieldsSection?.subsections?.flatMap((subsection) => subsection.items ?? []) ?? [];
    const allowedArtCategoryIds = new Set(artItems.map((item) => item.id));
    const selectedArtCategoryIds = searchParams
        .getAll("art_subcategory")
        .filter((value) => allowedArtCategoryIds.has(value));

    type ParticipantFilter = "artist" | "team" | "all";

    const currentParticipantFilter: ParticipantFilter =
        participantParam === "artist"
            ? "artist"
            : participantParam === "team"
                ? "team"
                : "all";

    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState(searchQueryParam);

    useEffect(() => {
        setSearchInput(searchQueryParam);
    }, [searchQueryParam]);

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

        artItems.forEach((item) => {
            base[item.id] = selectedArtCategoryIds.includes(item.id);
        });

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

        const selectedIds = artItems
            .map((item) => item.id)
            .filter((id) => !!filters[id]);

        const params = new URLSearchParams(searchParams.toString());

        if (nextFilter === "artist") {
            params.set("participant", "artist");
        } else if (nextFilter === "team") {
            params.set("participant", "team");
        } else {
            params.delete("participant");
        }

        params.delete("art_subcategory");
        selectedIds.forEach((id) => {
            params.append("art_subcategory", id);
        });

        const search = params.toString();
        router.push(search ? `${pathname}?${search}` : pathname, { scroll: false });
    };

    let activeData: (ArtistData | TeamProfile)[] = [];

    if (currentParticipantFilter === "artist") {
        activeData = artistsData;
    } else if (currentParticipantFilter === "team") {
        activeData = teamData;
    } else {
        activeData = [...artistsData, ...teamData];
    }

    const filteredDataByCategory = selectedArtCategoryIds.length
        ? activeData.filter(
            (participant): participant is ArtistData =>
                "artSubCategory" in participant && selectedArtCategoryIds.includes(participant.artSubCategory)
        )
        : activeData;

    const normalizedSearchQuery = searchQueryParam.trim().toLowerCase();

    const filteredData = normalizedSearchQuery
        ? filteredDataByCategory.filter((participant) => {
            const name =
                "artistName" in participant ? participant.artistName : participant.name;
            const role =
                "artistType" in participant ? participant.artistType : participant.category;
            const nameMatch = name.toLowerCase().includes(normalizedSearchQuery);
            const typeMatch = role.toLowerCase().includes(normalizedSearchQuery);
            const tagsMatch = participant.tags.some((tag) =>
                tag.toLowerCase().includes(normalizedSearchQuery)
            );

            return nameMatch || typeMatch || tagsMatch;
        })
        : filteredDataByCategory;

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentParticipants = filteredData.slice(startIndex, endIndex);

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

        const search = params.toString();
        router.push(search ? `${pathname}?${search}` : pathname, { scroll: false });
    };

    return (
        <>
            <Header isHomePage={false} />
            <SearchSection
                value={searchInput}
                onChange={setSearchInput}
                onSearch={handleSearch}
            />
            {normalizedSearchQuery && (
                <div className="bg-[#414141] flex flex-col items-center justify-center pt-4 pb-6 px-4">
                    <p className="text-white text-center font-wix text-[18px] leading-[24px]">
                        Результат пошуку
                    </p>
                </div>
            )}
            {!normalizedSearchQuery && searchQueryParam && (
                <div className="bg-[#414141] flex flex-col items-center justify-center pt-4 pb-6 px-4">
                    <p className="text-white text-center font-wix text-[18px] leading-[24px]">
                        Результат пошуку
                    </p>
                </div>
            )}
            {normalizedSearchQuery && filteredData.length === 0 && (
                <div className="bg-[#414141] flex flex-col items-center justify-center pb-8 px-4">
                    <button
                        type="button"
                        onClick={handleClearSearch}
                        className="mb-6 flex items-center justify-center"
                    >
                        <img src="/yellow_cross.svg" alt="Очистити пошук" className="w-8 h-8 md:w-9 md:h-9" />
                    </button>
                    <h2 className="mt-2 text-white text-xl md:text-3xl font-bold text-center max-w-[800px]">
                        Нічого не знайдено. Спробуйте інше ім’я, прізвище або назву.
                    </h2>
                </div>
            )}
            {!(normalizedSearchQuery && filteredData.length === 0) && (
                <>
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
                            {filteredData.length === 0 ? (
                                <div className="w-full min-h-[420px] flex flex-col items-center justify-center gap-8">
                                    <p className="font-wix text-white text-lg md:text-2xl">Авторів не знайдено</p>
                                    <Image src="/masks.svg" alt="Авторів не знайдено" width={380} height={285} priority />
                                </div>
                            ) : (
                                currentParticipants.map((participant) =>
                                    "artSubCategory" in participant ? (
                                        <Participant
                                            key={participant.id}
                                            artistId={participant.id}
                                            artistPhoto={participant.artistPhoto}
                                            artistName={participant.artistName}
                                            artistType={participant.artistType}
                                            tags={participant.tags}
                                            photos={participant.photos}
                                            catalogButtonText={participant.catalogButtonText}
                                        />
                                    ) : (
                                        <Participant
                                            key={participant.id}
                                            artistPhoto={participant.avatar}
                                            artistName={participant.name}
                                            artistType={participant.category}
                                            tags={participant.tags}
                                            photos={(participant.services ?? []).map((service) => ({
                                                image: service.image,
                                                likes: 0,
                                            }))}
                                            catalogButtonText=""
                                            isTeam
                                            teamSlug={participant.username}
                                            memberAvatars={participant.members.map((m) => m.avatar)}
                                        />
                                    )
                                )
                            )}
                        </div>
                    </div>
                    <PaginationSection
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
            <LatestNews />
            <JoinCommunityWrapper />
        </>
    )
}