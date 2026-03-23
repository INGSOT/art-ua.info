"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { myServices, servicesTexts } from "../../../data/profileData";

export default function Services() {
  const router = useRouter();

  const handleAddClick = () => {
    router.push("/profile/services/new");
  };

  const handleEditClick = () => {
    router.push("/profile/services/edit");
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
          <div key={service.id} className="flex flex-col bg-[#272727] w-full">
            {/* Image with button overlay */}
            <div className="relative w-full aspect-square">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-6 left-6">
                <button className="w-[199px] h-[100px] bg-[#FECC39] hover:bg-white transition-colors">
                  <span className="font-bold text-black text-[18px]">
                    {service.buttonLabel}
                  </span>
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="px-6 py-6">
              <h5 className="font-bold text-white text-[20px] md:text-[24px] lg:text-[30px] leading-[var(--h5-line-height)] font-h5 tracking-[var(--h5-letter-spacing)] [font-style:var(--h5-font-style)] font-[600]">
                {service.title}
              </h5>
            </div>

            {/* Edit button */}
            <button
              onClick={handleEditClick}
              className="group flex items-stretch h-[60px] bg-[#FECC39] hover:bg-white transition-colors w-full"
            >
              <span className="flex items-center justify-center flex-1 px-6 font-button font-bold text-[#343434] text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)]">
                {servicesTexts.editServiceButton}
              </span>
              <div className="flex items-center justify-center w-[60px] border-l border-[#343434]">
                <Image
                  src="/edit.svg"
                  alt="Edit"
                  width={24}
                  height={24}
                />
              </div>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
