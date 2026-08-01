"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { useSearchParams } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import JoinCommunityWrapper from "../../../components/JoinCommunityWrapper";
import SearchSection from "../../../components/SearchSection";
import FilterSection from "../../../components/filters/FilterSection";
import SelectedFiltersBar from "../../../components/filters/SelectedFiltersBar";
import { buildFilterChips, getClearedFiltersState, removeFilterFromState } from "../../../components/filters/filterChipUtils";
import { FilterSection as FilterSectionType } from "../../../components/filters/filterConfig";
import ListOfFAQ, { FAQItem } from "./ListOfFAQ";
import { faqAPI, PublicFaqCategory } from "../../../lib/api/faq";
import { localeToApiLanguage, type Locale } from "../../../i18n/routing";

const ALL_CATEGORIES = "all";

export default function FAQPage() {
    const t = useTranslations("Faq.page");
    const locale = useLocale() as Locale;
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [categories, setCategories] = useState<PublicFaqCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        faqAPI
            .list(localeToApiLanguage(locale))
            .then((data) => {
                if (isMounted) {
                    setCategories(data);
                }
            })
            .catch((error) => {
                console.error("Failed to load FAQ:", error);
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [locale]);

    const faqData = useMemo<FAQItem[]>(() => {
        return categories.flatMap((category) =>
            category.questions.map((question) => ({
                id: `item-${question.id}`,
                category: category.name,
                question: question.question,
                answer: question.answer.split("\n").filter(Boolean),
            }))
        );
    }, [categories]);

    const faqCategories = useMemo(() => categories.map((category) => category.name), [categories]);

    const selectedCategoryParam = searchParams.get("category");
    const selectedCategory = faqCategories.includes(selectedCategoryParam || "")
        ? (selectedCategoryParam as string)
        : ALL_CATEGORIES;

    const faqFilters = useMemo<FilterSectionType[]>(() => {
        return [
            {
                id: "categories",
                title: t("categoriesFilterTitle"),
                type: "simple",
                items: [
                    { id: ALL_CATEGORIES, label: t("allCategories"), type: "checkbox" },
                    ...faqCategories.map((category) => ({
                        id: category,
                        label: category,
                        type: "checkbox" as const,
                    })),
                ],
            },
        ];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [faqCategories, t]);

    const initialSelectedFilters = useMemo<Record<string, boolean>>(() => {
        if (selectedCategory === ALL_CATEGORIES) {
            return { [ALL_CATEGORIES]: true };
        }

        return { [selectedCategory]: true };
    }, [selectedCategory]);

    const filteredFaq = useMemo(() => {
        if (selectedCategory === ALL_CATEGORIES) {
            return faqData;
        }

        return faqData.filter((item) => item.category === selectedCategory);
    }, [faqData, selectedCategory]);

    const handleFilterChange = (filters: Record<string, boolean>) => {
        const selectedFilter = Object.entries(filters).find(([, isSelected]) => isSelected)?.[0] ?? "all";
        const params = new URLSearchParams(searchParams.toString());

        if (selectedFilter === "all") {
            params.delete("category");
        } else {
            params.set("category", selectedFilter);
        }

        const queryString = params.toString();
        router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    };

    const selectedFilterChips = buildFilterChips(faqFilters, initialSelectedFilters);

    const handleRemoveFilter = (chipId: string) => {
        handleFilterChange(removeFilterFromState(chipId, initialSelectedFilters, faqFilters));
    };

    const handleClearAllFilters = () => {
        handleFilterChange(getClearedFiltersState(faqFilters));
    };

    return (
        <>
            <Header isHomePage={false} />
            <SearchSection />
            
            {/* Main Content Section */}
            <section className="w-full bg-[#414141] py-8 px-4 sm:px-6 md:px-10 lg:px-20">
                {/* Title Section */}
                <div className="mb-6 md:mb-8">
                    <p className="text-[#FECC39] font-wix font-bold mb-2">{t("tagline")}</p>
                    <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-[40px] leading-tight max-w-[600px] whitespace-normal md:whitespace-nowrap" style={{ fontWeight: 600 }}>
                        {t("title")}
                    </h1>
                </div>

                <SelectedFiltersBar
                    chips={selectedFilterChips}
                    onRemove={handleRemoveFilter}
                    onClearAll={handleClearAllFilters}
                />

                {/* Filters and FAQ Section */}
                <div className="flex flex-col lg:flex-row gap-4 w-full">
                    {/* Left Side - Filters */}
                    <FilterSection
                        key={selectedCategory}
                        filters={faqFilters}
                        initialSelectedFilters={initialSelectedFilters}
                        onFilterChange={handleFilterChange}
                    />

                    {/* Right Side - FAQ List */}
                    <div className="flex-1 w-full">
                        {isLoading ? (
                            <div className="w-full bg-[#343434] border border-solid border-[#272727] p-6">
                                <p className="text-white font-p1">{t("loading")}</p>
                            </div>
                        ) : (
                            <ListOfFAQ items={filteredFaq} />
                        )}
                    </div>
                </div>
            </section>

            <JoinCommunityWrapper />
           
        </>
    );
}
