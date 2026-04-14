"use client";

import { useMemo } from "react";
import Participant from "../../../../components/Participant";
import { useCurrentTeam } from "../../useCurrentTeam";
import { artistsData, type ArtistData } from "../../../../data/artistsData";

export default function Participants() {
  const team = useCurrentTeam();

  const members = useMemo((): ArtistData[] => {
    const uniqueArtistIds: number[] = [];
    const seen = new Set<number>();
    for (const m of team.members) {
      if (seen.has(m.artistId)) continue;
      seen.add(m.artistId);
      uniqueArtistIds.push(m.artistId);
    }

    const artistById = new Map(artistsData.map((artist) => [artist.id, artist] as const));

    const resolved = uniqueArtistIds
      .map((artistId) => artistById.get(artistId))
      .filter((artist): artist is ArtistData => Boolean(artist));
    return resolved;
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
            artistId={artist.id}
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
