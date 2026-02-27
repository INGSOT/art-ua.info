"use client";

import { useState } from "react";
import { navigationItems } from "../../data/mainData";

export default function MainNavigation() {

const [activeItem, setActiveItem] = useState<number | null>(null);
    return (
    <nav className="flex items-center justify-center gap-4 md:gap-[30px] px-4 md:px-10 lg:px-20 py-6 md:py-10 w-full bg-[#414141] flex-wrap">
      {navigationItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveItem(item.id)}
          className="inline-flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80"
        >
          <span className="font-bold text-white text-center text-sm md:text-base">
            {item.label}
          </span>
        </button>
      ))}
    </nav>
    )
}