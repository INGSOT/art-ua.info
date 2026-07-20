import { FilterSection as FilterSectionType } from './filterConfig';

export interface FilterChip {
    id: string;
    label: string;
}

const DEFAULT_EXCLUDED_CHIP_IDS = new Set(['all']);

export function formatPriceRange(min: number, max: number): string {
    const formattedMin = min.toLocaleString('uk-UA');
    const formattedMax = max.toLocaleString('uk-UA');
    return `${formattedMin} - ${formattedMax}`;
}

export function buildFilterChips(
    filterSections: FilterSectionType[],
    selectedFilters: Record<string, boolean>,
    excludedItemIds: Set<string> = DEFAULT_EXCLUDED_CHIP_IDS
): FilterChip[] {
    const chips: FilterChip[] = [];

    filterSections.forEach((section) => {
        if (section.type === 'simple' && section.items) {
            const selectedItem = section.items.find(
                (item) => selectedFilters[item.id] && !excludedItemIds.has(item.id)
            );

            if (selectedItem) {
                chips.push({ id: selectedItem.id, label: selectedItem.label });
            }

            return;
        }

        if (section.type === 'nested' && section.subsections) {
            section.subsections.forEach((subsection) => {
                subsection.items.forEach((item) => {
                    if (selectedFilters[item.id]) {
                        chips.push({ id: item.id, label: item.label });
                    }
                });
            });
        }
    });

    return chips;
}

export function getClearedFiltersState(filterSections: FilterSectionType[]): Record<string, boolean> {
    const cleared: Record<string, boolean> = {};

    filterSections.forEach((section) => {
        if (section.type === 'simple' && section.items) {
            const hasAllOption = section.items.some((item) => item.id === 'all');

            section.items.forEach((item) => {
                cleared[item.id] = hasAllOption && item.id === 'all';
            });

            return;
        }

        if (section.type === 'nested' && section.subsections) {
            section.subsections.forEach((subsection) => {
                subsection.items.forEach((item) => {
                    cleared[item.id] = false;
                });
            });
        }
    });

    return cleared;
}

export function removeFilterFromState(
    chipId: string,
    selectedFilters: Record<string, boolean>,
    filterSections: FilterSectionType[]
): Record<string, boolean> {
    const newFilters = { ...selectedFilters };

    for (const section of filterSections) {
        if (section.type !== 'simple' || !section.items?.some((item) => item.id === chipId)) {
            continue;
        }

        section.items.forEach((item) => {
            newFilters[item.id] = false;
        });

        return newFilters;
    }

    newFilters[chipId] = false;
    return newFilters;
}
