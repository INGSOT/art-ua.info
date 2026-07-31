import Image from "next/image";
import { useRouter } from "next/navigation";
import { withProfileId } from "../../../../lib/authorQuery";
import type { MyTeam } from "../../../../lib/api/myTeams";
import { useProfileView } from "../../ProfileViewContext";

interface TeamCardProps {
  team: MyTeam;
  /** Приховати кнопки редагування / меню (публічний перегляд автора). */
  readOnly?: boolean;
  onLeaveTeamClick?: (team: MyTeam) => void;
}

export default function TeamCard({
  team,
  readOnly = false,
  onLeaveTeamClick,
}: TeamCardProps) {
  const router = useRouter();
  const { slug } = useProfileView();

  return (
    <article className="relative w-full bg-[#343434] p-6 flex flex-col gap-4">
      {/* Top row: avatar, name, action icon */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={team.avatarUrl ?? "/megaphone.svg"}
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
            {team.isOwner ? (
              <button
                type="button"
                onClick={() =>
                router.push(`${withProfileId("/profile/team/edit", slug)}?slug=${team.slug}`)
              }
                aria-label="Редагувати команду"
                className="p-1 -m-1"
              >
                <Image src="/edit_yellow.svg" alt="" width={24} height={24} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onLeaveTeamClick?.(team)}
                aria-label={`Дії команди ${team.name}`}
                className="p-1 -m-1"
              >
                <Image
                  src="/three_dots.svg"
                  alt="Дії команди"
                  width={24}
                  height={24}
                />
              </button>
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
        {team.members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={member.avatarUrl ?? "/megaphone.svg"}
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

      {!readOnly && (
        <button
          type="button"
          onClick={() =>
            router.push(`${withProfileId("/profile/team/services", slug)}?team=${team.slug}`)
          }
          className="self-start text-[#FECC39] text-sm font-bold hover:underline mt-2"
        >
          Послуги команди
        </button>
      )}
    </article>
  );
}

