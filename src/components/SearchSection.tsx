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

export default function SearchSection() {
    const pathname = usePathname();
    const placeholder = PLACEHOLDER_BY_PATH[pathname] ?? 'Пошук';

    return (
        <section className="w-full bg-[#414141] flex justify-center items-center py-4 md:py-8 px-4 md:px-0">
            <div className="relative w-full md:w-[600px] h-[60px]">
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full h-full bg-[#343434] text-white placeholder-gray-400 px-6 pr-16 rounded-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Image
                        src="/search.svg"
                        alt="Search"
                        width={24}
                        height={24}
                    />
                </div>
            </div>
        </section>
    )
}