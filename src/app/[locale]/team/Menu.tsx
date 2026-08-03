"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { useParams } from "next/navigation";
import { hrefWithTeam } from "./useCurrentTeam";

type MenuProps = {
  activeItem?: string;
};

export default function Menu({ activeItem }: MenuProps) {
  const t = useTranslations("Team.menu");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const params = useParams<{ slug?: string }>();
  const teamSlug = params?.slug ?? "";

  const menuItems = [
    { id: "projects", label: t("projects"), href: hrefWithTeam("/team/projects", teamSlug) },
    { id: "services", label: t("services"), href: hrefWithTeam("/team/services", teamSlug) },
    { id: "participants", label: t("participants"), href: hrefWithTeam("/team/participants", teamSlug) },
    { id: "info", label: t("info"), href: hrefWithTeam("/team/info", teamSlug) },
  ];

  return (
    <section className="w-full bg-[#414141] py-8 px-0 border-t border-[#343434]">
      <div className="max-w-4xl w-full px-4 md:px-[30px]">
        <nav className="flex flex-row flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible justify-start gap-4 md:gap-8 pl-[45px] whitespace-nowrap md:whitespace-normal">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`text-sm font-bold transition-colors duration-300 ${
                hoveredItem === item.id || activeItem === item.id
                  ? "text-[#FECC39]"
                  : "text-white"
              }`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
