'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SearchSection from '../../components/SearchSection';
import ServicesFilterSection from './ServicesFilterSection';
import ListOfServices from './ListOfServices';
import { CurrencyCode, servicesData } from '../../data/servicesData';
import { servicesFilters } from '../../components/filters/filterConfig';
import PaginationSection from '../../components/PaginationSection';
import JoinCommunityWrapper from '../../components/JoinCommunityWrapper';


export default function ServicesPage() {
    const MAX_PRICE = 1000000;
    const [currentPage, setCurrentPage] = useState(1);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const itemsPerPage = 6;
    const artFieldsSection = servicesFilters.find((section) => section.id === 'art-fields');
    const artItems = artFieldsSection?.subsections?.flatMap((sub) => sub.items ?? []) ?? [];

    const allowedArtCategoryIds = new Set(artItems.map((item) => item.id));
    const allowedCurrencyCodes: CurrencyCode[] = ['UAH', 'USD', 'EUR'];

    const selectedArtCategoryIds = searchParams
        .getAll('art_subcategory')
        .filter((value) => allowedArtCategoryIds.has(value));
    const selectedCurrencyParam = searchParams.get('currency');
    const selectedCurrency: CurrencyCode | null =
        selectedCurrencyParam && allowedCurrencyCodes.includes(selectedCurrencyParam as CurrencyCode)
            ? (selectedCurrencyParam as CurrencyCode)
            : null;
    const hasPriceFilter = searchParams.has('price_min') || searchParams.has('price_max');
    const priceMinParam = searchParams.get('price_min');
    const priceMaxParam = searchParams.get('price_max');
    const rawPriceMin = priceMinParam === null ? NaN : Number(priceMinParam);
    const rawPriceMax = priceMaxParam === null ? NaN : Number(priceMaxParam);
    const selectedPriceMin = Number.isFinite(rawPriceMin) ? Math.max(0, Math.min(rawPriceMin, MAX_PRICE)) : 0;
    const selectedPriceMax = Number.isFinite(rawPriceMax)
        ? Math.max(selectedPriceMin, Math.min(rawPriceMax, MAX_PRICE))
        : MAX_PRICE;

    const initialSelectedFilters: Record<string, boolean> = Object.fromEntries(
        artItems.map((item) => [item.id, selectedArtCategoryIds.includes(item.id)])
    );

    const handleFilterChange = (filters: Record<string, boolean>) => {
        setCurrentPage(1);

        const selectedIds = artItems
            .map((item) => item.id)
            .filter((id) => !!filters[id]);

        const params = new URLSearchParams(searchParams.toString());
        params.delete('art_subcategory');

        selectedIds.forEach((id) => {
            params.append('art_subcategory', id);
        });

        const search = params.toString();
        router.push(search ? `${pathname}?${search}` : pathname, { scroll: false });
    };

    const handleCurrencyChange = (currency: CurrencyCode | null) => {
        setCurrentPage(1);
        const params = new URLSearchParams(searchParams.toString());

        if (currency) {
            params.set('currency', currency);
        } else {
            params.delete('currency');
        }

        const search = params.toString();
        router.push(search ? `${pathname}?${search}` : pathname, { scroll: false });
    };

    const handlePriceApply = (minPrice: number, maxPrice: number) => {
        setCurrentPage(1);
        const params = new URLSearchParams(searchParams.toString());
        params.set('price_min', String(minPrice));
        params.set('price_max', String(maxPrice));

        const search = params.toString();
        router.push(search ? `${pathname}?${search}` : pathname, { scroll: false });
    };

    const servicesByCategory = selectedArtCategoryIds.length
        ? servicesData.filter((service) => selectedArtCategoryIds.includes(service.artSubCategory))
        : servicesData;
    const filteredServices = selectedCurrency
        ? servicesByCategory.filter((service) => service.currency === selectedCurrency)
        : servicesByCategory;
    const filteredByPriceServices = hasPriceFilter
        ? filteredServices.filter((service) => {
              if (typeof service.price !== 'number') {
                  return false;
              }

              return service.price >= selectedPriceMin && service.price <= selectedPriceMax;
          })
        : filteredServices;

    const hasResults = filteredByPriceServices.length > 0;
    const totalPages = Math.ceil(filteredByPriceServices.length / itemsPerPage);

    return (
        <div className="min-h-screen bg-[#414141]">
            <Header />
            
            <SearchSection />

            <div className="flex gap-4 p-4">
                {/* Filters sidebar */}
                <ServicesFilterSection
                    key={`services-filters-${selectedArtCategoryIds.slice().sort().join(',') || 'all'}`}
                    onFilterChange={handleFilterChange}
                    initialSelectedFilters={initialSelectedFilters}
                    selectedCurrency={selectedCurrency}
                    onCurrencyChange={handleCurrencyChange}
                    initialMinPrice={selectedPriceMin}
                    initialMaxPrice={selectedPriceMax}
                    onPriceApply={handlePriceApply}
                />

                {/* Main content */}
                <div className="flex-1">
                    <ListOfServices
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        services={filteredByPriceServices}
                    />
                </div>
            </div>

            {hasResults && (
                <PaginationSection
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            <JoinCommunityWrapper />
            
            <Footer />
        </div>
    );
}
