"use client";

import { serviceDetailsData } from "../../../../data/profileData";

export default function ServiceDescription() {
    return (
        <div className="w-full bg-[#FFFCF5] p-8 lg:p-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
                <span className="text-black">{serviceDetailsData.breadcrumb.authorName}</span>
                <span className="text-black">/</span>
                <span className="text-black">{serviceDetailsData.breadcrumb.section}</span>
            </div>

            {/* Title */}
            <h1 className="text-black font-bold text-[40px] leading-tight mb-6" style={{ fontWeight: 600 }}>
                {serviceDetailsData.title}
            </h1>

            {/* Price Button */}
            <button className="bg-[#FECC39] text-black font-bold px-6 py-3 mb-6 flex items-center justify-center whitespace-nowrap" style={{ width: '197px', height: '48px', fontWeight: 600 }}>
                {serviceDetailsData.priceLabel}
            </button>

            {/* Description */}
            <div className="text-black space-y-4">
                {serviceDetailsData.description.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        </div>
    );
}
