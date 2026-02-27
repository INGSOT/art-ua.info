"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import JoinCommunityWrapper from "../../common_elements/JoinCommunityWrapper";
import SearchSection from "../../components/SearchSection";
import FilterSection from "../../components/filters/FilterSection";
import { faqFilters } from "../../components/filters/filterConfig";
import ListOfFAQ from "./ListOfFAQ";

export default function FAQPage() {
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
                    <FilterSection filters={faqFilters} />

                    {/* Right Side - FAQ List */}
                    <div className="flex-1 w-full">
                        <ListOfFAQ />
                    </div>
                </div>
            </section>

            <JoinCommunityWrapper />
           
        </>
    );
}
