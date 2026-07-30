'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { PublicService, ServiceCurrency } from '../../lib/api/publicServices';
import { withAuthorId, withTeamId } from '../../lib/authorQuery';

interface ServiceItemProps {
    service: PublicService;
}

export default function ServiceItem({ service }: ServiceItemProps) {
    const [isHovered, setIsHovered] = useState(false);
    const authorHref = !service.performerSlug
        ? null
        : service.performerType === 'team'
          ? withTeamId('/team/projects', service.performerSlug)
          : withAuthorId('/author/projects', service.performerSlug);
    const formattedPrice =
        typeof service.price === 'number'
            ? service.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
            : '';
    const currencyIconByCode: Record<ServiceCurrency, string> = {
        UAH: '/hryvnia.svg',
        USD: '/dollar.svg',
        EUR: '/euro.svg',
    };

    return (
        <div className="bg-[#343434] flex flex-col lg:flex-row relative w-full">
            {/* Left side - Avatar, Image and Content */}
            <div className="flex flex-col lg:flex-row flex-1">
                {/* Avatar and Image */}
                <div className="flex flex-col w-full lg:w-[300px] flex-shrink-0">
                    {/* Author info */}
                    {authorHref ? (
                        <Link href={authorHref} className="flex items-center gap-3 p-4 w-fit">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
                                <Image
                                    src={service.performerAvatar ?? ''}
                                    alt={service.performerName}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-white font-bold text-base">
                                {service.performerName}
                            </span>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-3 p-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
                                <Image
                                    src={service.performerAvatar ?? ''}
                                    alt={service.performerName}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-white font-bold text-base">
                                {service.performerName}
                            </span>
                        </div>
                    )}

                    {/* Service image - no padding */}
                    <div className="w-full aspect-square relative overflow-hidden">
                        <Image
                            src={service.image || '/masks.svg'}
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
                        <div className="bg-[#FECC39] text-black font-bold px-6 py-3">
                            {service.price === null ? (
                                'Ціна договірна'
                            ) : (
                                <span className="flex items-center gap-2">
                                    {service.priceFrom && <span>Від</span>}
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
                        </div>

                        <Link
                            href={`/services/${service.slug}`}
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
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
