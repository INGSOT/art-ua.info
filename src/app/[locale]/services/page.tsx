'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import SearchSection from '../../../components/SearchSection';
import ServicesFilterSidebar from './ServicesFilterSidebar';
import FiltersButton from '../../../components/filters/FiltersButton';
import SelectedFiltersBar from '../../../components/filters/SelectedFiltersBar';
import { formatPriceRange } from '../../../components/filters/filterChipUtils';
import { FilterChip } from '../../../components/filters/filterChipUtils';
import ListOfServices from './ListOfServices';
import {
    publicServicesAPI,
    type PublicService,
    type ServiceCurrency,
    type ServicesListFilters,
} from '../../../lib/api/publicServices';
import PaginationSection from '../../../components/PaginationSection';
import JoinCommunityWrapper from '../../../components/JoinCommunityWrapper';
import { localeToApiLanguage, type Locale } from '../../../i18n/routing';

const ITEMS_PER_PAGE = 6;
const MAX_PRICE = 1000000;
const DEFAULT_FILTERS: ServicesListFilters = { categories: [] };
const ALLOWED_CURRENCIES: ServiceCurrency[] = ['UAH', 'USD', 'EUR'];

export default function ServicesPage() {
    const t = useTranslations('Services.list');
    const locale = useLocale() as Locale;
    const language = localeToApiLanguage(locale);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const searchQueryParam = searchParams.get('search') ?? '';
    const subcategoryParam = searchParams.get('art_subcategory') ?? '';
    const selectedSubcategories = subcategoryParam ? subcategoryParam.split(',').filter(Boolean) : [];
    const currencyParam = searchParams.get('currency');
    const selectedCurrency: ServiceCurrency | null =
        currencyParam && ALLOWED_CURRENCIES.includes(currencyParam as ServiceCurrency)
            ? (currencyParam as ServiceCurrency)
            : null;
    const priceMinParam = searchParams.get('price_min');
    const priceMaxParam = searchParams.get('price_max');
    const hasPriceFilter = priceMinParam !== null || priceMaxParam !== null;
    const initialMinPrice = priceMinParam ? Math.max(0, Math.min(Number(priceMinParam), MAX_PRICE)) : 0;
    const initialMaxPrice = priceMaxParam ? Math.max(0, Math.min(Number(priceMaxParam), MAX_PRICE)) : MAX_PRICE;
    const selectedLocation = searchParams.get('location')?.trim() ?? '';
    const currentPage = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);

    const [searchInput, setSearchInput] = useState(searchQueryParam);
    const [locationInput, setLocationInput] = useState(selectedLocation);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const [services, setServices] = useState<PublicService[]>([]);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: ITEMS_PER_PAGE, total: 0 });
    const [filtersData, setFiltersData] = useState<ServicesListFilters>(DEFAULT_FILTERS);
    const [loading, setLoading] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        setSearchInput(searchQueryParam);
    }, [searchQueryParam]);

    useEffect(() => {
        setLocationInput(selectedLocation);
    }, [selectedLocation]);

    useEffect(() => {
        let ignore = false;

        const fetchServices = async () => {
            setLoading(true);
            try {
                const result = await publicServicesAPI.browse(language, {
                    page: currentPage,
                    per_page: ITEMS_PER_PAGE,
                    ...(selectedSubcategories.length ? { art_subcategory: selectedSubcategories.join(',') } : {}),
                    ...(selectedCurrency ? { currency: selectedCurrency } : {}),
                    ...(priceMinParam ? { price_min: priceMinParam } : {}),
                    ...(priceMaxParam ? { price_max: priceMaxParam } : {}),
                    ...(selectedLocation ? { location: selectedLocation } : {}),
                    ...(searchQueryParam ? { search: searchQueryParam } : {}),
                });

                if (ignore) return;
                setServices(result.data);
                setMeta(result.meta);
                setFiltersData(result.filters);
            } catch (error) {
                if (ignore) return;
                console.error('Failed to load services:', error);
                setServices([]);
            } finally {
                if (!ignore) {
                    setLoading(false);
                    setHasLoaded(true);
                }
            }
        };

        fetchServices();
        return () => {
            ignore = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, subcategoryParam, selectedCurrency, priceMinParam, priceMaxParam, selectedLocation, searchQueryParam, language]);

    const pushParams = (mutate: (params: URLSearchParams) => void, resetPage = true) => {
        const params = new URLSearchParams(searchParams.toString());
        mutate(params);
        if (resetPage) {
            params.delete('page');
        }
        const search = params.toString();
        router.push(search ? `${pathname}?${search}` : pathname, { scroll: false });
    };

    const handleSubcategoryToggle = (slug: string) => {
        pushParams((params) => {
            const next = selectedSubcategories.includes(slug)
                ? selectedSubcategories.filter((s) => s !== slug)
                : [...selectedSubcategories, slug];
            if (next.length) {
                params.set('art_subcategory', next.join(','));
            } else {
                params.delete('art_subcategory');
            }
        });
    };

    const handleCurrencyChange = (currency: ServiceCurrency | null) => {
        pushParams((params) => {
            if (currency) {
                params.set('currency', currency);
            } else {
                params.delete('currency');
            }
        });
    };

    const applyPrice = (minPrice: number, maxPrice: number) => {
        pushParams((params) => {
            if (minPrice > 0) {
                params.set('price_min', String(minPrice));
            } else {
                params.delete('price_min');
            }
            if (maxPrice < MAX_PRICE) {
                params.set('price_max', String(maxPrice));
            } else {
                params.delete('price_max');
            }
        });
    };

    const applyLocation = (value?: string) => {
        const trimmed = (value ?? locationInput).trim();
        pushParams((params) => {
            if (trimmed) {
                params.set('location', trimmed);
            } else {
                params.delete('location');
            }
        });
    };

    const handleSelectLocation = (city: string) => {
        setLocationInput(city);
        applyLocation(city);
    };

    const handlePageChange = (page: number) => {
        pushParams((params) => {
            if (page > 1) {
                params.set('page', String(page));
            } else {
                params.delete('page');
            }
        }, false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearch = () => {
        pushParams((params) => {
            const trimmedValue = searchInput.trim();
            if (trimmedValue) {
                params.set('search', trimmedValue);
            } else {
                params.delete('search');
            }
        });
    };

    const handleClearSearch = () => {
        setSearchInput('');
        pushParams((params) => {
            params.delete('search');
        });
    };

    const handleClearAllFilters = () => {
        pushParams((params) => {
            params.delete('art_subcategory');
            params.delete('currency');
            params.delete('price_min');
            params.delete('price_max');
            params.delete('location');
        });
    };

    const subcategoryNameMap = Object.fromEntries(
        filtersData.categories.flatMap((c) =>
            c.subcategories.length ? c.subcategories.map((s) => [s.slug, s.name]) : [[c.slug, c.name]]
        )
    );

    const selectedFilterChips: FilterChip[] = [
        ...selectedSubcategories.map((slug) => ({ id: slug, label: subcategoryNameMap[slug] ?? slug })),
        ...(selectedCurrency ? [{ id: 'currency', label: selectedCurrency }] : []),
        ...(hasPriceFilter
            ? [{
                  id: 'price',
                  label: formatPriceRange(
                      priceMinParam ? Number(priceMinParam) : 0,
                      priceMaxParam ? Number(priceMaxParam) : MAX_PRICE
                  ),
              }]
            : []),
        ...(selectedLocation ? [{ id: 'location', label: selectedLocation }] : []),
    ];

    const handleRemoveFilter = (chipId: string) => {
        if (chipId === 'currency') {
            handleCurrencyChange(null);
        } else if (chipId === 'price') {
            pushParams((params) => {
                params.delete('price_min');
                params.delete('price_max');
            });
        } else if (chipId === 'location') {
            pushParams((params) => {
                params.delete('location');
            });
        } else {
            handleSubcategoryToggle(chipId);
        }
    };

    const normalizedSearchQuery = searchQueryParam.trim();
    const noSearchResults = hasLoaded && !loading && normalizedSearchQuery && services.length === 0;

    const sidebar = (
        <ServicesFilterSidebar
            categories={filtersData.categories}
            selectedSubcategories={selectedSubcategories}
            onToggleSubcategory={handleSubcategoryToggle}
            selectedCurrency={selectedCurrency}
            onCurrencyChange={handleCurrencyChange}
            initialMinPrice={initialMinPrice}
            initialMaxPrice={initialMaxPrice}
            onApplyPrice={applyPrice}
            locationInput={locationInput}
            onLocationInputChange={setLocationInput}
            onApplyLocation={() => applyLocation()}
            onSelectLocation={handleSelectLocation}
        />
    );

    return (
        <div className="min-h-screen bg-[#414141]">
            <Header />

            <SearchSection value={searchInput} onChange={setSearchInput} onSearch={handleSearch} />

            {normalizedSearchQuery && (
                <div className="bg-[#414141] flex flex-col items-center justify-center pt-4 pb-6 px-4">
                    <p className="text-white text-center font-wix text-[18px] leading-[24px]">
                        {t('searchResultsLabel')}
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
                        <img src="/yellow_cross.svg" alt={t('clearSearchAlt')} className="w-8 h-8 md:w-9 md:h-9" />
                    </button>
                    <h2 className="mt-2 text-white text-xl md:text-3xl font-bold text-center max-w-[800px]">
                        {t('noResults')}
                    </h2>
                </div>
            )}

            {!noSearchResults && (
                <div className="flex flex-col gap-4 p-4 md:px-6 lg:px-20 lg:pb-20 lg:gap-[30px]">
                    <div className="sticky top-0 z-40 bg-[#414141] py-2 -mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-20 lg:px-20">
                        <div className="flex items-center justify-between gap-2 lg:hidden mb-3">
                            <FiltersButton
                                onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
                                isActive={isMobileFiltersOpen}
                                selectedCount={selectedFilterChips.length}
                            />
                        </div>

                        <SelectedFiltersBar
                            chips={selectedFilterChips}
                            onRemove={handleRemoveFilter}
                            onClearAll={handleClearAllFilters}
                        />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-[30px]">
                        <div className="hidden lg:block">{sidebar}</div>
                        {isMobileFiltersOpen && <div className="lg:hidden">{sidebar}</div>}

                        <div className="flex-1 w-full">
                            {loading && !hasLoaded ? (
                                <div className="w-full min-h-[420px] flex items-center justify-center">
                                    <p className="font-wix text-white text-lg md:text-2xl">{t('loading')}</p>
                                </div>
                            ) : (
                                <ListOfServices services={services} />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {meta.last_page > 1 && (
                <PaginationSection
                    currentPage={meta.current_page}
                    totalPages={meta.last_page}
                    onPageChange={handlePageChange}
                />
            )}

            <JoinCommunityWrapper />

            <Footer />
        </div>
    );
}
