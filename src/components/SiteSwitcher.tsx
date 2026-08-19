'use client';

import { useEffect, useRef, useState } from "react";
import { Link } from "@/src/i18n/navigation";
import {
  SITE_DOMAIN,
  SAVE_ART_DOMAIN,
  SAVE_ART_URL,
  ART_UA_COM_DOMAIN,
  ART_UA_COM_URL,
} from "../lib/siteDomains";

const siteLinks = [
  { label: SITE_DOMAIN, url: "/", isActive: true },
  { label: SAVE_ART_DOMAIN, url: SAVE_ART_URL, isActive: false },
  { label: ART_UA_COM_DOMAIN, url: ART_UA_COM_URL, isActive: false },
];

const itemClassName =
  "block w-full truncate p-3 font-[family-name:var(--font-unbounded)] text-[14px] font-bold leading-5 outline-none transition-colors";

export default function SiteSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!switcherRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [isOpen]);

  return (
    <div ref={switcherRef} className="relative inline-flex min-w-0 flex-[0_1_auto] items-center gap-2 max-[1300px]:flex-1">
      <Link href="/" className="inline-flex min-w-0 items-center gap-2">
        <img className="h-11 w-11 shrink-0" alt="Logos" src="/logos.svg" />
        <span
          className="min-w-0 cursor-pointer truncate font-[family-name:var(--font-unbounded)] text-[12px] font-semibold tracking-[0.5px] text-white min-[550px]:text-[14px]"
          onClick={(event) => {
            event.preventDefault();
            setIsOpen((open) => !open);
          }}
        >
          {SITE_DOMAIN}
        </span>
      </Link>

      <button
        type="button"
        className={`inline-flex h-6 w-6 shrink-0 items-center justify-center transition-colors duration-200 hover:bg-[#FECC39] ${
          isOpen ? "bg-[#FECC39]" : ""
        }`}
        aria-label={SITE_DOMAIN}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <img
          className={isOpen ? "h-3.5 w-3.5 rotate-180" : "h-6 w-6"}
          alt=""
          src={isOpen ? "/black_triangle_down.svg" : "/white_triangle_down.svg"}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-[52px] z-50 flex w-[220px] max-w-[calc(100vw-32px)] flex-col gap-px overflow-hidden bg-[#414141] shadow-lg max-[550px]:left-0 max-[550px]:w-[calc(100vw-32px)]"
        >
          {siteLinks.map((site) =>
            site.isActive ? (
              <Link
                key={site.url}
                href="/"
                aria-current="page"
                className={`${itemClassName} pointer-events-none bg-[#FECC39] text-[#343434]`}
              >
                {site.label}
              </Link>
            ) : (
              <a
                key={site.url}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${itemClassName} cursor-pointer bg-[#343434] text-[#FECC39] hover:bg-[#FECC39] hover:text-[#343434]`}
              >
                {site.label}
              </a>
            )
          )}
        </div>
      )}
    </div>
  );
}
