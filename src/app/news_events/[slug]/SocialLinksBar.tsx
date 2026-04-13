"use client";

import Link from "next/link";
import Image from "next/image";
import { newsSocialLinks } from "../../../data/newsData";

export default function SocialLinksBar() {
  return (
    <div className="bg-[#343434] py-10 px-8">
      <div className="flex justify-center items-center gap-6">
        {newsSocialLinks.map((link) => (
          <Link key={link.name} href={link.url} target="_blank" className="hover:opacity-80 transition-opacity">
            <Image src={link.icon} alt={link.name} width={24} height={24} />
          </Link>
        ))}
      </div>
    </div>
  );
}
