import Image from "next/image";
import { useRouter } from "next/navigation";
import { profileTeams } from "../../../data/profileData";
import TeamCard from "./TeamCard";

export default function ListOfTeams() {
  const router = useRouter();

  return (
    <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px]">
      {/* Create Team Button */}
      <div className="mb-8 flex justify-center">
        <button
          type="button"
          onClick={() => router.push("/profile/team/new")}
          className="h-[60px] flex items-stretch transition-all duration-300 rounded-none bg-[#FECC39] hover:bg-white w-full md:w-[320px]"
        >
          <span className="flex items-center justify-center flex-1 px-6 font-bold text-black whitespace-nowrap">
            Створити команду
          </span>
          <div className="flex items-center justify-center w-[60px] flex-shrink-0 border-l border-black">
            <Image src="/plus.svg" alt="Plus" width={24} height={24} />
          </div>
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4 lg:gap-8">
        {profileTeams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </section>
  );
}