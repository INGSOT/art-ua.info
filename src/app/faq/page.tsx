"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import JoinCommunityWrapper from "../../components/JoinCommunityWrapper";
import SearchSection from "../../components/SearchSection";
import FilterSection from "../../components/filters/FilterSection";
import { FilterSection as FilterSectionType } from "../../components/filters/filterConfig";
import ListOfFAQ from "./ListOfFAQ";
import { faqCategories, faqData } from "../../data/faqData";

export default function FAQPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const selectedCategoryParam = searchParams.get("category");
    const selectedCategory = faqCategories.includes(selectedCategoryParam || "")
        ? (selectedCategoryParam as string)
        : "Усі";

    const faqFilters = useMemo<FilterSectionType[]>(() => {
        return [
            {
                id: "categories",
                title: "Категорії",
                type: "simple",
                items: [
                    { id: "all", label: "Усі", type: "checkbox" },
                    ...faqCategories.map((category) => ({
                        id: category,
                        label: category,
                        type: "checkbox" as const,
                    })),
                ],
            },
        ];
    }, []);

    const initialSelectedFilters = useMemo<Record<string, boolean>>(() => {
        if (selectedCategory === "Усі") {
            return { all: true };
        }

        return { [selectedCategory]: true };
    }, [selectedCategory]);

    const filteredFaq = useMemo(() => {
        if (selectedCategory === "Усі") {
            return faqData;
        }

        return faqData.filter((item) => item.category === selectedCategory);
    }, [selectedCategory]);

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

    return (
        <>
            <Header isHomePage={false} />
            <SearchSection />
            
            {/* Main Content Section */}
            <section className="w-full bg-[#414141] py-8 px-4 sm:px-6 md:px-10 lg:px-20">
                {/* Title Section */}
                <div className="mb-6 md:mb-8">
                    <p className="text-[#FECC39] font-wix font-bold mb-2">Як працює платформа</p>
                    <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-[40px] leading-tight max-w-[600px] whitespace-normal md:whitespace-nowrap" style={{ fontWeight: 600 }}>
                        Часті питання
                    </h1>
                </div>

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
                        <ListOfFAQ items={filteredFaq} />
                    </div>
                </div>
            </section>

            <JoinCommunityWrapper />
           
        </>
    );
}
