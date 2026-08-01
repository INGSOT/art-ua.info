"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { withProfileId } from "../../../lib/authorQuery";
import { useProfileView } from "./ProfileViewContext";

type MenuProps = {
  activeItem?: string;
};

export default function Menu({ activeItem }: MenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { slug } = useProfileView();
  const t = useTranslations("Profile.menu");

  const menuItems = [
    { id: "projects", label: t("projects"), href: withProfileId("/profile/projects", slug) },
    { id: "drafts", label: t("drafts"), href: withProfileId("/profile/drafts", slug) },
    { id: "catalogs", label: t("catalogs"), href: withProfileId("/profile/catalogs", slug) },
    { id: "services", label: t("services"), href: withProfileId("/profile/services", slug) },
    { id: "team", label: t("team"), href: withProfileId("/profile/team", slug) },
    { id: "info", label: t("info"), href: withProfileId("/profile/info", slug) },
    { id: "notifications", label: t("notifications"), href: withProfileId("/profile/notifications", slug) },
  ];

  return (
    <section className="w-full bg-[#414141] py-8 px-0 border-t border-[#343434]">
      <div className="max-w-4xl w-full px-4 md:px-[30px]">
        <nav className="flex flex-col md:flex-row justify-between gap-4 pl-[45px]">
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
