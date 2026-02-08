'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SearchSection from '../../components/SearchSection';
import ServicesFilterSection from './ServicesFilterSection';
import ListOfServices, { servicesData } from './ListOfServices';
import PaginationSection from '../../components/PaginationSection';
import JoinCommunityWrapper from '../../common_elements/JoinCommunityWrapper';


export default function ServicesPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(servicesData.length / itemsPerPage);

    return (
        <div className="min-h-screen bg-[#414141]">
            <Header />
            
            <SearchSection />

            <div className="flex gap-4 p-4">
                {/* Filters sidebar */}
                <ServicesFilterSection />

                {/* Main content */}
                <div className="flex-1">
                    <ListOfServices currentPage={currentPage} itemsPerPage={itemsPerPage} />
                </div>
            </div>

             <PaginationSection
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />

            <JoinCommunityWrapper />
            
            <Footer />
        </div>
    );
}
