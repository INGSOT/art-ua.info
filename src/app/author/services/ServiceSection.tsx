"use client";

import Image from "next/image";

interface ServiceSectionProps {
  image: string;
  buttonLabel: string;
  title: string;
}

export default function ServiceSection({
  image,
  buttonLabel,
  title,
}: ServiceSectionProps) {
  return (
    <div className="flex flex-col bg-[#272727] w-full">
      {/* Image with button overlay */}
      <div className="relative w-full aspect-square">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-6 left-6">
          <button className="w-[199px] h-[100px] bg-[#FECC39] hover:bg-white transition-colors">
            <span className="font-bold text-black text-[18px]">
              {buttonLabel}
            </span>
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 py-6">
        <h5 className="font-bold text-white text-[20px] md:text-[24px] lg:text-[30px] leading-[var(--h5-line-height)] font-h5 tracking-[var(--h5-letter-spacing)] [font-style:var(--h5-font-style)] font-[600]">
          {title}
        </h5>
      </div>

      {/* Order button */}
      <button className="group flex items-stretch h-[60px] bg-[#FECC39] hover:bg-white transition-colors w-full">
        <span className="flex items-center justify-center flex-1 px-6 font-button font-bold text-[#343434] text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)]">
          Замовити послугу
        </span>
        <div className="flex items-center justify-center w-[60px] border-l border-[#343434]">
          <Image
            src="/grey_triangle_right.svg"
            alt="Arrow"
            width={24}
            height={24}
          />
        </div>
      </button>
    </div>
  );
}
