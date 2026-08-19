"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from "@/src/i18n/navigation";
import { routing } from "../i18n/routing";
import { localeToApiLanguage, type Locale } from "../i18n/routing";
import { navigationItems, socialIcons } from "../data/headerData";
import { SuggestionsList } from "./SearchModal";
import {
  buildSearchUrl,
  getGlobalSearchResults,
  getGlobalSearchSuggestions,
  type GlobalSearchSuggestion,
} from "../lib/globalSearch";
import { SAVE_ART_DOMAIN, SAVE_ART_URL, ART_UA_COM_DOMAIN, ART_UA_COM_URL } from "../lib/siteDomains";

const otherSiteLinks = [
  { label: SAVE_ART_DOMAIN, url: SAVE_ART_URL },
  { label: ART_UA_COM_DOMAIN, url: ART_UA_COM_URL },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Бургер-меню для екранів вужчих за lg (як header .mobile у save-art):
// інлайн-пошук з підказками прямо під полем (не окрема модалка), пункти
// навігації, соцмережі, перемикач мови. Перемикач сайтів (save-art/art-ua.com)
// уже завжди доступний через SiteSwitcher біля лого, тут не дублюється.
export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const t = useTranslations("Header");
  const tSearch = useTranslations("Modals.search");
  const locale = useLocale() as Locale;
  const language = localeToApiLanguage(locale);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GlobalSearchSuggestion[]>([]);
  const requestId = useRef(0);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }

    const id = ++requestId.current;
    const timeout = setTimeout(() => {
      getGlobalSearchSuggestions(trimmed, language)
        .then((items) => {
          if (requestId.current === id) setSuggestions(items);
        })
        .catch(() => {
          if (requestId.current === id) setSuggestions([]);
        });
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, language]);

  useEffect(() => {
    if (!isOpen) return;
    setQuery("");
    setSuggestions([]);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const pickSuggestion = (href: string) => {
    router.push(href);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const results = await getGlobalSearchResults(trimmed, language);
    const withHits = results.filter((r) => r.count > 0);
    const target = withHits[0];

    if (target) {
      router.push(buildSearchUrl(target.href, trimmed));
    }
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-[#414141] z-50 flex flex-col overflow-y-auto animate-slide-in">
        <div className="p-5 pb-20 flex flex-col flex-1 min-h-full">
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center self-start hover:opacity-80 transition-opacity"
            aria-label={tSearch("close")}
          >
            <img src="/yellow_cross.svg" alt="" className="w-4 h-4" />
          </button>

          <div className="mt-10 flex flex-col gap-2">
            <form onSubmit={handleSubmit} className="flex items-center justify-between gap-2 bg-[#343434] p-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tSearch("placeholder")}
                className="font-wix w-full bg-transparent text-white placeholder-[#A0A0A0] outline-none"
              />
              <button type="submit" aria-label={tSearch("title")} className="shrink-0">
                <img src="/search.svg" alt="" className="w-5 h-5" />
              </button>
            </form>

            {suggestions.length > 0 && (
              <SuggestionsList items={suggestions} onPick={pickSuggestion} listId="mobile-menu-suggestions" />
            )}
          </div>

          <nav className="mt-5 flex flex-col gap-5">
            {navigationItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={onClose}
                className="font-bold text-[#FECC39] text-[14px] font-[family-name:var(--font-unbounded)] bg-[#343434] p-3 hover:bg-[#3d3d3d] transition-colors"
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex items-center justify-center gap-4 pt-10">
            {routing.locales.map((code) => (
              <Link
                key={code}
                href="/"
                locale={code}
                className={`font-bold text-[14px] font-[family-name:var(--font-unbounded)] transition-colors ${
                  code === locale ? "text-[#FECC39]" : "text-white opacity-50 hover:opacity-100"
                }`}
              >
                {code.toUpperCase()}
              </Link>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3 py-3 border-t border-b border-white/80">
            {otherSiteLinks.map((site) => (
              <a
                key={site.url}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-white text-[14px] font-[family-name:var(--font-unbounded)] hover:text-[#FECC39] transition-colors"
              >
                {site.label}
              </a>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            {socialIcons.map((icon, index) => (
              <span key={index} className="w-9 h-9 rounded-full bg-[#343434] flex items-center justify-center">
                <img src={icon.src} alt={icon.alt} className="w-4 h-4" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
