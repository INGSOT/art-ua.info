"use client";

import { useState } from "react";
import Link from "next/link";

type MenuSectionProps = {
  activeItem?: string;
};

export default function MenuSection({ activeItem }: MenuSectionProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems = [
    { id: "projects", label: "Проєкти", href: "/author/projects" },
    { id: "catalogs", label: "Каталоги", href: "/author/catalogs" },
    { id: "services", label: "Послуги", href: "#" },
    { id: "information", label: "Інформація", href: "#" },
  ];

  return (
    <section className="w-full bg-[#414141] py-8 px-0 border-t border-[#343434]">
      <div className="max-w-4xl w-full px-4 md:px-[30px]">
        <nav className="flex flex-col md:flex-row md:flex-wrap justify-start gap-4 md:gap-8 pl-[45px]">
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
