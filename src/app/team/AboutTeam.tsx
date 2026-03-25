"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { useCurrentTeam } from "./useCurrentTeam";

export default function AboutTeam() {
  const [hoveredButton, setHoveredButton] = useState(false);
  const team = useCurrentTeam();

  const profileUrl = `https://art-ua.info/${team.username}`;
  const buttonLabel = `art-ua.info/${team.username}`;

  return (
    <section className="w-full bg-[#414141] py-16 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-[160px] h-[160px] relative rounded-full overflow-hidden border-4 border-yellow-500">
            <Image
              src={team.avatar}
              alt={team.name}
              fill
              sizes="160px"
              className="object-cover object-center"
            />
          </div>
        </div>

        <h1 className="text-white text-3xl font-bold mb-4 text-center">
          {team.name}
        </h1>

        <p className="text-white text-center mb-8">{team.category}</p>

        <Button
          asChild
          className={`h-[60px] flex items-stretch transition-all duration-300 rounded-none p-0 w-full md:w-auto ${
            hoveredButton ? "bg-[#FECC39] hover:bg-[#FECC39]" : "bg-[#343434] hover:bg-[#343434]"
          }`}
          onMouseEnter={() => setHoveredButton(true)}
          onMouseLeave={() => setHoveredButton(false)}
        >
          <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="flex items-stretch w-full">
            <span
              className={`flex items-center justify-center flex-1 px-6 font-bold transition-colors duration-300 whitespace-nowrap ${
                hoveredButton ? "text-[#343434]" : "text-[#FECC39]"
              }`}
            >
              {buttonLabel}
            </span>
            <div
              className={`flex items-center justify-center w-[60px] flex-shrink-0 transition-colors duration-300 ${
                hoveredButton ? "border-l border-[#343434]" : "border-l border-[#FECC39]"
              }`}
            >
              <Image
                src={hoveredButton ? "/grey_triangle_right.svg" : "/yellow_triangle_right.svg"}
                alt=""
                width={24}
                height={24}
              />
            </div>
          </a>
        </Button>
      </div>
    </section>
  );
}
