import Image from "next/image";
import { useRouter } from "next/navigation";
import { withProfileId } from "../../../lib/authorQuery";
import type { ProfileTeam } from "../../../data/profileData";
import { useProfileView } from "../ProfileViewContext";

interface TeamCardProps {
  team: ProfileTeam;
  /** Приховати кнопки редагування / меню (публічний перегляд автора). */
  readOnly?: boolean;
}

export default function TeamCard({ team, readOnly = false }: TeamCardProps) {
  const isOwnTeam = team.type === "own";
  const router = useRouter();
  const { slug } = useProfileView();

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

        {!readOnly && (
          <div className="ml-4 flex-shrink-0">
            {isOwnTeam ? (
              <button
                type="button"
                onClick={() =>
                router.push(withProfileId("/profile/team/edit", slug))
              }
                aria-label="Редагувати команду"
                className="p-1 -m-1"
              >
                <Image src="/edit_yellow.svg" alt="" width={24} height={24} />
              </button>
            ) : (
              <Image
                src="/three_dots.svg"
                alt="Дії команди"
                width={24}
                height={24}
              />
            )}
          </div>
        )}
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

