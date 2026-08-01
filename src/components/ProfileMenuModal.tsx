"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { AuthUser } from "../lib/api/auth";
import { socialIcons } from "../data/headerData";
import { getImageUrl } from "../lib/url";
import AvatarPlaceholder from "./ui/AvatarPlaceholder";
import { ART_UA_COM_DOMAIN, ART_UA_COM_URL, SAVE_ART_DOMAIN, SAVE_ART_URL, SITE_DOMAIN } from "../lib/siteDomains";

interface ProfileMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser;
  onLogout: () => void;
}

export default function ProfileMenuModal({ isOpen, onClose, user, onLogout }: ProfileMenuModalProps) {
  const t = useTranslations("Modals.profileMenu");
  const tShared = useTranslations("Modals.shared");
  const menuItems = [
    { label: t("projects"), href: `/profile/${user.slug}/projects` },
    { label: t("catalogs"), href: `/profile/${user.slug}/catalogs` },
    { label: t("services"), href: `/profile/${user.slug}/services` },
    { label: t("team"), href: `/profile/${user.slug}/team` },
    { label: t("info"), href: `/profile/${user.slug}/info` },
  ];

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full md:w-[400px] bg-[#FFFCF5] z-50 flex flex-col overflow-y-auto animate-slide-in">
        <div className="p-6 md:p-[30px] flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-colors"
              aria-label={tShared("close")}
            >
              <img src="/yellow_cross.svg" alt="" className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            {getImageUrl(user.avatar_url) ? (
              <img
                src={getImageUrl(user.avatar_url)!}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <AvatarPlaceholder name={user.name} className="w-12 h-12" textClassName="text-[16px]" />
            )}
            <p className="font-bold text-[#343434] text-[16px] font-[family-name:var(--font-unbounded)]">
              {user.name}
            </p>
          </div>

          <nav className="mt-8 flex flex-col gap-5">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="font-bold text-[#343434] text-[16px] font-[family-name:var(--font-unbounded)] hover:text-[#FECC39] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href={`/author/${user.slug}`}
            onClick={onClose}
            className="mt-8 flex items-center justify-between gap-3 bg-[#343434] px-4 py-3 hover:bg-[#272727] transition-colors"
          >
            <span className="font-bold text-[#FECC39] text-[14px]">
              {SITE_DOMAIN}/author/{user.slug}
            </span>
            <img src="/yellow_triangle_down.svg" alt="" className="w-4 h-4 -rotate-90 shrink-0" />
          </Link>

          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="mt-6 text-left font-bold text-[#343434] text-[16px] font-[family-name:var(--font-unbounded)] hover:text-[#FECC39] transition-colors"
          >
            {t("logout")}
          </button>

          <div className="mt-auto pt-8">
            <div className="w-full border-t border-black/10" />
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <a href={SAVE_ART_URL} className="font-wix text-sm text-[#343434] hover:text-[#FECC39] transition-colors">
                  {SAVE_ART_DOMAIN}
                </a>
                <a href={ART_UA_COM_URL} className="font-wix text-sm text-[#343434] hover:text-[#FECC39] transition-colors">
                  {ART_UA_COM_DOMAIN}
                </a>
              </div>
              <div className="flex items-center gap-3">
                {socialIcons.map((icon, index) => (
                  <a key={index} href="#" className="w-5 h-5">
                    <img
                      className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity"
                      alt={icon.alt}
                      src={icon.src}
                      style={{ filter: "invert(1)" }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
