"use client";

import { useState } from "react";
import Link from "next/link";
import { withProfileId } from "../../lib/authorQuery";
import { useProfileView } from "./ProfileViewContext";

type MenuProps = {
  activeItem?: string;
};

export default function Menu({ activeItem }: MenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { slug } = useProfileView();

  const menuItems = [
    { id: "projects", label: "Проєкти", href: withProfileId("/profile/projects", slug) },
    { id: "drafts", label: "Чернетки", href: "#" },
    { id: "catalogs", label: "Каталоги", href: withProfileId("/profile/catalogs", slug) },
    { id: "services", label: "Послуги", href: withProfileId("/profile/services", slug) },
    { id: "team", label: "Команда", href: withProfileId("/profile/team", slug) },
    { id: "info", label: "Інформація", href: withProfileId("/profile/info", slug) },
    { id: "notifications", label: "Сповіщення", href: "#" },
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
