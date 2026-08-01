"use client";

import Image from "next/image";
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
import Participant from "../../../components/Participant";
import SortingControls from "./SortingControls";
import AuthorsFilterSidebar, { type ParticipantFilter } from "./AuthorsFilterSidebar";
import PaginationSection from "../../../components/PaginationSection";
import { type PhotoData } from "../../../data/artistsData";
import { artistsAPI, type AuthorsListFilters, type PublicArtist, type PublicArtistProject } from "../../../lib/api/artists";
import { organizationsAPI } from "../../../lib/api/organizations";
import { teamsAPI, type PublicTeam } from "../../../lib/api/teams";
import { localeToApiLanguage, type ApiLanguage, type Locale } from "../../../i18n/routing";

const ITEMS_PER_PAGE = 10;
// "Усі" поєднує 3 незалежно пагіновані джерела — точну наскрізну пагінацію не
// рахуємо (рішення: точна пагінація лише в межах одного обраного типу), тому тут
// просто тягнемо перші N з кожного типу без керування сторінками.
const ALL_TAB_PER_TYPE = 12;
const FALLBACK_ARTIST_PHOTO = "/artists/artist-photo-5.png";

interface AuthorCardData {
    kind: "artist" | "organization" | "team";
    id: number;
    slug: string;
    name: string;
    avatarUrl: string | null;
    typeLabel: string;
    tags: string[];
    photos: PhotoData[];
    memberAvatars?: string[];
}

const EMPTY_FILTERS: AuthorsListFilters = { categories: [], parameters: [], sort_options: [] };

function toPhotos(projects: PublicArtistProject[]): PhotoData[] {
    return projects.map((project) => ({
        image: project.coverUrl ?? FALLBACK_ARTIST_PHOTO,
        likes: project.likesCount,
        slug: project.slug,
    }));
}

async function buildAuthorCards(
    items: PublicArtist[],
    kind: "artist" | "organization",
    fallbackTypeLabel: string,
    language: ApiLanguage
): Promise<AuthorCardData[]> {
    const api = kind === "artist" ? artistsAPI : organizationsAPI;

    return Promise.all(
        items.map(async (item) => {
            let projects: PublicArtistProject[] = [];
            try {
                projects = await api.projects(item.slug, language, { per_page: 5 });
            } catch (error) {
                console.error(`Failed to load projects for "${item.slug}":`, error);
            }

            return {
                kind,
                id: item.id,
                slug: item.slug,
                name: item.name,
                avatarUrl: item.avatarUrl,
                typeLabel: item.profession || fallbackTypeLabel,
                tags: [item.profession, item.city, item.country].filter((v): v is string => !!v),
                photos: toPhotos(projects),
            };
        })
    );
}

async function buildTeamCards(
    teams: PublicTeam[],
    typeLabel: string,
    language: ApiLanguage
): Promise<AuthorCardData[]> {
    return Promise.all(
        teams.map(async (team) => {
            let projects: PublicArtistProject[] = [];
            try {
                projects = await teamsAPI.projects(team.slug, language, { per_page: 5 });
            } catch (error) {
                console.error(`Failed to load projects for team "${team.slug}":`, error);
            }

            return {
                kind: "team" as const,
                id: team.id,
                slug: team.slug,
                name: team.name,
                avatarUrl: team.avatarUrl,
                typeLabel,
                tags: [team.city, team.country, team.website].filter((v): v is string => !!v),
                photos: toPhotos(projects),
                memberAvatars: team.memberAvatars,
            };
        })
    );
}

