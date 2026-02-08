"use client";

import Link from "next/link";
import Image from "next/image";
import { socialLinks } from "../../../data/articleData";

export default function SocialLinksBar() {
  return (
    <div className="bg-[#343434] py-10 px-8">
      <div className="flex justify-center items-center gap-6">
        {socialLinks.map((link, index) => {
          // Special handling for copy link button
          if (link.name === "Copy link") {
            return (
              <button 
                key={index}
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="hover:opacity-80 transition-opacity"
              >
                <Image src={link.icon} alt={link.name} width={24} height={24} />
              </button>
            );
          }
          
          // Regular social links
          return (
            <Link 
              key={index}
              href={link.url} 
              target="_blank"
              className="hover:opacity-80 transition-opacity"
            >
              <Image src={link.icon} alt={link.name} width={24} height={24} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
