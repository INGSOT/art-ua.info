"use client";

import { useEffect, useMemo, useState } from "react";
import { artistsData } from "../../data/participantsData";
import { joinCommunityData } from "../../data/mainData";

type Participant = {
  id: number;
  photo: string;
  name: string;
};

function shuffleArray<T>(arr: T[]): T[] {
  const next = [...arr];
  // Fisher–Yates shuffle
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function pickRandomParticipants(
  pool: Participant[],
  count: number,
  excludeIds?: Set<number>
): Participant[] {
  const eligible =
    excludeIds && excludeIds.size > 0 ? pool.filter((p) => !excludeIds.has(p.id)) : pool;
  const source = eligible.length >= count ? eligible : pool;
  return shuffleArray(source).slice(0, Math.min(count, source.length));
}

export default function JoinCommunity() {
  const participantsPool = useMemo<Participant[]>(
    () =>
      artistsData.map((a) => ({
        id: a.id,
        photo: a.artistPhoto,
        name: a.artistName,
      })),
    []
  );

  const PARTICIPANTS_COUNT = 4;

  const [participants, setParticipants] = useState<Participant[]>(() =>
    participantsPool.slice(0, PARTICIPANTS_COUNT)
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setParticipants((prev) => {
        const excludeIds = new Set(prev.map((p) => p.id));
        return pickRandomParticipants(participantsPool, PARTICIPANTS_COUNT, excludeIds);
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [participantsPool]);

  return (
     <section className="flex flex-col items-center justify-center gap-[30px] px-4 md:px-[60px] py-10 md:py-20 w-full bg-[#FFFCF5]">
      <div className="flex flex-col items-center gap-0">
        <h4 className="font-h4 font-bold text-black text-[24px] md:text-[32px] lg:text-[40px] text-center tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)] [font-style:var(--h4-font-style)]">
          {joinCommunityData.title1}
        </h4>
        <h4 className="font-h4 font-bold text-black text-[24px] md:text-[32px] lg:text-[40px] text-center tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)] [font-style:var(--h4-font-style)]">
          {joinCommunityData.title2}
        </h4>
      </div>

      {/* Desktop and Tablet version */}
      <div className="hidden md:inline-flex flex-col items-start gap-2.5">
        <div className="flex items-center justify-center gap-4 md:gap-10 flex-wrap">
          {participants.map((participant) => (
            <img
              key={participant.id}
              className="w-[90px] h-[90px] rounded-[50px] object-cover"
              alt="Artist photo"
              src={participant.photo}
            />
          ))}

          <div className="w-[90px] h-[90px] bg-[#FECC39] rounded-[50px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
            <img src="/plus.svg" alt="Plus" className="w-6 h-6" />
          </div>
        </div>

        <div className="flex items-start gap-4 md:gap-10 flex-wrap justify-center">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="w-[90px] font-wix font-p3 font-[number:var(--p3-font-weight)] text-black text-[length:var(--p3-font-size)] text-center tracking-[var(--p3-letter-spacing)] leading-[var(--p3-line-height)] [font-style:var(--p3-font-style)]"
            >
              {participant.name.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </div>
          ))}

          <div className="w-[90px] font-wix font-p3 font-[number:var(--p3-font-weight)] text-black text-[length:var(--p3-font-size)] text-center tracking-[var(--p3-letter-spacing)] leading-[var(--p3-line-height)] [font-style:var(--p3-font-style)]">
            {joinCommunityData.joinText.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i === 0 && <br />}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile version */}
      <div className="flex md:hidden w-full max-w-[400px]">
        <div className="flex flex-col items-start gap-4">
          {participants.map((participant) => (
            <div key={participant.id} className="flex items-center gap-4 w-full">
              <img
                className="w-[90px] h-[90px] rounded-[50px] object-cover"
                alt="Artist photo"
                src={participant.photo}
              />
              <div className="font-wix font-p3 font-[number:var(--p3-font-weight)] text-black text-[length:var(--p3-font-size)] text-left tracking-[var(--p3-letter-spacing)] leading-[var(--p3-line-height)] [font-style:var(--p3-font-style)]">
                {participant.name.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i === 0 && <br />}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-4 w-full">
            <div className="w-[90px] h-[90px] bg-[#FECC39] rounded-[50px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
              <img src="/plus.svg" alt="Plus" className="w-6 h-6" />
            </div>
            <div className="font-wix font-p3 font-[number:var(--p3-font-weight)] text-black text-[length:var(--p3-font-size)] text-left tracking-[var(--p3-letter-spacing)] leading-[var(--p3-line-height)] [font-style:var(--p3-font-style)]">
              {joinCommunityData.joinText.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
