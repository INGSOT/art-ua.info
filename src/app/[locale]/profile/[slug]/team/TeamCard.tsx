import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { withTeamId } from "../../../../../lib/authorQuery";
import type { MyTeam } from "../../../../../lib/api/myTeams";

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
  const t = useTranslations("ProfileServices.team.card");

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
          <Link href={withTeamId("/team/projects", team.slug)}>
            <h2 className="text-white text-3xl font-bold leading-tight hover:underline">
              {team.name}
            </h2>
          </Link>
        </div>

        {!readOnly && (
          <div className="ml-4 flex-shrink-0">
            {team.isOwner ? (
              <Link
                href={withTeamId("/team/edit", team.slug)}
                aria-label={t("editAria")}
                className="p-1 -m-1 inline-block"
              >
                <Image src="/edit_yellow.svg" alt="" width={24} height={24} />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => onLeaveTeamClick?.(team)}
                aria-label={t("teamActionsAria", { name: team.name })}
                className="p-1 -m-1"
              >
                <Image
                  src="/three_dots.svg"
                  alt={t("actionsAlt")}
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
    </article>
  );
}

