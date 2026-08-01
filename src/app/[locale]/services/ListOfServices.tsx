'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ServiceCard from './ServiceItem';
import type { PublicService } from '../../../lib/api/publicServices';

interface ListOfServicesProps {
    services: PublicService[];
}

export default function ListOfServices({ services }: ListOfServicesProps) {
    const t = useTranslations('Services.list');

    if (services.length === 0) {
        return (
            <div className="w-full min-h-[420px] flex flex-col items-center justify-center gap-8">
                <p className="font-wix text-white text-lg md:text-2xl">{t('empty')}</p>
                <Image src="/masks.svg" alt={t('empty')} width={380} height={285} priority />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
            ))}
        </div>
    );
}
