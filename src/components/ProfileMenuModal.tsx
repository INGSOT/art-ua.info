"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AuthUser } from "../lib/api/auth";
import { socialIcons } from "../data/headerData";
import { getImageUrl } from "../lib/url";

interface ProfileMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser;
  onLogout: () => void;
}

const menuItems = (slug: string) => [
  { label: "Проєкти", href: `/profile/${slug}/projects` },
  { label: "Каталоги", href: `/profile/${slug}/catalogs` },
  { label: "Послуги", href: `/profile/${slug}/services` },
  { label: "Команда", href: `/profile/${slug}/team` },
  { label: "Інформація", href: `/profile/${slug}/info` },
];

export default function ProfileMenuModal({ isOpen, onClose, user, onLogout }: ProfileMenuModalProps) {
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
              aria-label="Закрити"
            >
              <img src="/yellow_cross.svg" alt="Закрити" className="w-6 h-6" />
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
              <span className="w-12 h-12 rounded-full bg-[#FECC39] text-[#343434] font-bold text-[16px] flex items-center justify-center shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
            <p className="font-bold text-[#343434] text-[16px] font-[family-name:var(--font-unbounded)]">
              {user.name}
            </p>
          </div>

          <nav className="mt-8 flex flex-col gap-5">
            {menuItems(user.slug).map((item) => (
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
              art-ua.info/author/{user.slug}
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
            Вийти
          </button>

          <div className="mt-auto pt-8">
            <div className="w-full border-t border-black/10" />
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <a href="https://save-art.in.ua" className="font-wix text-sm text-[#343434] hover:text-[#FECC39] transition-colors">
                  save-art.in.ua
                </a>
                <a href="https://art-ua.com" className="font-wix text-sm text-[#343434] hover:text-[#FECC39] transition-colors">
                  art-ua.com
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
