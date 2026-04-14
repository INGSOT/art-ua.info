"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getServicePageData } from "../../../../../data/servicesData";

export default function Photo() {
    const params = useParams<{ slug?: string }>();
    const serviceDetailsData = useMemo(() => {
        const routeSlug = typeof params?.slug === "string" ? params.slug : undefined;
        return getServicePageData(routeSlug);
    }, [params]);

    return (
        <div className="w-full lg:w-1/2 flex flex-col">
            {/* Photo */}
            <div className="relative w-full aspect-[512/512]">
                <Image
                    src={serviceDetailsData.photo}
                    alt="Service"
                    fill
                    className="object-cover"
                />
            </div>
            {/* Background below photo */}
            <div className="w-full flex-1 bg-[#414141]"></div>
        </div>
    );
}
