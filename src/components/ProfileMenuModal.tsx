"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { AuthUser } from "../lib/api/auth";
import { profileAPI } from "../lib/api/profile";
import {
  getImageUrl,
  getEditProfileUrl,
  getProfileProjectsUrl,
  getProfileCatalogsUrl,
  getProfileServicesUrl,
  getProfileTeamsUrl,
  getProfileNotificationsUrl,
} from "../lib/url";
import AvatarPlaceholder from "./ui/AvatarPlaceholder";

interface ProfileMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser;
  onLogout: () => void;
  unreadCount?: number;
}

export default function ProfileMenuModal({ isOpen, onClose, user, onLogout, unreadCount = 0 }: ProfileMenuModalProps) {
  const t = useTranslations("Modals.profileMenu");
  const tShared = useTranslations("Modals.shared");

  // Особистий кабінет переїхав у Filament-панель бекенду (як у save-art) —
  // пункти меню лише відкривають одноразовий SSO-грант і перекидають туди
  // вже залогіненим (redirectPath має збігатись з ProfileApiController::
  // SSO_ALLOWED_PATHS). "Чернетки" згорнуті в "Проєкти" (в Filament — вкладка).
  const menuItems = [
    { label: t("projects"), href: getProfileProjectsUrl(), path: "/profile/projects" },
    { label: t("catalogs"), href: getProfileCatalogsUrl(), path: "/profile/catalogs" },
    { label: t("services"), href: getProfileServicesUrl(), path: "/profile/services" },
    { label: t("team"), href: getProfileTeamsUrl(), path: "/profile/teams" },
    { label: t("notifications"), href: getProfileNotificationsUrl(), path: "/profile/notifications", badge: unreadCount },
  ];

  // Клік із модифікатором (ctrl/cmd/shift, середня кнопка) — не перехоплюємо,
  // хай браузер сам відкриє посилання як завжди (нова вкладка тощо).
  const handleProfileLinkClick = (e: React.MouseEvent, path: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    onClose();
    void profileAPI.redirectToProfile(path);
  };

  // Доступ до розділів кабінету відкривається лише після заповнення профілю
  // (наявність profile_type) — інакше на бекенді там просто нема з чим працювати.
  const isProfileComplete = Boolean(user.profile_type);

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
      {/* Невидимий шар лише для закриття по кліку поза меню — на відміну від
          LoginModal/RegistrationModal, у save-art .logged_modal немає темної
          підкладки, це компактний дропдаун, а не повноекранна панель. */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="fixed top-0 right-0 w-full max-w-[360px] bg-[#FFFCF5] shadow-xl z-50 p-[30px]">
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors"
          aria-label={tShared("close")}
        >
          <img src="/yellow_cross.svg" alt="" className="w-4 h-4" />
        </button>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="font-bold text-[#343434] text-[14px] font-[family-name:var(--font-unbounded)]">
            {user.name}
          </p>
          <div className="relative w-10 h-10 shrink-0">
            {getImageUrl(user.avatar_url) ? (
              <img
                src={getImageUrl(user.avatar_url)!}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <AvatarPlaceholder name={user.name} className="w-10 h-10" textClassName="text-[14px]" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-[calc(100%+8px)] left-[calc(50%-4px)] w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            )}
          </div>
        </div>

        <div className="mt-[30px] flex flex-col">
          {isProfileComplete ? (
            <nav className="flex flex-col">
              {menuItems.map((item) => (
                <a
                  key={item.path}
                  href={item.href}
                  onClick={(e) => handleProfileLinkClick(e, item.path)}
                  className="flex items-center justify-between gap-2 font-bold text-[#343434] text-[14px] font-[family-name:var(--font-unbounded)] py-3 hover:text-[#FECC39] transition-colors"
                >
                  {item.label}
                  {Boolean(item.badge) && (
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[#343434] text-[11px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
            </nav>
          ) : (
            <div className="bg-black/[0.03] p-3">
              <p className="font-wix text-[13px] leading-[18px] text-[#343434]/70 mb-2.5">
                {t("profileIncomplete")}
              </p>
              <a
                href={getEditProfileUrl()}
                onClick={(e) => handleProfileLinkClick(e, "/profile/profile")}
                className="inline-block font-bold text-[14px] leading-5 text-[#343434] bg-[#FECC39] px-3 py-2 hover:opacity-85 transition-opacity"
              >
                {t("completeProfile")}
              </a>
            </div>
          )}

          <div className="h-px bg-[#343434]/10 my-3" />

          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="text-left font-bold text-[#343434] text-[14px] font-[family-name:var(--font-unbounded)] py-3 hover:text-[#FECC39] transition-colors"
          >
            {t("logout")}
          </button>
        </div>
      </div>
    </>
  );
}
