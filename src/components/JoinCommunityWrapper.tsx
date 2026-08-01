"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "../components/ui/button";
import { joinCommunityWrapperData } from "../data/joinCommunityWrapperData";
import { useAuth } from "../context/AuthContext";
import { homeAPI } from "../lib/api/home";
import { localeToApiLanguage, type Locale } from "../i18n/routing";
import LoginModal from "./LoginModal";
import RegistrationModal from "./RegistrationModal";
import ResetPassModal from "./ResetPassModal";

export default function JoinCommunityWrapper() {
  const { user } = useAuth();
  const locale = useLocale() as Locale;
  const t = useTranslations("Main.joinCommunityWrapper");
  const [activeAuthModal, setActiveAuthModal] = useState<"login" | "register" | "reset" | null>(null);
  const [disableAuthAnimation, setDisableAuthAnimation] = useState(false);
  const [content, setContent] = useState({
    title: t("title"),
    backgroundImage: joinCommunityWrapperData.backgroundImage,
  });

  useEffect(() => {
    let isMounted = true;

    homeAPI
      .getAdBlocks(localeToApiLanguage(locale))
      .then(({ second }) => {
        if (!isMounted) return;
        setContent({
          title: second.title || t("title"),
          backgroundImage: second.image || joinCommunityWrapperData.backgroundImage,
        });
      })
      .catch((error) => {
        console.error("Failed to load join community ad block:", error);
      });

    return () => {
      isMounted = false;
    };
  }, [locale]);

  const closeAuthModal = () => {
    setDisableAuthAnimation(false);
    setActiveAuthModal(null);
  };

  return (
    <>
      <section className="w-full justify-center gap-6 md:gap-[60px] p-4 md:p-10 lg:p-20 bg-[#FFFCF5] border-b [border-bottom-style:solid] border-[#343434] flex flex-col items-center">
        <div className="flex flex-col md:flex-row items-start w-full">
            <div
              className="flex flex-col h-[300px] md:h-[400px] items-start gap-5 p-6 md:p-[60px] w-full md:w-1/2 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.45) 100%), url(${content.backgroundImage})`,
              }}
            >
            <div className="flex-col items-start gap-2.5 flex-1 w-full grow flex">
              <p className="self-stretch font-p1 font-[number:var(--p1-font-weight)] text-white text-[length:var(--p1-font-size)] tracking-[var(--p1-letter-spacing)] leading-[var(--p1-line-height)] [font-style:var(--p1-font-style)]">
                {t("tagline")}
              </p>

              <h5 className="self-stretch text-white text-[24px] md:text-[30px] font-bold font-[700] leading-[var(--h5-line-height)] tracking-[var(--h5-letter-spacing)] max-w-[600px]">
                {content.title}
              </h5>
            </div>

            {!user && (
              <Button
                onClick={() => setActiveAuthModal("login")}
                className="w-[300px] h-[60px] bg-[#FECC39] hover:bg-white hover:text-black text-black font-wix font-button font-bold font-[700] text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)] rounded-none"
              >
                {t("buttonText")}
              </Button>
            )}
          </div>

          <img
            className="w-full md:w-1/2 h-[300px] md:h-[400px] object-cover"
            alt="Image"
            src={joinCommunityWrapperData.sideImage}
          />
        </div>
      </section>

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
  );
}