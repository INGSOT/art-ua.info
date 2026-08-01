"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useTeamProfile } from "../../TeamProfileContext";

export default function TeamInformation() {
  const t = useTranslations("Team.participants");
  const { loading, notFound, team } = useTeamProfile();

  if (loading) {
    return (
      <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px] min-h-[200px] flex items-center justify-center">
        <p className="text-white text-lg">{t("loading")}</p>
      </section>
    );
  }

  if (notFound || !team) {
    return (
      <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px] min-h-[200px] flex items-center justify-center">
        <p className="text-white text-lg">{t("teamNotFound")}</p>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px]">
      {(team.website || team.socialLinks.length > 0) && (
        <div className="w-full bg-[#343434] h-auto md:h-[80px] mb-4 py-4 md:py-0">
          <div className="flex flex-col md:flex-row md:items-center justify-start h-full px-4 md:px-[30px] gap-4 md:gap-6">
            {team.website && (
              <div className="flex items-center gap-4">
                <Image src="/planet.svg" alt="Website" width={24} height={24} />
                <span className="text-white text-sm font-bold">{team.website}</span>
              </div>
            )}
            {team.socialLinks.length > 0 && (
              <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
                {team.socialLinks.map((social) => (
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

      {(team.country || team.city) && (
        <div className="w-full max-w-[960px] bg-[#343434] h-[80px] mb-6 mx-auto">
          <div className="flex items-center h-full px-4 md:px-[30px] gap-4">
            <Image src="/earth.svg" alt="Location" width={24} height={24} />
            {team.country && (
              <span className=" font-wix text-white text-sm font-bold">{team.country}</span>
            )}
            {team.city && (
              <span className=" font-wix text-white text-sm font-bold">{team.city}</span>
            )}
          </div>
        </div>
      )}

      {team.description && (
        <div className="w-full max-w-[960px] mx-auto">
          <div className="text-white space-y-4">
            <p>{team.description}</p>
          </div>
        </div>
      )}
    </section>
  );
}
