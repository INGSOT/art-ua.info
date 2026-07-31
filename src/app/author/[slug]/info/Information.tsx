"use client";

import Image from "next/image";
import { useAuthorProfile } from "../../AuthorProfileContext";

export default function Information() {
  const { loading, notFound, profile } = useAuthorProfile();

  if (loading) {
    return (
      <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px] min-h-[200px] flex items-center justify-center">
        <p className="text-white text-lg">Завантаження...</p>
      </section>
    );
  }

  if (notFound || !profile) {
    return (
      <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px] min-h-[200px] flex items-center justify-center">
        <p className="text-white text-lg">Автора не знайдено</p>
      </section>
    );
  }

  const socialLinks = [
    { url: profile.social?.facebook, icon: "/socials/facebook_white.svg", alt: "Facebook" },
    { url: profile.social?.instagram, icon: "/socials/instagram_white.svg", alt: "Instagram" },
    { url: profile.social?.youtube, icon: "/socials/youtube_white.svg", alt: "YouTube" },
    { url: profile.social?.linkedin, icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn" },
  ].filter((link): link is { url: string; icon: string; alt: string } => !!link.url);

  return (
    <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px]">
      {/* Website section */}
      {(profile.social?.website || socialLinks.length > 0) && (
        <div className="w-full bg-[#343434] h-auto md:h-[80px] mb-4 py-4 md:py-0">
          <div className="flex flex-col md:flex-row md:items-center justify-start h-full px-4 md:px-[30px] gap-4 md:gap-6">
            {profile.social?.website && (
              <div className="flex items-center gap-4">
                <Image src="/planet.svg" alt="Website" width={24} height={24} />
                <span className="text-white text-sm font-bold">{profile.social.website}</span>
              </div>
            )}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
                {socialLinks.map((social) => (
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
            )}
          </div>
        </div>
      )}

      {/* Location section */}
      {(profile.country || profile.city) && (
        <div className="w-full max-w-[960px] bg-[#343434] h-[80px] mb-6 mx-auto">
          <div className="flex items-center h-full px-4 md:px-[30px] gap-4">
            <Image src="/earth.svg" alt="Location" width={24} height={24} />
            {profile.country && (
              <span className=" font-wix text-white text-sm font-bold">{profile.country}</span>
            )}
            {profile.city && (
              <span className=" font-wix text-white text-sm font-bold">{profile.city}</span>
            )}
          </div>
        </div>
      )}

      {/* Description text */}
      {profile.bio && (
        <div className="w-full max-w-[960px] mx-auto">
          <div className="text-white space-y-4">
            <p>{profile.bio}</p>
          </div>
        </div>
      )}
    </section>
  );
}
