"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { aboutAuthorData } from "../../data/authorData";

export default function AboutTheAuthor() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <section className="w-full bg-[#414141] py-16 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Avatar with golden border */}
        <div className="relative mb-6">
          <div className="w-[160px] h-[160px] rounded-full overflow-hidden border-4 border-yellow-500">
            <Image
              src={aboutAuthorData.avatar}
              alt="Author Avatar"
              width={160}
              height={160}
              className="object-cover"
            />
          </div>
        </div>

        {/* Name */}
        <h2 className="text-white text-3xl font-bold mb-4 text-center">
          {aboutAuthorData.name}
        </h2>

        {/* Description */}
        <p className="text-white text-center mb-8">
          {aboutAuthorData.description}
        </p>

        {/* Teams */}
        <div className="flex flex-wrap justify-start md:justify-center gap-4 mb-8">
          {aboutAuthorData.teams.map((team, index) => (
            <Link
              key={index}
              href={`/team/projects?team=${index + 1}`}
              className="flex items-center gap-3 bg-[#414141] px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden">
                <Image
                  src={team.icon}
                  alt={team.name}
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-white text-sm font-bold text-left">{team.name}</span>
            </Link>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {aboutAuthorData.buttons.map((button) => (
            <Button
              key={button.id}
              className={`h-[60px] flex items-stretch transition-all duration-300 rounded-none p-0 w-full md:w-auto ${
                hoveredButton === button.id
                  ? "bg-[#FECC39] hover:bg-[#FECC39]"
                  : "bg-[#343434] hover:bg-[#343434]"
              }`}
              onMouseEnter={() => setHoveredButton(button.id)}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <span
                className={`flex items-center justify-center flex-1 px-6 font-bold transition-colors duration-300 whitespace-nowrap ${
                  hoveredButton === button.id
                    ? "text-[#343434]"
                    : "text-[#FECC39]"
                }`}
              >
                {button.label}
              </span>
              <div
                className={`flex items-center justify-center w-[60px] flex-shrink-0 transition-colors duration-300 ${
                  hoveredButton === button.id
                    ? "border-l border-[#343434]"
                    : "border-l border-[#FECC39]"
                }`}
              >
                <Image
                  src={
                    hoveredButton === button.id
                      ? "/grey_triangle_right.svg"
                      : "/yellow_triangle_right.svg"
                  }
                  alt="Arrow"
                  width={24}
                  height={24}
                />
              </div>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
