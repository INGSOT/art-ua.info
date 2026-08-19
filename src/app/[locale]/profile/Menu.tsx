"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { profileAPI } from "../../../lib/api/profile";
import {
  getProfileProjectsUrl,
  getProfileCatalogsUrl,
  getProfileServicesUrl,
  getProfileTeamsUrl,
  getProfileNotificationsUrl,
} from "../../../lib/url";

type MenuProps = {
  activeItem?: string;
};

// Особистий кабінет переїхав у Filament-панель бекенду (як у save-art) —
// вкладки лише відкривають одноразовий SSO-грант, див. ProfileMenuModal.tsx.
export default function Menu({ activeItem }: MenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const t = useTranslations("Profile.menu");

  const menuItems = [
    { id: "projects", label: t("projects"), href: getProfileProjectsUrl(), path: "/profile/projects" },
    { id: "catalogs", label: t("catalogs"), href: getProfileCatalogsUrl(), path: "/profile/catalogs" },
    { id: "services", label: t("services"), href: getProfileServicesUrl(), path: "/profile/services" },
    { id: "team", label: t("team"), href: getProfileTeamsUrl(), path: "/profile/teams" },
    { id: "notifications", label: t("notifications"), href: getProfileNotificationsUrl(), path: "/profile/notifications" },
  ];

  const handleClick = (e: React.MouseEvent, path: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    void profileAPI.redirectToProfile(path);
  };

  return (
    <section className="w-full bg-[#414141] py-8 px-0 border-t border-[#343434]">
      <div className="max-w-4xl w-full px-4 md:px-[30px]">
        <nav className="flex flex-col md:flex-row justify-between gap-4 pl-[45px]">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`text-sm font-bold transition-colors duration-300 ${
                hoveredItem === item.id || activeItem === item.id
                  ? "text-[#FECC39]"
                  : "text-white"
              }`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={(e) => handleClick(e, item.path)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
