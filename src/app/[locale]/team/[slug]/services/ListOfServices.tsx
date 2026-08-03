"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import ServiceCard from "../../../../../components/ServiceCard";
import EmptyState from "../../../../../components/ui/empty-state";
import { publicServicesAPI, type PublicService } from "../../../../../lib/api/publicServices";
import { myServicesAPI, type MyService } from "../../../../../lib/api/myServices";
import { useTeamProfile } from "../../TeamProfileContext";
import { hrefWithTeam } from "../../useCurrentTeam";
import { localeToApiLanguage, type Locale } from "../../../../../i18n/routing";

const FALLBACK_IMAGE = "/masks.svg";

function formatOverlayLabel(service: PublicService, negotiablePrice: string, priceFromPrefix: string): string {
  if (service.price === null) return negotiablePrice;
  return `${service.priceFrom ? priceFromPrefix : ""}${service.price} ${service.currency ?? ""}`.trim();
}

function formatMyOverlayLabel(service: MyService, negotiablePrice: string): string {
  if (service.price === null) return negotiablePrice;
  return `${service.price} ${service.currency ?? ""}`.trim();
}

function OwnerServices({ slug }: { slug: string }) {
  const t = useTranslations("ProfileServices.services");
  const router = useRouter();
  const [teamServices, setTeamServices] = useState<MyService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    myServicesAPI
      .listForTeam(slug)
      .then((data) => {
        if (!ignore) setTeamServices(data);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [slug]);

  const handleAddClick = () => router.push(hrefWithTeam("/team/services/new", slug));
  const handleEditClick = (serviceSlug: string) =>
    router.push(`${hrefWithTeam("/team/services/edit", slug)}?slug=${serviceSlug}`);

  if (loading) {
    return <section className="w-full bg-[#414141] py-8 md:py-12 lg:py-16 min-h-[400px]" />;
  }

  if (teamServices.length === 0) {
    return (
      <section className="w-full bg-[#414141] py-8 md:py-12 lg:py-16 px-4">
        <EmptyState
          title={t("emptyState.message")}
          description={t("emptyState.subMessage")}
          buttonText={t("emptyState.createButtonText")}
          onButtonClick={handleAddClick}
        />
      </section>
    );
  }

  return (
    <section className="w-full bg-[#414141] py-8 md:py-12 lg:py-16">
      <div className="mb-8 flex justify-center">
        <button
          type="button"
          onClick={handleAddClick}
          className="h-[60px] flex items-stretch transition-all duration-300 rounded-none bg-[#FECC39] hover:bg-white w-full md:w-[320px]"
        >
          <span className="flex items-center justify-center flex-1 px-6 font-bold text-black whitespace-nowrap">
            {t("addServiceButton")}
          </span>
          <div className="flex items-center justify-center w-[60px] flex-shrink-0 border-l border-black">
            <Image src="/plus.svg" alt="Plus" width={24} height={24} />
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-4 lg:gap-8 px-4 md:px-[30px] lg:pl-[75px] lg:pr-[75px]">
        {teamServices.map((service) => (
          <ServiceCard
            key={service.slug}
            image={service.imageUrl ?? FALLBACK_IMAGE}
            overlayButtonLabel={formatMyOverlayLabel(service, t("negotiablePrice"))}
            title={service.title}
            footer={{
              variant: "edit",
              onClick: () => handleEditClick(service.slug),
              label: t("editServiceButton"),
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default function ListOfServices() {
  const t = useTranslations("Team.services");
  const locale = useLocale() as Locale;
  const language = localeToApiLanguage(locale);
  const { slug, loading: teamLoading, notFound, isOwner } = useTeamProfile();
  const [teamServices, setTeamServices] = useState<PublicService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (teamLoading || notFound || isOwner) return;
    let ignore = false;

    (async () => {
      setLoading(true);
      try {
        const result = await publicServicesAPI.browse(language, {
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
  }, [slug, teamLoading, notFound, isOwner, language]);

  if (notFound) {
    return null;
  }

  if (teamLoading) {
    return (
      <section className="w-full bg-[#414141] py-8 md:py-12 lg:py-16 min-h-[200px] flex items-center justify-center">
        <p className="text-white text-lg">{t("loading")}</p>
      </section>
    );
  }

  if (isOwner) {
    return <OwnerServices slug={slug} />;
  }

  if (loading) {
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
