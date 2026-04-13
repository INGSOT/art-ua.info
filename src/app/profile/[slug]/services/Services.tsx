"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import ServiceCard from "../../../../components/ServiceCard";
import { servicesTexts } from "../../../../data/profileData";
import { getMyServicesByAuthorId } from "../../../../data/servicesData";
import { withProfileId } from "../../../../lib/authorQuery";
import { useProfileView } from "../../ProfileViewContext";

export default function Services() {
  const router = useRouter();
  const { id: profileId, slug } = useProfileView();
  const myServices = getMyServicesByAuthorId(profileId);

  const handleAddClick = () => {
    router.push(withProfileId("/profile/services/new", slug));
  };

  const handleEditClick = () => {
    router.push(withProfileId("/profile/services/edit", slug));
  };

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
            key={service.id}
            image={service.image}
            overlayButtonLabel={service.buttonLabel}
            title={service.title}
            footer={{
              variant: "edit",
              onClick: handleEditClick,
              label: servicesTexts.editServiceButton,
            }}
          />
        ))}
      </div>
    </section>
  );
}
