"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Participant from "../../../../../components/Participant";
import { useTeamProfile } from "../../TeamProfileContext";
import { artistsAPI, type PublicArtist, type PublicArtistProject } from "../../../../../lib/api/artists";
import { organizationsAPI } from "../../../../../lib/api/organizations";
import type { TeamMemberSummary } from "../../../../../lib/api/teams";
import type { PhotoData } from "../../../../../data/artistsData";
import { localeToApiLanguage, type ApiLanguage, type Locale } from "../../../../../i18n/routing";

const FALLBACK_AVATAR = "/artists/artist-photo-5.png";

interface MemberCard {
  slug: string;
  name: string;
  avatarUrl: string | null;
  typeLabel: string;
  tags: string[];
  photos: PhotoData[];
}

function toPhotos(projects: PublicArtistProject[]): PhotoData[] {
  return projects.map((project) => ({
    image: project.coverUrl ?? FALLBACK_AVATAR,
    likes: project.likesCount,
    slug: project.slug,
  }));
}

async function loadMemberCard(
  member: TeamMemberSummary,
  artistTypeLabel: string,
  organizationTypeLabel: string,
  language: ApiLanguage
): Promise<MemberCard> {
  let profile: PublicArtist | null = null;
  let kind: "artist" | "organization" = "artist";

  try {
    profile = await artistsAPI.get(member.slug, language);
  } catch {
    try {
      profile = await organizationsAPI.get(member.slug, language);
      kind = "organization";
    } catch {
      profile = null;
    }
  }

  let projects: PublicArtistProject[] = [];
  if (profile) {
    try {
      const api = kind === "artist" ? artistsAPI : organizationsAPI;
      projects = await api.projects(member.slug, language, { per_page: 5 });
    } catch (error) {
      console.error(`Failed to load projects for member "${member.slug}":`, error);
    }
  }

  return {
    slug: member.slug,
    name: profile?.name ?? member.name,
    avatarUrl: profile?.avatarUrl ?? member.avatarUrl,
    typeLabel: profile?.profession || (kind === "artist" ? artistTypeLabel : organizationTypeLabel),
    tags: profile
      ? [profile.profession, profile.city, profile.country].filter((v): v is string => Boolean(v))
      : [],
    photos: toPhotos(projects),
  };
}

export default function Participants() {
  const t = useTranslations("Team.participants");
  const locale = useLocale() as Locale;
  const language = localeToApiLanguage(locale);
  const { loading: teamLoading, notFound, team } = useTeamProfile();
  const [members, setMembers] = useState<MemberCard[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    if (teamLoading || !team) return;
    let ignore = false;

    (async () => {
      setLoadingMembers(true);
      const cards = await Promise.all(
        team.members.map((member) =>
          loadMemberCard(member, t("artistType"), t("organizationType"), language)
        )
      );
      if (!ignore) setMembers(cards);
      if (!ignore) setLoadingMembers(false);
    })();

    return () => {
      ignore = true;
    };
  }, [team, teamLoading, t, language]);

  if (teamLoading || loadingMembers) {
    return (
      <section className="w-full bg-[#414141] pt-4 pb-16 px-4 md:px-10 lg:px-[75px] min-h-[200px] flex items-center justify-center">
        <p className="text-white text-lg">{t("loading")}</p>
      </section>
    );
  }

  if (notFound || !team) {
    return (
      <section className="w-full bg-[#414141] pt-4 pb-16 px-4 md:px-10 lg:px-[75px] min-h-[200px] flex items-center justify-center">
        <p className="text-white text-lg">{t("teamNotFound")}</p>
      </section>
    );
  }

  if (members.length === 0) {
    return (
      <section className="w-full bg-[#414141] pt-4 pb-16 px-4 md:px-10 lg:px-[75px]">
        <p className="text-white text-center">{t("noMembers")}</p>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#414141] pt-4 pb-16 px-4 md:px-10 lg:px-[75px]">
      <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 min-w-0">
        {members.map((member) => (
          <Participant
            key={member.slug}
            artistSlug={member.slug}
            artistPhoto={member.avatarUrl ?? FALLBACK_AVATAR}
            artistName={member.name}
            artistType={member.typeLabel}
            tags={member.tags}
            photos={member.photos}
            catalogButtonText={t("catalogButton")}
          />
        ))}
      </div>
    </section>
  );
}
