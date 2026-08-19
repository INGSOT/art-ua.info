'use client';

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "../i18n/navigation";
import { routing } from "../i18n/routing";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { navigationItems, socialIcons } from "../data/headerData";
import SearchModal from "./SearchModal";
import MobileMenu from "./MobileMenu";
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

// Іконка бургер-меню (3 смужки) — як header .burger у save-art.
function BurgerIcon() {
  return (
    <span className="flex h-5 w-5 flex-col justify-between">
      <span className="block h-1 w-5 bg-[#FECC39]" />
      <span className="block h-1 w-5 bg-[#FECC39]" />
      <span className="block h-1 w-3 bg-[#FECC39]" />
    </span>
  );
}

export default function Header({ isHomePage = false }: HeaderProps) {
    const { user, logout, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations("Header");

    const handleLogout = async () => {
      await logout();
      showToast(t("logout"), "green");
    };
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeAuthModal, setActiveAuthModal] = useState<"login" | "register" | "reset" | null>(null);
    const [disableAuthAnimation, setDisableAuthAnimation] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const avatarUrl = getImageUrl(user?.avatar_url);
    const [loadedAvatarUrl, setLoadedAvatarUrl] = useState<string | null>(null);
    const avatarLoaded = avatarUrl !== null && loadedAvatarUrl === avatarUrl;

    useEffect(() => {
      if (!user) {
        setUnreadCount(0);
        return;
      }

      let cancelled = false;
      const fetchUnreadCount = () => {
        notificationsAPI
          .unreadCount()
          .then((count) => {
            if (!cancelled) setUnreadCount(count);
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

    const authButton = authLoading && !user ? (
      <div
        className="flex w-11 h-11 shrink-0 items-center justify-center rounded-[44px]"
        role="status"
        aria-label="Loading"
      >
        <span className="w-11 h-11 rounded-[44px] border-2 border-white/30 border-t-[#FECC39] animate-spin" />
      </div>
    ) : user ? (
      <button
        type="button"
        onClick={() => setIsProfileMenuOpen(true)}
        className={`relative w-11 h-11 shrink-0 rounded-[44px] border ${avatarUrl && !avatarLoaded ? "border-transparent" : "border-[#FECC39]"}`}
        aria-label={user.name}
      >
        {avatarUrl ? (
          <>
            {!avatarLoaded && (
              <span className="absolute inset-0 rounded-[44px] border-2 border-white/30 border-t-[#FECC39] animate-spin" />
            )}
            <img
              src={avatarUrl}
              alt={user.name}
              className={`w-11 h-11 rounded-[44px] object-cover transition-opacity duration-150 ${avatarLoaded ? "opacity-100" : "opacity-0"}`}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onLoad={() => setLoadedAvatarUrl(avatarUrl)}
              onError={() => setLoadedAvatarUrl(avatarUrl)}
            />
          </>
        ) : (
          <AvatarPlaceholder name={user.name} className="w-11 h-11 rounded-[44px]" textClassName="text-[14px]" />
        )}
        {unreadCount > 0 && (
          <span className="absolute top-[calc(100%+8px)] left-[calc(50%-4px)] w-2 h-2 rounded-full bg-green-500 animate-pulse" />
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
    <header className={`flex flex-nowrap items-center gap-3 p-4 min-[550px]:gap-[30px] min-[550px]:p-[30px] ${isHomePage ? 'bg-transparent' : 'bg-[#414141]'}`}>
        <SiteSwitcher />

        <div className="hidden min-[1301px]:flex h-10 items-center gap-[30px] flex-1">
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
            <Button
              variant="ghost"
              size="icon"
              className="w-11 h-11 hover:bg-transparent"
              onClick={() => setIsSearchOpen(true)}
            >
              <img className="w-5 h-5" alt="Search" src="/search.svg" />
            </Button>

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

        <div className="hidden min-[1301px]:inline-flex items-center gap-2">
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

        <div className="ml-auto flex items-center gap-3 min-[1301px]:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 rounded-none p-0 hover:bg-transparent"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label={t("menu")}
          >
            <BurgerIcon />
          </Button>

          {authButton}
        </div>

        <div className="hidden min-[1301px]:flex items-center gap-2">
          {authButton}
        </div>
      </header>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      {user && (
        <ProfileMenuModal
          isOpen={isProfileMenuOpen}
          onClose={() => setIsProfileMenuOpen(false)}
          user={user}
          onLogout={handleLogout}
          unreadCount={unreadCount}
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