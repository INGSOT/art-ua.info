'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CurrencyCode, ServiceItemData } from '../../data/servicesData';

interface ServiceItemProps {
    service: ServiceItemData;
}

export default function ServiceItem({ service }: ServiceItemProps) {
    const [isHovered, setIsHovered] = useState(false);
    const formattedPrice =
        typeof service.price === 'number'
            ? service.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
            : '';
    const currencyIconByCode: Record<CurrencyCode, string> = {
        UAH: '/hryvnia.svg',
        USD: '/dollar.svg',
        EUR: '/euro.svg',
    };

    return (
        <div className="bg-[#343434] flex flex-col lg:flex-row relative">
            {/* Left side - Avatar, Image and Content */}
            <div className="flex flex-col lg:flex-row flex-1">
                {/* Avatar and Image */}
                <div className="flex flex-col w-full lg:w-[300px] flex-shrink-0">
                    {/* Author info */}
                    <div className="flex items-center gap-3 p-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
                            <Image
                                src={service.authorAvatar}
                                alt={service.authorName}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-white font-bold text-base">
                            {service.authorName}
                        </span>
                    </div>

                    {/* Service image - no padding */}
                    <div className="w-full aspect-square relative overflow-hidden">
                        <Image
                            src={service.serviceImage}
                            alt={service.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 gap-4 p-6">
                    {/* Title */}
                    <h3 className="text-white font-bold text-xl lg:text-2xl">
                        {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white text-base leading-relaxed flex-1">
                        {service.description}
                    </p>

                    {/* Price and Square button */}
                    <div className="flex items-center gap-3 w-full">
                        <button className="bg-[#FECC39] hover:bg-white text-black font-bold px-6 py-3 transition-colors">
                            {service.priceNegotiable ? (
                                'Ціна договірна'
                            ) : (
                                <span className="flex items-center gap-2">
                                    <span>{formattedPrice}</span>
                                    {service.currency && (
                                        <Image
                                            src={currencyIconByCode[service.currency]}
                                            alt={service.currency}
                                            width={28}
                                            height={28}
                                            className="-ml-3"
                                        />
                                    )}
                                </span>
                            )}
                        </button>

                        <button
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className={`ml-auto w-12 h-12 flex items-center justify-center transition-colors ${
                                isHovered ? 'bg-white' : 'bg-[#FECC39]'
                            }`}
                        >
                            <Image
                                src="/grey_triangle_right.svg"
                                alt="View"
                                width={16}
                                height={16}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
