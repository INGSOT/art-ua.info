'use client';

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { SITE_DOMAIN, SAVE_ART_DOMAIN, SAVE_ART_URL, ART_UA_COM_DOMAIN, ART_UA_COM_URL } from "../lib/siteDomains";

const siteLinks = [
  { label: SAVE_ART_DOMAIN, url: SAVE_ART_URL },
  { label: ART_UA_COM_DOMAIN, url: ART_UA_COM_URL },
];

export default function SiteSwitcher() {
  return (
    <div className="inline-flex items-center gap-2 flex-[0_0_auto]">
      <img className="w-11 h-11 shrink-0" alt="Logos" src="/logos.svg" />

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className="group inline-flex items-center gap-2 px-2 py-1 transition-colors duration-200 data-[state=open]:bg-[#FECC39]"
          >
            <div className="w-fit font-bold text-[14px] font-[family-name:var(--font-unbounded)] whitespace-nowrap transition-colors duration-200 text-white group-hover:text-[#FECC39] group-data-[state=open]:text-[#1E1E1E] group-data-[state=open]:group-hover:text-[#1E1E1E]">
              {SITE_DOMAIN}
            </div>

            <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
              <img
                className="w-6 h-6 group-data-[state=open]:hidden"
                alt="Ui"
                src="/white_triangle_down.svg"
              />
              <img
                className="hidden w-3.5 h-3 rotate-180 group-data-[state=open]:block"
                alt="Ui"
                src="/black_triangle_down.svg"
              />
            </div>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            sideOffset={1}
            className="z-50 flex flex-col gap-[1px] min-w-[220px] shadow-lg overflow-hidden"
          >
            {siteLinks.map((site) => (
              <DropdownMenu.Item key={site.url} asChild>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-3 font-bold text-[14px] font-[family-name:var(--font-unbounded)] whitespace-nowrap outline-none cursor-pointer transition-colors duration-200 bg-[#414141] text-[#FECC39] hover:text-white"
                >
                  {site.label}
                </a>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
