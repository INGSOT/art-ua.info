'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SearchSection from '../../components/SearchSection';
import ServicesFilterSection from './ServicesFilterSection';
import ListOfServices from './ListOfServices';
import { CurrencyCode, ServicePerformerType, servicesData } from '../../data/servicesData';
import { servicesFilters } from '../../components/filters/filterConfig';
import PaginationSection from '../../components/PaginationSection';
import JoinCommunityWrapper from '../../components/JoinCommunityWrapper';


export default function ServicesPage() {
    const MAX_PRICE = 1000000;
    type PerformerFilter = ServicePerformerType | 'all';
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
    const performerParam = searchParams.get('performer');
    const selectedLocation = searchParams.get('location')?.trim() ?? '';
    const searchQueryParam = searchParams.get('search') ?? '';
    const selectedCurrency: CurrencyCode | null =
        selectedCurrencyParam && allowedCurrencyCodes.includes(selectedCurrencyParam as CurrencyCode)
            ? (selectedCurrencyParam as CurrencyCode)
            : null;
    const selectedPerformerFilter: PerformerFilter =
        performerParam === 'artist'
            ? 'artist'
            : performerParam === 'team'
                ? 'team'
                : 'all';
    const hasPriceFilter = searchParams.has('price_min') || searchParams.has('price_max');
    const priceMinParam = searchParams.get('price_min');
    const priceMaxParam = searchParams.get('price_max');
    const rawPriceMin = priceMinParam === null ? NaN : Number(priceMinParam);
    const rawPriceMax = priceMaxParam === null ? NaN : Number(priceMaxParam);
    const selectedPriceMin = Number.isFinite(rawPriceMin) ? Math.max(0, Math.min(rawPriceMin, MAX_PRICE)) : 0;
    const selectedPriceMax = Number.isFinite(rawPriceMax)
        ? Math.max(selectedPriceMin, Math.min(rawPriceMax, MAX_PRICE))
        : MAX_PRICE;
    const [searchInput, setSearchInput] = useState(searchQueryParam);

    useEffect(() => {
        setSearchInput(searchQueryParam);
    }, [searchQueryParam]);

    const initialSelectedFilters: Record<string, boolean> = (() => {
        const base: Record<string, boolean> = {
            all: false,
            artists: false,
            teams: false,
        };

        if (selectedPerformerFilter === 'artist') {
            base.artists = true;
        } else if (selectedPerformerFilter === 'team') {
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
        const artistsSelected = !!filters['artists'];
        const teamsSelected = !!filters['teams'];
        const allSelected = !!filters['all'];

        let nextPerformerFilter: PerformerFilter = 'all';

        if (artistsSelected && !teamsSelected && !allSelected) {
            nextPerformerFilter = 'artist';
        } else if (teamsSelected && !artistsSelected && !allSelected) {
            nextPerformerFilter = 'team';
        }

        const selectedIds = artItems
            .map((item) => item.id)
            .filter((id) => !!filters[id]);

        const params = new URLSearchParams(searchParams.toString());
        if (nextPerformerFilter === 'artist') {
            params.set('performer', 'artist');
        } else if (nextPerformerFilter === 'team') {
            params.set('performer', 'team');
        } else {
            params.delete('performer');
        }
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

    const handleLocationSearch = (location: string) => {
        setCurrentPage(1);
        const params = new URLSearchParams(searchParams.toString());
        const normalizedLocation = location.trim();

        if (normalizedLocation) {
            params.set('location', normalizedLocation);
        } else {
            params.delete('location');
        }

        const search = params.toString();
        router.push(search ? `${pathname}?${search}` : pathname, { scroll: false });
    };

    const handleSearch = () => {
        setCurrentPage(1);
        const params = new URLSearchParams(searchParams.toString());
        const trimmedValue = searchInput.trim();

        if (trimmedValue) {
            params.set('search', trimmedValue);
        } else {
            params.delete('search');
        }

        const search = params.toString();
        router.push(search ? `${pathname}?${search}` : pathname, { scroll: false });
    };

    const handleClearSearch = () => {
        setCurrentPage(1);
        setSearchInput('');
        const params = new URLSearchParams(searchParams.toString());
        params.delete('search');

        const search = params.toString();
        router.push(search ? `${pathname}?${search}` : pathname, { scroll: false });
    };

    const servicesByPerformer = selectedPerformerFilter === 'all'
        ? servicesData
        : servicesData.filter((service) => service.performerType === selectedPerformerFilter);
    const servicesByCategory = selectedArtCategoryIds.length
        ? servicesByPerformer.filter((service) => selectedArtCategoryIds.includes(service.artSubCategory))
        : servicesByPerformer;
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

    const filteredByLocationServices = selectedLocation
        ? filteredByPriceServices.filter((service) =>
              service.location.toLowerCase().includes(selectedLocation.toLowerCase())
          )
        : filteredByPriceServices;
    const normalizedSearchQuery = searchQueryParam.trim().toLowerCase();
    const filteredBySearchServices = normalizedSearchQuery
        ? filteredByLocationServices.filter((service) => {
              const titleMatch = service.title.toLowerCase().includes(normalizedSearchQuery);
              const descriptionMatch = service.description.toLowerCase().includes(normalizedSearchQuery);
              const authorOrTeamMatch = service.authorName.toLowerCase().includes(normalizedSearchQuery);

              return titleMatch || descriptionMatch || authorOrTeamMatch;
          })
        : filteredByLocationServices;

    const hasResults = filteredBySearchServices.length > 0;
    const totalPages = hasResults ? Math.ceil(filteredBySearchServices.length / itemsPerPage) : 0;

    return (
        <div className="min-h-screen bg-[#414141]">
            <Header />

            <SearchSection value={searchInput} onChange={setSearchInput} onSearch={handleSearch} />

            {normalizedSearchQuery && (
                <div className="bg-[#414141] flex flex-col items-center justify-center pt-4 pb-6 px-4">
                    <p className="text-white text-center font-wix text-[18px] leading-[24px]">
                        Результат пошуку
                    </p>
                </div>
            )}
            {normalizedSearchQuery && !hasResults && (
                <div className="bg-[#414141] flex flex-col items-center justify-center pb-8 px-4">
                    <button
                        type="button"
                        onClick={handleClearSearch}
                        className="mb-6 flex items-center justify-center"
                    >
                        <img src="/yellow_cross.svg" alt="Очистити пошук" className="w-8 h-8 md:w-9 md:h-9" />
                    </button>
                    <h2 className="mt-2 text-white text-xl md:text-3xl font-bold text-center max-w-[800px]">
                        Нічого не знайдено. Спробуйте іншу назву проєкту або автора.
                    </h2>
                </div>
            )}

            {!(normalizedSearchQuery && !hasResults) && (
                <div className="flex gap-4 p-4 pl-8">
                    {/* Filters sidebar */}
                    <ServicesFilterSection
                        key={`services-filters-${selectedPerformerFilter}-${selectedArtCategoryIds.slice().sort().join(',') || 'all'}`}
                        onFilterChange={handleFilterChange}
                        initialSelectedFilters={initialSelectedFilters}
                        selectedCurrency={selectedCurrency}
                        onCurrencyChange={handleCurrencyChange}
                        initialMinPrice={selectedPriceMin}
                        initialMaxPrice={selectedPriceMax}
                        onPriceApply={handlePriceApply}
                        initialLocationSearch={selectedLocation}
                        onLocationSearch={handleLocationSearch}
                    />

                    {/* Main content */}
                    <div className="flex-1">
                        <ListOfServices
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            services={filteredBySearchServices}
                        />
                    </div>
                </div>
            )}

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
