"use client";

import { useState } from "react";
import Image from "next/image";
import { newProjectTexts } from "../../../data/newProjectData";

export default function SoldProject() {
  const [isSold, setIsSold] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="w-full bg-[#414141] flex flex-col items-center py-10 px-4 md:px-10 lg:px-20 border-t border-black">
      {/* Description Text */}
      <p className="text-white text-center mb-6 max-w-4xl">
        {newProjectTexts.soldProjectDescription}
      </p>

      {/* Sold Project Button */}
      <button
        type="button"
        onClick={() => setIsSold(!isSold)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center gap-3 px-6 py-4 bg-[#343434] h-[60px] w-full md:w-[320px]"
      >
        {/* Checkmark */}
        <div
          className={`w-5 h-5 flex items-center justify-center transition-colors ${
            isSold ? "bg-[#FFD700]" : "bg-[#414141]"
          }`}
        >
          <Image
            src={isHovered && !isSold ? "/yellow_check.svg" : "/grey_check.svg"}
            alt="check"
            width={12}
            height={12}
          />
        </div>

        {/* Label */}
        <span
          className={`font-bold transition-colors ${
            isSold || isHovered ? "text-[#FECC39]" : "text-white"
          }`}
        >
          {newProjectTexts.soldProjectLabel}
        </span>
      </button>
    </section>
  );
}
