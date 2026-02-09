"use client";

import { useState } from "react";
import Link from "next/link";

type MenuProps = {
  activeItem?: string;
};

export default function Menu({ activeItem }: MenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems = [
    { id: "projects", label: "Проєкти", href: "/profile/projects" },
    { id: "drafts", label: "Чернетки", href: "#" },
    { id: "catalogs", label: "Каталоги", href: "#" },
    { id: "services", label: "Послуги", href: "#" },
    { id: "team", label: "Команда", href: "#" },
    { id: "info", label: "Інформація", href: "#" },
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
