'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

const PLACEHOLDER_BY_PATH: Record<string, string> = {
    '/authors': 'Пошук авторів',
    '/catalogs': 'Пошук каталогів',
    '/projects': 'Пошук проєктів',
    '/news_events': 'Пошук новин та подій',
    '/services': 'Пошук послуг',
};

interface SearchSectionProps {
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: () => void;
    placeholder?: string;
    maxWidthPx?: number;
}

export default function SearchSection({
    value,
    onChange,
    onSearch,
    placeholder: placeholderProp,
    maxWidthPx,
}: SearchSectionProps) {
    const pathname = usePathname();
    const placeholder = placeholderProp ?? PLACEHOLDER_BY_PATH[pathname] ?? 'Пошук';

    return (
        <section className="w-full bg-[#414141] flex justify-center items-center py-4 md:py-8 px-4 md:px-0">
            <div
                className="relative w-full h-[60px]"
                style={{ maxWidth: maxWidthPx ? `${maxWidthPx}px` : '600px' }}
            >
                <input
                    type="text"
                    placeholder={placeholder}
                    className="font-wix w-full h-full bg-[#343434] text-white placeholder-[#A0A0A0] px-6 pr-16 rounded-none"
                    value={value ?? ''}
                    onChange={(event) => onChange?.(event.target.value)}
                />
                <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center"
                    onClick={onSearch}
                >
                    <Image
                        src="/search.svg"
                        alt="Search"
                        width={24}
                        height={24}
                    />
                </button>
            </div>
        </section>
    )
}