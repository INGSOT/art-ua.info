"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import { useSearchParams } from "next/navigation";
import ServiceCard from "../../../../../../components/ServiceCard";
import EmptyState from "../../../../../../components/ui/empty-state";
import { myServicesAPI, type MyService } from "../../../../../../lib/api/myServices";
import { withProfileId } from "../../../../../../lib/authorQuery";
import { useProfileView } from "../../../ProfileViewContext";

function formatOverlayLabel(service: MyService, negotiablePrice: string): string {
  if (service.price === null) return negotiablePrice;
  return `${service.price} ${service.currency ?? ""}`.trim();
}

export default function TeamServices() {
  const t = useTranslations("ProfileServices.services");
  const tTeam = useTranslations("ProfileServices.team.services");
  const router = useRouter();
  const searchParams = useSearchParams();
  const teamSlug = searchParams.get("team");
  const { slug: profileSlug } = useProfileView();
  const [teamServices, setTeamServices] = useState<MyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamSlug) return;
    let cancelled = false;
    myServicesAPI
      .listForTeam(teamSlug)
      .then((data) => {
        if (!cancelled) setTeamServices(data);
      })
      .catch(() => {
        if (!cancelled) setError(tTeam("loadError"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [teamSlug]);

  if (!teamSlug) {
    return (
      <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px]">
        <p className="text-white text-center">{tTeam("teamNotFound")}</p>
      </section>
    );
  }

  const handleAddClick = () => {
    router.push(`${withProfileId("/profile/team/services/new", profileSlug)}?team=${teamSlug}`);
  };

  const handleEditClick = (serviceSlug: string) => {
    router.push(
      `${withProfileId("/profile/team/services/edit", profileSlug)}?team=${teamSlug}&slug=${serviceSlug}`
    );
  };

  if (loading) {
    return <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px] min-h-[400px]" />;
  }

  if (error) {
    return (
      <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px]">
        <p className="text-white text-center">{error}</p>
      </section>
    );
  }

  if (teamServices.length === 0) {
    return (
      <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px]">
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
    <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px]">
      <div className="mb-8 flex justify-center">
        <button
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-4 lg:gap-8">
        {teamServices.map((service) => (
          <ServiceCard
            key={service.slug}
            image={service.imageUrl ?? "/megaphone.svg"}
            overlayButtonLabel={formatOverlayLabel(service, t("negotiablePrice"))}
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
