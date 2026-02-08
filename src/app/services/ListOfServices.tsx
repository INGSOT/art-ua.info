'use client';

import ServiceCard from './ServiceCard';
import { servicesData } from '../../data/servicesData';

interface ListOfServicesProps {
    currentPage: number;
    itemsPerPage?: number;
}

export default function ListOfServices({ currentPage, itemsPerPage = 6 }: ListOfServicesProps) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentServices = servicesData.slice(startIndex, endIndex);

    return (
        <div className="flex flex-col gap-4">
            {currentServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
            ))}
        </div>
    );
}
