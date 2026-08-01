"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import { withProfileId } from "../../../../../lib/authorQuery";
import { myTeamsAPI, type MyTeam } from "../../../../../lib/api/myTeams";
import { useProfileView } from "../../ProfileViewContext";
import LeaveTeamModal from "./LeaveTeamModal";
import TeamCard from "../team/TeamCard";
import EmptyState from "../../../../../components/ui/empty-state";

export default function ListOfTeams() {
  const t = useTranslations("ProfileServices.team");
  const router = useRouter();
  const { slug } = useProfileView();
  const [teams, setTeams] = useState<MyTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<MyTeam | null>(null);

  useEffect(() => {
    let cancelled = false;
    myTeamsAPI
      .list()
      .then((data) => {
        if (!cancelled) setTeams(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openLeaveTeamModal = (team: MyTeam) => {
    if (team.isOwner) return;
    setSelectedTeam(team);
  };

  const closeLeaveTeamModal = () => setSelectedTeam(null);

  const handleLeave = async () => {
    if (!selectedTeam) return;
    await myTeamsAPI.leave(selectedTeam.slug);
    setTeams((prev) => prev.filter((t) => t.slug !== selectedTeam.slug));
    setSelectedTeam(null);
  };

  if (loading) {
    return <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px] min-h-[400px]" />;
  }

  if (teams.length === 0) {
    return (
      <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px]">
        <EmptyState
          title={t("emptyState.message")}
          description={t("emptyState.subMessage")}
          buttonText={t("emptyState.createButtonText")}
          onButtonClick={() => router.push(withProfileId("/profile/team/new", slug))}
        />
      </section>
    );
  }

  return (
    <>
      <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px]">
        {/* Create Team Button */}
        <div className="mb-8 flex justify-center">
          <button
            type="button"
            onClick={() => router.push(withProfileId("/profile/team/new", slug))}
            className="h-[60px] flex items-stretch transition-all duration-300 rounded-none bg-[#FECC39] hover:bg-white w-full md:w-[320px]"
          >
            <span className="flex items-center justify-center flex-1 px-6 font-bold text-black whitespace-nowrap">
              {t("list.createTeamButton")}
            </span>
            <div className="flex items-center justify-center w-[60px] flex-shrink-0 border-l border-black">
              <Image src="/plus.svg" alt="Plus" width={24} height={24} />
            </div>
          </button>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4 lg:gap-8">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onLeaveTeamClick={openLeaveTeamModal}
            />
          ))}
        </div>
      </section>

      <LeaveTeamModal
        isOpen={Boolean(selectedTeam)}
        teamName={selectedTeam?.name ?? ""}
        onClose={closeLeaveTeamModal}
        onLeave={handleLeave}
      />
    </>
  );
}