'use client';

import Image from 'next/image';
import ServiceCard from './ServiceItem';
import { ServiceItemData } from '../../data/servicesData';

interface ListOfServicesProps {
    currentPage: number;
    services: ServiceItemData[];
    itemsPerPage?: number;
}

export default function ListOfServices({ currentPage, services, itemsPerPage = 6 }: ListOfServicesProps) {
    if (services.length === 0) {
        return (
            <div className="w-full min-h-[420px] flex flex-col items-center justify-center gap-8">
                <p className="font-wix text-white text-lg md:text-2xl">Послуг не знайдено</p>
                <Image src="/masks.svg" alt="Послуг не знайдено" width={380} height={285} priority />
            </div>
        );
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentServices = services.slice(startIndex, endIndex);

    return (
        <div className="flex flex-col gap-4">
            {currentServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
            ))}
        </div>
    );
}
