"use client";

import Image from "next/image";
import { useAuthorProfile } from "../../AuthorProfileContext";

export default function Photo() {
    const { serviceDetailsData } = useAuthorProfile();
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
