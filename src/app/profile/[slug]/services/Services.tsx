"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ServiceCard from "../../../../components/ServiceCard";
import EmptyState from "../../../../components/ui/empty-state";
import { servicesTexts, serviceEmptyState } from "../../../../data/profileData";
import { myServicesAPI, type MyService } from "../../../../lib/api/myServices";
import { withProfileId } from "../../../../lib/authorQuery";
import { useProfileView } from "../../ProfileViewContext";

function formatOverlayLabel(service: MyService): string {
  if (service.price === null) return "Договірна ціна";
  return `${service.price} ${service.currency ?? ""}`.trim();
}

export default function Services() {
  const router = useRouter();
  const { slug } = useProfileView();
  const [myServices, setMyServices] = useState<MyService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    myServicesAPI
      .list()
      .then((data) => {
        if (!cancelled) setMyServices(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddClick = () => {
    router.push(withProfileId("/profile/services/new", slug));
  };

  const handleEditClick = (serviceSlug: string) => {
    router.push(`${withProfileId("/profile/services/edit", slug)}?slug=${serviceSlug}`);
  };

  if (loading) {
    return <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px] min-h-[400px]" />;
  }

  if (myServices.length === 0) {
    return (
      <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px]">
        <EmptyState
          title={serviceEmptyState.message}
          description={serviceEmptyState.subMessage}
          buttonText={serviceEmptyState.createButtonText}
          onButtonClick={handleAddClick}
        />
      </section>
    );
  }

  return (
    <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px]">
      {/* Add Service Button */}
      <div className="mb-8 flex justify-center">
        <button
          onClick={handleAddClick}
          className="h-[60px] flex items-stretch transition-all duration-300 rounded-none bg-[#FECC39] hover:bg-white w-full md:w-[320px]"
        >
          <span className="flex items-center justify-center flex-1 px-6 font-bold text-black whitespace-nowrap">
            {servicesTexts.addServiceButton}
          </span>
          <div className="flex items-center justify-center w-[60px] flex-shrink-0 border-l border-black">
            <Image src="/plus.svg" alt="Plus" width={24} height={24} />
          </div>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4 lg:gap-8">
        {myServices.map((service) => (
          <ServiceCard
            key={service.slug}
            image={service.imageUrl ?? "/megaphone.svg"}
            overlayButtonLabel={formatOverlayLabel(service)}
            title={service.title}
            footer={{
              variant: "edit",
              onClick: () => handleEditClick(service.slug),
              label: servicesTexts.editServiceButton,
            }}
          />
        ))}
      </div>
    </section>
  );
}
