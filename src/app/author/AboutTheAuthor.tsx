"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { ART_UA_COM_DOMAIN, SAVE_ART_DOMAIN, artUaComProfileUrl, saveArtProfileUrl } from "../../lib/siteDomains";
import { useAuthorProfile } from "./AuthorProfileContext";

const FALLBACK_AVATAR = "/artists/artist-photo-5.png";

export default function AboutTheAuthor() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const { loading, notFound, profile, slug } = useAuthorProfile();

  if (loading) {
    return (
      <section className="w-full bg-[#414141] py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center min-h-[280px] justify-center">
          <p className="text-white text-lg">Завантаження...</p>
        </div>
      </section>
    );
  }

  if (notFound || !profile) {
    return (
      <section className="w-full bg-[#414141] py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center min-h-[280px] justify-center">
          <p className="text-white text-lg">Автора не знайдено</p>
        </div>
      </section>
    );
  }

  const buttons = [
    { id: "save-art", label: SAVE_ART_DOMAIN, href: saveArtProfileUrl(slug) },
    { id: "art-ua", label: ART_UA_COM_DOMAIN, href: artUaComProfileUrl(slug) },
  ];

  return (
    <section className="w-full bg-[#414141] py-16 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Avatar with golden border */}
        <div className="relative mb-6">
          <div className="w-[160px] h-[160px] rounded-full overflow-hidden border-4 border-yellow-500">
            <Image
              src={profile.avatarUrl ?? FALLBACK_AVATAR}
              alt={profile.name}
              width={160}
              height={160}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Name */}
        <h2 className="text-white text-3xl font-bold mb-4 text-center">
          {profile.name}
        </h2>

        {/* Artist type */}
        <p className="text-white text-center mb-8">
          {profile.profession}
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {buttons.map((button) => (
            <Button
              key={button.id}
              asChild
              className={`h-[60px] flex items-stretch transition-all duration-300 rounded-none p-0 w-full md:w-auto ${
                hoveredButton === button.id
                  ? "bg-[#FECC39] hover:bg-[#FECC39]"
                  : "bg-[#343434] hover:bg-[#343434]"
              }`}
            >
              <a
                href={button.href}
                target="_blank"
                rel="noopener noreferrer"
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
              </a>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
