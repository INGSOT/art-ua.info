"use client";

import { useEffect, useState } from "react";
import ServiceCard from "../../../../components/ServiceCard";
import { publicServicesAPI, type PublicService } from "../../../../lib/api/publicServices";
import { useAuthorProfile } from "../../AuthorProfileContext";

const FALLBACK_IMAGE = "/masks.svg";

export default function ListOfServices() {
    const { slug, loading: profileLoading, notFound } = useAuthorProfile();
    const [myServices, setMyServices] = useState<PublicService[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (profileLoading || notFound) return;
        let ignore = false;

        (async () => {
            setLoading(true);
            try {
                const result = await publicServicesAPI.browse({ performer_slug: slug, per_page: 50 });
                if (!ignore) setMyServices(result.data);
            } catch (error) {
                if (!ignore) {
                    console.error(`Failed to load services for "${slug}":`, error);
                    setMyServices([]);
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        })();

        return () => {
            ignore = true;
        };
    }, [slug, profileLoading, notFound]);

    if (notFound) {
        return null;
    }

    if (profileLoading || loading) {
        return (
            <section className="w-full bg-[#414141] py-8 md:py-12 lg:py-16 min-h-[200px] flex items-center justify-center">
                <p className="text-white text-lg">Завантаження...</p>
            </section>
        );
    }

    return (
        <section className="w-full bg-[#414141] py-8 md:py-12 lg:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-4 lg:gap-8 px-4 md:px-[30px] lg:pl-[75px] lg:pr-[75px]">
                {myServices.map((service) => (
                    <ServiceCard
                        key={service.id}
                        image={service.image ?? FALLBACK_IMAGE}
                        overlayButtonLabel="Замовити послугу"
                        title={service.title}
                        footer={{
                          variant: "order",
                          href: `/services/${service.slug}`,
                        }}
                    />
                ))}
            </div>
        </section>
    );
}
