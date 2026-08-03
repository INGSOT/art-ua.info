'use client';

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "../i18n/navigation";
import { routing } from "../i18n/routing";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { navigationItems, socialIcons } from "../data/headerData";
import SearchModal from "./SearchModal";
import LoginModal from "./LoginModal";
import RegistrationModal from "./RegistrationModal";
import ResetPassModal from "./ResetPassModal";
import ProfileMenuModal from "./ProfileMenuModal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getImageUrl } from "../lib/url";
import AvatarPlaceholder from "./ui/AvatarPlaceholder";
import SiteSwitcher from "./SiteSwitcher";
import { notificationsAPI } from "../lib/api/notifications";

interface HeaderProps {
  isHomePage?: boolean;
}

export default function Header({ isHomePage = false }: HeaderProps) {
    const { user, logout } = useAuth();
    const { showToast } = useToast();
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations("Header");

    const handleLogout = async () => {
      await logout();
      showToast(t("logout"), "green");
    };
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeAuthModal, setActiveAuthModal] = useState<"login" | "register" | "reset" | null>(null);
    const [disableAuthAnimation, setDisableAuthAnimation] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
      if (!user) {
        setHasUnread(false);
        return;
      }

      let cancelled = false;
      const fetchUnreadCount = () => {
        notificationsAPI
          .unreadCount()
          .then((count) => {
            if (!cancelled) setHasUnread(count > 0);
          })
          .catch(() => {});
      };

      fetchUnreadCount();
      const intervalId = setInterval(fetchUnreadCount, 60000);

      return () => {
        cancelled = true;
        clearInterval(intervalId);
      };
    }, [user, isProfileMenuOpen]);

    const openLoginModal = () => {
      setDisableAuthAnimation(false);
      setActiveAuthModal("login");
    };

    const closeAuthModal = () => {
      setDisableAuthAnimation(false);
      setActiveAuthModal(null);
    };

    const authButton = user ? (
      <button
        type="button"
        onClick={() => setIsProfileMenuOpen(true)}
        className="relative w-11 h-11 shrink-0"
        aria-label={user.name}
      >
        {getImageUrl(user.avatar_url) ? (
          <img
            src={getImageUrl(user.avatar_url)!}
            alt={user.name}
            className="w-11 h-11 rounded-full border border-[#FECC39] object-cover"
          />
        ) : (
          <AvatarPlaceholder name={user.name} className="w-11 h-11 border border-[#FECC39]" textClassName="text-[14px]" />
        )}
        {hasUnread && (
          <span className="absolute top-[calc(100%+8px)] left-[calc(50%-4px)] w-2 h-2 rounded-full bg-[#343434] animate-pulse" />
        )}
      </button>
    ) : (
      <Button
        variant="ghost"
        size="icon"
        className="w-11 h-11 hover:bg-transparent"
        onClick={openLoginModal}
      >
        <img className="w-6 h-6" alt="Login" src="/login.svg" />
      </Button>
    );

    return (
    <>
    <header className={`flex items-center gap-4 md:gap-[30px] p-4 md:p-[30px] flex-wrap lg:flex-nowrap ${isHomePage ? 'bg-transparent' : 'bg-[#414141]'}`}>
        <SiteSwitcher />

        <div className="hidden lg:flex h-10 items-center gap-[30px] flex-1">
          <nav className="flex items-center gap-[30px] flex-1">
            {navigationItems.map((item, index) => {
              const isActive = Boolean(item.href) && (pathname === item.href || pathname.startsWith(`${item.href}/`));

              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="group inline-flex items-start p-0 h-auto hover:bg-transparent"
                  asChild={Boolean(item.href)}
                >
                  {item.href ? (
                    <Link href={item.href} className="inline-flex">
                      <div
                        className={`w-fit font-bold text-[14px] font-[family-name:var(--font-unbounded)] whitespace-nowrap transition-colors duration-200 group-hover:text-[#FECC39] ${
                          isActive ? "text-[#FECC39]" : "text-white"
                        }`}
                      >
                        {t(`nav.${item.key}`)}
                      </div>
                    </Link>
                  ) : (
                    <div className="w-fit font-bold text-white text-[14px] font-[family-name:var(--font-unbounded)] whitespace-nowrap transition-colors duration-200 group-hover:text-[#FECC39]">
                      {t(`nav.${item.key}`)}
                    </div>
                  )}
                </Button>
              );
            })}
          </nav>

          <div className="inline-flex items-center justify-end gap-[30px]">
            {socialIcons.map((icon, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className="w-5 h-5 p-0 hover:bg-transparent"
              >
                <img className="w-5 h-5" alt={icon.alt} src={icon.src} />
              </Button>
            ))}
          </div>
        </div>

        <div className="hidden md:inline-flex items-center gap-2">
          {routing.locales.map((code) => (
            <Button
              key={code}
              variant="ghost"
              className={`inline-flex items-start p-0 h-auto hover:bg-transparent ${
                code !== locale ? "opacity-30" : ""
              }`}
              asChild
            >
              <Link href={pathname} locale={code}>
                <div className="w-fit font-bold text-white text-[14px] font-[family-name:var(--font-unbounded)] whitespace-nowrap">
                  {code.toUpperCase()}
                </div>
              </Link>
            </Button>
          ))}
        </div>

        <div className="flex md:hidden flex-1 justify-end items-center gap-2">
          {authButton}

          <Button
            variant="ghost"
            size="icon"
            className="w-11 h-11 hover:bg-transparent"
            onClick={() => setIsSearchOpen(true)}
          >
            <img className="w-6 h-6" alt="Search" src="/search.svg" />
          </Button>
        </div>

        <div className="hidden md:flex lg:hidden flex-1 justify-end items-center gap-2">
          {authButton}

          <Button
            variant="ghost"
            size="icon"
            className="w-11 h-11 hover:bg-transparent"
            onClick={() => setIsSearchOpen(true)}
          >
            <img className="w-6 h-6" alt="Search" src="/search.svg" />
          </Button>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          {authButton}

          <Button
            variant="ghost"
            size="icon"
            className="w-11 h-11 hover:bg-transparent"
            onClick={() => setIsSearchOpen(true)}
          >
            <img className="w-6 h-6" alt="Search" src="/search.svg" />
          </Button>
        </div>
      </header>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      {user && (
        <ProfileMenuModal
          isOpen={isProfileMenuOpen}
          onClose={() => setIsProfileMenuOpen(false)}
          user={user}
          onLogout={handleLogout}
        />
      )}
      <LoginModal
        isOpen={activeAuthModal === "login"}
        onClose={closeAuthModal}
        disableAnimation={disableAuthAnimation}
        onSwitchToRegister={() => {
          setDisableAuthAnimation(true);
          setActiveAuthModal("register");
        }}
        onSwitchToResetPassword={() => {
          setDisableAuthAnimation(true);
          setActiveAuthModal("reset");
        }}
      />
      <RegistrationModal
        isOpen={activeAuthModal === "register"}
        onClose={closeAuthModal}
        disableAnimation={disableAuthAnimation}
        onSwitchToLogin={() => {
          setDisableAuthAnimation(true);
          setActiveAuthModal("login");
        }}
      />
      <ResetPassModal
        isOpen={activeAuthModal === "reset"}
        onClose={closeAuthModal}
        disableAnimation={disableAuthAnimation}
        onSwitchToLogin={() => {
          setDisableAuthAnimation(true);
          setActiveAuthModal("login");
        }}
      />
    </>
    )
}