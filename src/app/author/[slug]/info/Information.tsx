"use client";

import Image from "next/image";
import { useAuthorProfile } from "../../AuthorProfileContext";

export default function Information() {
  const { profileInfo } = useAuthorProfile();
  return (
    <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px]">
      {/* Website section */}
      <div className="w-full bg-[#343434] h-auto md:h-[80px] mb-4 py-4 md:py-0">
        <div className="flex flex-col md:flex-row md:items-center justify-start h-full px-4 md:px-[30px] gap-4 md:gap-6">
          <div className="flex items-center gap-4">
            <Image src="/planet.svg" alt="Website" width={24} height={24} />
            <span className="text-white text-sm font-bold">{profileInfo.website}</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
            {profileInfo.socialLinks.map((social) => (
              <a
                key={social.alt}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image src={social.icon} alt={social.alt} width={24} height={24} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Location section */}
      <div className="w-full max-w-[960px] bg-[#343434] h-[80px] mb-6 mx-auto">
        <div className="flex items-center h-full px-4 md:px-[30px] gap-4">
          <Image src="/earth.svg" alt="Location" width={24} height={24} />
          <span className=" font-wix text-white text-sm font-bold">{profileInfo.location.country}</span>
          <span className=" font-wix text-white text-sm font-bold">{profileInfo.location.city}</span>
        </div>
      </div>

      {/* Description text */}
      <div className="w-full max-w-[960px] mx-auto">
        <div className="text-white space-y-4">
          {profileInfo.description.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
