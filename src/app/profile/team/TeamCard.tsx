import Image from "next/image";
import type { ProfileTeam } from "../../../data/profileData";

interface TeamCardProps {
  team: ProfileTeam;
}

export default function TeamCard({ team }: TeamCardProps) {
  const isOwnTeam = team.type === "own";

  return (
    <article className="relative w-full bg-[#343434] p-6 flex flex-col gap-4">
      {/* Top row: avatar, name, action icon */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={team.avatar}
            alt={team.name}
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-white text-3xl font-bold leading-tight">
            {team.name}
          </h2>
        </div>

        <div className="ml-4 flex-shrink-0">
          <Image
            src={isOwnTeam ? "/edit_yellow.svg" : "/three_dots.svg"}
            alt={isOwnTeam ? "Edit team" : "Team actions"}
            width={24}
            height={24}
          />
        </div>
      </div>

      {/* Description */}
      <p className="text-white text-[18px] leading-[24px]">
        {team.description}
      </p>

      {/* Members */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4">
        {team.members.map((member, index) => (
          <div
            key={`${member.name}-${index}`}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={member.avatar}
                alt={member.name}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="text-white text-sm font-bold">{member.name}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

