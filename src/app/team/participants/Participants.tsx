"use client";

import { useMemo } from "react";
import Participant from "../../../components/Participant";
import { useCurrentTeam } from "../useCurrentTeam";
import { artistsData, type ArtistData } from "../../../data/artistsData";

export default function Participants() {
  const team = useCurrentTeam();

  const members = useMemo((): ArtistData[] => {
    // Унікальні аватари учасників команди (у `members` теоретично можуть бути дублікати).
    const uniquePhotoPaths: string[] = [];
    const seen = new Set<string>();
    for (const m of team.members) {
      if (seen.has(m.avatar)) continue;
      seen.add(m.avatar);
      uniquePhotoPaths.push(m.avatar);
    }

    const photoToArtist = new Map(artistsData.map((artist) => [artist.artistPhoto, artist] as const));

    // Разрешаем аватар-URL из `teamMembers` в карточки художников из `artistsData`.
    const resolved = uniquePhotoPaths
      .map((photoPath) => photoToArtist.get(photoPath))
      .filter((artist): artist is ArtistData => Boolean(artist));

    // Дополнительный защитный дедуп (на случай совпадений `artistPhoto`).
    const uniqueById: ArtistData[] = [];
    const seenIds = new Set<number>();
    for (const artist of resolved) {
      if (seenIds.has(artist.id)) continue;
      seenIds.add(artist.id);
      uniqueById.push(artist);
    }

    return uniqueById;
  }, [team]);

  if (members.length === 0) {
    return (
      <section className="w-full bg-[#414141] pt-4 pb-16 px-4 md:px-10 lg:px-[75px]">
        <p className="text-white text-center">Учасників ще не додано.</p>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#414141] pt-4 pb-16 px-4 md:px-10 lg:px-[75px]">
      <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 min-w-0">
        {members.map((artist) => (
          <Participant
            key={artist.id}
            artistPhoto={artist.artistPhoto}
            artistName={artist.artistName}
            artistType={artist.artistType}
            tags={artist.tags}
            photos={artist.photos}
            catalogButtonText={artist.catalogButtonText}
          />
        ))}
      </div>
    </section>
  );
}
