'use client';

import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { navigationItems, socialIcons, languageOptions } from "../data/headerData";
import SearchModal from "./SearchModal";
import LoginModal from "./LoginModal";
import RegistrationModal from "./RegistrationModal";
import ResetPassModal from "./ResetPassModal";
import ProfileMenuModal from "./ProfileMenuModal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getImageUrl } from "../lib/url";

interface HeaderProps {
  isHomePage?: boolean;
}

export default function Header({ isHomePage = false }: HeaderProps) {
    const { user, logout } = useAuth();
    const { showToast } = useToast();

    const handleLogout = async () => {
      await logout();
      showToast("Ви вийшли з акаунту", "green");
    };
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeAuthModal, setActiveAuthModal] = useState<"login" | "register" | "reset" | null>(null);
    const [disableAuthAnimation, setDisableAuthAnimation] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

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
        className="relative w-11 h-11 flex items-center justify-center shrink-0"
        aria-label={user.name}
      >
        {getImageUrl(user.avatar_url) ? (
          <img
            src={getImageUrl(user.avatar_url)!}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <span className="w-9 h-9 rounded-full bg-[#FECC39] text-[#343434] font-bold text-[14px] flex items-center justify-center">
            {user.name.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-[#4CAF50] border-2 border-[#414141]" />
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
        <Link href="/" className="inline-flex items-center gap-2 flex-[0_0_auto] group">
          <img className="w-11 h-11" alt="Logos" src="/logos.svg" />

          <div className="inline-flex items-start">
            <div className="w-fit font-bold text-white text-[14px] font-[family-name:var(--font-unbounded)] whitespace-nowrap transition-colors duration-200 group-hover:text-[#FECC39]">
              art-ua.info
            </div>
          </div>

          <div className="w-6 h-6 flex items-center justify-center">
            <img className="w-6 h-6" alt="Ui" src="/white_triangle_down.svg" />
          </div>
        </Link>

        <div className="hidden lg:flex h-10 items-center gap-[30px] flex-1">
          <nav className="flex items-center gap-[30px] flex-1">
            {navigationItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="group inline-flex items-start p-0 h-auto hover:bg-transparent"
                asChild={Boolean(item.href)}
              >
                {item.href ? (
                  <Link href={item.href} className="inline-flex">
                    <div className="w-fit font-bold text-white text-[14px] font-[family-name:var(--font-unbounded)] whitespace-nowrap transition-colors duration-200 group-hover:text-[#FECC39]">
                      {item.label}
                    </div>
                  </Link>
                ) : (
                  <div className="w-fit font-bold text-white text-[14px] font-[family-name:var(--font-unbounded)] whitespace-nowrap transition-colors duration-200 group-hover:text-[#FECC39]">
                    {item.label}
                  </div>
                )}
              </Button>
            ))}
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
          {languageOptions.map((lang, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`inline-flex items-start p-0 h-auto hover:bg-transparent ${
                !lang.active ? "opacity-30" : ""
              }`}
            >
              <div className="w-fit font-bold text-white text-[14px] font-[family-name:var(--font-unbounded)] whitespace-nowrap">
                {lang.code}
              </div>
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