function mergeCategoryFilters(a: AuthorsListFilters, b: AuthorsListFilters): AuthorsListFilters {
    const bySlug = new Map(a.categories.map((c) => [c.slug, { ...c, subcategories: [...c.subcategories] }]));

    b.categories.forEach((category) => {
        const existing = bySlug.get(category.slug);
        if (!existing) {
            bySlug.set(category.slug, { ...category, subcategories: [...category.subcategories] });
            return;
        }
        existing.authors_count = (existing.authors_count ?? 0) + (category.authors_count ?? 0);
        const subBySlug = new Map(existing.subcategories.map((s) => [s.slug, { ...s }]));
        category.subcategories.forEach((sub) => {
            const existingSub = subBySlug.get(sub.slug);
            if (existingSub) {
                existingSub.authors_count = (existingSub.authors_count ?? 0) + (sub.authors_count ?? 0);
            } else {
                subBySlug.set(sub.slug, { ...sub });
            }
        });
        existing.subcategories = Array.from(subBySlug.values());
    });

    const parametersById = new Map(a.parameters.map((p) => [p.id, { ...p, values: [...p.values] }]));
    b.parameters.forEach((parameter) => {
        const existing = parametersById.get(parameter.id);
        if (!existing) {
            parametersById.set(parameter.id, { ...parameter, values: [...parameter.values] });
            return;
        }
        const valueById = new Map(existing.values.map((v) => [v.id, { ...v }]));
        parameter.values.forEach((value) => {
            const existingValue = valueById.get(value.id);
            if (existingValue) {
                existingValue.authors_count = (existingValue.authors_count ?? 0) + (value.authors_count ?? 0);
            } else {
                valueById.set(value.id, { ...value });
            }
        });
        existing.values = Array.from(valueById.values());
    });

    return {
        categories: Array.from(bySlug.values()),
        parameters: Array.from(parametersById.values()),
        sort_options: a.sort_options.length ? a.sort_options : b.sort_options,
    };
}

