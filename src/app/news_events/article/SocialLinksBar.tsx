"use client";

import Link from "next/link";
import Image from "next/image";

export default function SocialLinksBar() {
  return (
    <div className="bg-[#343434] py-10 px-8">
      <div className="flex justify-center items-center gap-6">
        <button 
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="hover:opacity-80 transition-opacity"
        >
          <Image src="/chain.svg" alt="Copy link" width={24} height={24} />
        </button>
        <Link 
          href="https://facebook.com" 
          target="_blank"
          className="hover:opacity-80 transition-opacity"
        >
          <Image src="/socials/facebook_yellow.svg" alt="Facebook" width={24} height={24} />
        </Link>
        <Link 
          href="https://twitter.com" 
          target="_blank"
          className="hover:opacity-80 transition-opacity"
        >
          <Image src="/socials/x_yellow.svg" alt="X (Twitter)" width={24} height={24} />
        </Link>
        <Link 
          href="https://pinterest.com" 
          target="_blank"
          className="hover:opacity-80 transition-opacity"
        >
          <Image src="/socials/pinterest_yellow.svg" alt="Pinterest" width={24} height={24} />
        </Link>
        <Link 
          href="https://linkedin.com" 
          target="_blank"
          className="hover:opacity-80 transition-opacity"
        >
          <Image src="/socials/linked_in_yellow.svg" alt="LinkedIn" width={24} height={24} />
        </Link>
      </div>
    </div>
  );
}
