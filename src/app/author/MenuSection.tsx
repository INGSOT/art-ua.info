"use client";

import { useState } from "react";

type MenuSectionProps = {
  activeItem?: string;
};

export default function MenuSection({ activeItem }: MenuSectionProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems = [
    { id: "projects", label: "Проєкти" },
    { id: "catalogs", label: "Каталоги" },
    { id: "services", label: "Послуги" },
    { id: "information", label: "Інформація" },
  ];

  return (
    <section className="w-full bg-[#414141] py-8 px-0 border-t border-[#343434]">
      <div className="max-w-4xl w-full px-4 md:px-[30px]">
        <nav className="flex flex-wrap justify-start gap-8 pl-[45px]">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`text-sm font-bold transition-colors duration-300 ${
                hoveredItem === item.id || activeItem === item.id
                  ? "text-[#FECC39]"
                  : "text-white"
              }`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