export default function AuthorsPage() {
    const t = useTranslations("Authors.list");
    const locale = useLocale() as Locale;
    const language = localeToApiLanguage(locale);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const sortFallbackOptions = [
        { slug: "projects_count", name: t("sortPopularity") },
        { slug: "name", name: t("sortName") },
    ];

    const participantParam = searchParams.get("participant");
    const participant: ParticipantFilter =
        participantParam === "artist" || participantParam === "organization" || participantParam === "team"
            ? participantParam
            : "all";

    const searchQueryParam = searchParams.get("search") ?? "";
    const artCategoryParam = searchParams.get("art_category") ?? "";
    const subcategoryParam = searchParams.get("art_subcategory") ?? "";
    const selectedSubcategories = subcategoryParam ? subcategoryParam.split(",").filter(Boolean) : [];
    const parameterValueParam = searchParams.get("parameter_value_id") ?? "";
    const selectedParameterValueIds = parameterValueParam ? parameterValueParam.split(",").filter(Boolean) : [];
    const sortBy = searchParams.get("sort_by") ?? "projects_count";
    const currentPage = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

    const [searchInput, setSearchInput] = useState(searchQueryParam);
    const [items, setItems] = useState<AuthorCardData[]>([]);
    const [meta, setMeta] = useState<{ current_page: number; last_page: number } | null>(null);
    const [filtersData, setFiltersData] = useState<AuthorsListFilters>(EMPTY_FILTERS);
    const [loading, setLoading] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    useEffect(() => {
        setSearchInput(searchQueryParam);
    }, [searchQueryParam]);

    useEffect(() => {
        let ignore = false;

        (async () => {
            setLoading(true);
            try {
                const search = searchQueryParam || undefined;

                if (participant === "artist" || participant === "organization") {
                    const api = participant === "artist" ? artistsAPI : organizationsAPI;
                    const result = await api.browse(language, {
                        ...(search ? { search } : {}),
                        ...(artCategoryParam ? { art_category: artCategoryParam } : {}),
                        ...(selectedSubcategories.length ? { art_subcategory: selectedSubcategories.join(",") } : {}),
                        ...(selectedParameterValueIds.length
                            ? { parameter_value_id: selectedParameterValueIds.join(",") }
                            : {}),
                        sort_by: sortBy,
                        page: currentPage,
                        per_page: ITEMS_PER_PAGE,
                    });
                    if (ignore) return;
                    const cards = await buildAuthorCards(
                        result.data,
                        participant,
                        participant === "artist" ? t("typeArtist") : t("typeOrganization"),
                        language
                    );
                    if (ignore) return;
                    setItems(cards);
                    setMeta(result.meta);
                    setFiltersData(result.filters);
                } else if (participant === "team") {
                    const result = await teamsAPI.browse(language, {
                        ...(search ? { search } : {}),
                        page: currentPage,
                        per_page: ITEMS_PER_PAGE,
                    });
                    if (ignore) return;
                    const cards = await buildTeamCards(result.data, t("typeTeam"), language);
                    if (ignore) return;
                    setItems(cards);
                    setMeta(result.meta);
                    setFiltersData(EMPTY_FILTERS);
                } else {
                    const authorParams = {
                        ...(search ? { search } : {}),
                        ...(artCategoryParam ? { art_category: artCategoryParam } : {}),
                        ...(selectedSubcategories.length ? { art_subcategory: selectedSubcategories.join(",") } : {}),
                        ...(selectedParameterValueIds.length
                            ? { parameter_value_id: selectedParameterValueIds.join(",") }
                            : {}),
                        sort_by: sortBy,
                        per_page: ALL_TAB_PER_TYPE,
                    };
                    const [artistsResult, organizationsResult, teamsResult] = await Promise.all([
                        artistsAPI.browse(language, authorParams),
                        organizationsAPI.browse(language, authorParams),
                        teamsAPI.browse(language, { ...(search ? { search } : {}), per_page: ALL_TAB_PER_TYPE }),
                    ]);
                    if (ignore) return;
                    const [artistCards, organizationCards, teamCards] = await Promise.all([
                        buildAuthorCards(artistsResult.data, "artist", t("typeArtist"), language),
                        buildAuthorCards(organizationsResult.data, "organization", t("typeOrganization"), language),
                        buildTeamCards(teamsResult.data, t("typeTeam"), language),
                    ]);
                    if (ignore) return;
                    setItems([...artistCards, ...organizationCards, ...teamCards]);
                    setMeta(null);
                    setFiltersData(mergeCategoryFilters(artistsResult.filters, organizationsResult.filters));
                }
            } catch (error) {
                if (ignore) return;
                console.error("Failed to load authors:", error);
                setItems([]);
                setMeta(null);
            } finally {
                if (!ignore) {
                    setLoading(false);
                    setHasLoaded(true);
                }
            }
        })();

        return () => {
            ignore = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [participant, artCategoryParam, subcategoryParam, parameterValueParam, sortBy, searchQueryParam, currentPage, language]);

    const pushParams = (mutate: (params: URLSearchParams) => void, resetPage = true) => {
        const params = new URLSearchParams(searchParams.toString());
        mutate(params);
        if (resetPage) {
            params.delete("page");
        }
        const search = params.toString();
        router.push(search ? `${pathname}?${search}` : pathname, { scroll: false });
    };

    const handleParticipantChange = (next: ParticipantFilter) => {
        pushParams((params) => {
            if (next === "all") {
                params.delete("participant");
            } else {
                params.set("participant", next);
            }
            // Команди не мають власної art_category — скидаємо категорію при переході.
            if (next === "team") {
                params.delete("art_category");
                params.delete("art_subcategory");
                params.delete("parameter_value_id");
            }
        });
    };

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

    const handleSortChange = (slug: string) => {
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
            params.delete("participant");
            params.delete("art_category");
            params.delete("art_subcategory");
            params.delete("parameter_value_id");
        });
    };

    const participantLabels: Record<ParticipantFilter, string> = {
        all: t("participantAll"),
        artist: t("participantArtist"),
        organization: t("participantOrganization"),
        team: t("participantTeam"),
    };

    const activeCategory = filtersData.categories.find((c) => c.slug === artCategoryParam);
    const categoryNameMap = Object.fromEntries(filtersData.categories.map((c) => [c.slug, c.name]));
    const subcategoryNameMap = Object.fromEntries(
        filtersData.categories.flatMap((c) => c.subcategories.map((s) => [s.slug, s.name]))
    );
    const parameterValueNameMap = Object.fromEntries(
        filtersData.parameters.flatMap((p) => p.values.map((v) => [String(v.id), v.value]))
    );

    const selectedFilterChips: FilterChip[] = [
        ...(participant !== "all" ? [{ id: `participant:${participant}`, label: participantLabels[participant] }] : []),
        ...(artCategoryParam
            ? [{ id: `art_category:${artCategoryParam}`, label: categoryNameMap[artCategoryParam] ?? artCategoryParam }]
            : []),
        ...selectedSubcategories.map((slug) => ({
            id: `art_subcategory:${slug}`,
            label: subcategoryNameMap[slug] ?? slug,
        })),
        ...selectedParameterValueIds.map((id) => ({
            id: `parameter_value_id:${id}`,
            label: parameterValueNameMap[id] ?? id,
        })),
    ];

    const handleRemoveFilterChip = (chipId: string) => {
        if (chipId.startsWith("participant:")) {
            handleParticipantChange("all");
            return;
        }
        if (chipId.startsWith("art_category:")) {
            handleCategoryClick(null);
            return;
        }
        if (chipId.startsWith("art_subcategory:")) {
            handleSubcategoryToggle(chipId.slice("art_subcategory:".length));
            return;
        }
        if (chipId.startsWith("parameter_value_id:")) {
            handleParameterValueToggle(Number(chipId.slice("parameter_value_id:".length)));
        }
    };

    const normalizedSearchQuery = searchQueryParam.trim();
    const noSearchResults = hasLoaded && !loading && normalizedSearchQuery && items.length === 0;
    const sortOptions = filtersData.sort_options.length ? filtersData.sort_options : sortFallbackOptions;
    const showCategoryFilters = participant !== "team";

    const sidebar = (
        <AuthorsFilterSidebar
            participant={participant}
            onParticipantChange={handleParticipantChange}
            parameters={filtersData.parameters}
            selectedParameterValueIds={selectedParameterValueIds}
            onToggleParameterValue={handleParameterValueToggle}
        />
    );

    return (
        <>
            <Header isHomePage={false} />
            <SearchSection value={searchInput} onChange={setSearchInput} onSearch={handleSearch} />

            {normalizedSearchQuery && (
                <div className="bg-[#414141] flex flex-col items-center justify-center pt-4 pb-6 px-4">
                    <p className="text-white text-center font-wix text-[18px] leading-[24px]">
                        {t("searchResultTitle")}
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
                        {t("noResultsTitle")}
                    </h2>
                </div>
            )}

            {!noSearchResults && (
                <>
                    <section className="w-full bg-[#414141] py-8 px-4 sm:px-6 md:px-10 lg:px-20">
                        {showCategoryFilters && (
                            <>
                                {/* Галузі мистецтва — реальні категорії з бекенду (як на /projects) */}
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
                            </>
                        )}

                        <div className="sticky top-0 z-40 bg-[#414141] py-2 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-10 md:px-10 lg:-mx-20 lg:px-20 mb-4 lg:mb-6">
                            <div className="flex items-center justify-between gap-1 md:gap-2 mb-3 lg:hidden">
                                <FiltersButton
                                    className="lg:hidden"
                                    onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
                                    isActive={isMobileFiltersOpen}
                                    selectedCount={selectedFilterChips.length}
                                />
                                {participant !== "team" && (
                                    <div className="relative ml-auto min-w-0 flex-1 max-w-[220px] sm:max-w-[260px]">
                                        <SortingControls options={sortOptions} value={sortBy} onChange={handleSortChange} />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                <div className="min-w-0">
                                    <SelectedFiltersBar
                                        chips={selectedFilterChips}
                                        onRemove={handleRemoveFilterChip}
                                        onClearAll={handleClearAllFilters}
                                    />
                                </div>
                                {participant !== "team" && (
                                    <div className="hidden lg:block relative lg:w-[260px] lg:flex-shrink-0">
                                        <SortingControls options={sortOptions} value={sortBy} onChange={handleSortChange} />
                                    </div>
                                )}
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
                                ) : items.length === 0 ? (
                                    <div className="w-full min-h-[420px] flex flex-col items-center justify-center gap-8">
                                        <p className="font-wix text-white text-lg md:text-2xl">{t("emptyTitle")}</p>
                                        <Image src="/masks.svg" alt={t("emptyAlt")} width={380} height={285} priority />
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
                                        {items.map((item) => (
                                            <Participant
                                                key={`${item.kind}-${item.id}`}
                                                artistSlug={item.kind !== "team" ? item.slug : undefined}
                                                artistPhoto={item.avatarUrl ?? FALLBACK_ARTIST_PHOTO}
                                                artistName={item.name}
                                                artistType={item.typeLabel}
                                                tags={item.tags}
                                                photos={item.photos}
                                                catalogButtonText={item.kind === "team" ? "" : t("catalogButton")}
                                                isTeam={item.kind === "team"}
                                                teamSlug={item.kind === "team" ? item.slug : undefined}
                                                memberAvatars={item.memberAvatars ?? []}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {meta && meta.last_page > 1 && (
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
