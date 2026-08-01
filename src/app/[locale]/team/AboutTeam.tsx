"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useTeamProfile } from "./TeamProfileContext";

const FALLBACK_AVATAR = "/artists/artist-photo-5.png";

export default function AboutTeam() {
  const t = useTranslations("Team.participants");
  const { loading, notFound, team } = useTeamProfile();

  if (loading) {
    return (
      <section className="w-full bg-[#414141] py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center min-h-[280px] justify-center">
          <p className="text-white text-lg">{t("loading")}</p>
        </div>
      </section>
    );
  }

  if (notFound || !team) {
    return (
      <section className="w-full bg-[#414141] py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center min-h-[280px] justify-center">
          <p className="text-white text-lg">{t("teamNotFound")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#414141] py-16 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-[160px] h-[160px] relative rounded-full overflow-hidden border-4 border-yellow-500">
            <Image
              src={team.avatarUrl ?? FALLBACK_AVATAR}
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

        {team.specialization && (
          <p className="text-white text-center mb-8">{team.specialization}</p>
        )}
      </div>
    </section>
  );
}
