"use client";

import ServiceCard from "../../../components/ServiceCard";
import { getMyServicesByAuthorId } from "../../../data/servicesData";
import { useAuthorProfile } from "../AuthorProfileContext";
import { withAuthorId } from "../../../lib/authorQuery";

export default function ListOfServices() {
    const { id: authorId, slug } = useAuthorProfile();
    const myServices = getMyServicesByAuthorId(authorId);
    return (
        <section className="w-full bg-[#414141] py-8 md:py-12 lg:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4 lg:gap-8 px-4 md:px-[30px] lg:pl-[75px] lg:pr-[75px]">
                {myServices.map((service) => (
                    <ServiceCard
                        key={service.id}
                        image={service.image}
                        overlayButtonLabel={service.buttonLabel}
                        title={service.title}
                        footer={{
                          variant: "order",
                          href: withAuthorId("/author/services/service", slug),
                        }}
                    />
                ))}
            </div>
        </section>
    );
}