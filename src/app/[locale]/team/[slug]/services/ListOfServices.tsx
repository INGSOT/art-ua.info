"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ServiceCard from "../../../../../components/ServiceCard";
import { publicServicesAPI, type PublicService } from "../../../../../lib/api/publicServices";
import { useTeamProfile } from "../../TeamProfileContext";

const FALLBACK_IMAGE = "/masks.svg";

function formatOverlayLabel(service: PublicService, negotiablePrice: string, priceFromPrefix: string): string {
  if (service.price === null) return negotiablePrice;
  return `${service.priceFrom ? priceFromPrefix : ""}${service.price} ${service.currency ?? ""}`.trim();
}

export default function ListOfServices() {
  const t = useTranslations("Team.services");
  const { slug, loading: teamLoading, notFound } = useTeamProfile();
  const [teamServices, setTeamServices] = useState<PublicService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (teamLoading || notFound) return;
    let ignore = false;

    (async () => {
      setLoading(true);
      try {
        const result = await publicServicesAPI.browse({
          performer_slug: slug,
          performer_type: "team",
          per_page: 50,
        });
        if (!ignore) setTeamServices(result.data);
      } catch (error) {
        if (!ignore) {
          console.error(`Failed to load services for team "${slug}":`, error);
          setTeamServices([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [slug, teamLoading, notFound]);

  if (notFound) {
    return null;
  }

  if (teamLoading || loading) {
    return (
      <section className="w-full bg-[#414141] py-8 md:py-12 lg:py-16 min-h-[200px] flex items-center justify-center">
        <p className="text-white text-lg">{t("loading")}</p>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#414141] py-8 md:py-12 lg:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-4 lg:gap-8 px-4 md:px-[30px] lg:pl-[75px] lg:pr-[75px]">
        {teamServices.map((service) => (
          <ServiceCard
            key={service.id}
            image={service.image ?? FALLBACK_IMAGE}
            overlayButtonLabel={formatOverlayLabel(service, t("negotiablePrice"), t("priceFromPrefix"))}
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
