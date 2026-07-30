"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { joinCommunityWrapperData } from "../data/joinCommunityWrapperData";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import RegistrationModal from "./RegistrationModal";
import ResetPassModal from "./ResetPassModal";

export default function JoinCommunityWrapper() {
  const { user } = useAuth();
  const [activeAuthModal, setActiveAuthModal] = useState<"login" | "register" | "reset" | null>(null);
  const [disableAuthAnimation, setDisableAuthAnimation] = useState(false);

  const closeAuthModal = () => {
    setDisableAuthAnimation(false);
    setActiveAuthModal(null);
  };

  return (
    <>
      <section className="w-full justify-center gap-6 md:gap-[60px] p-4 md:p-10 lg:p-20 bg-[#FFFCF5] border-b [border-bottom-style:solid] border-[#343434] flex flex-col items-center">
        <div className="flex flex-col md:flex-row items-start w-full">
            <div className="flex flex-col h-[300px] md:h-[400px] items-start gap-5 p-6 md:p-[60px] w-full md:w-1/2 bg-[linear-gradient(0deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.45)_100%),url('/goashape_studio.jpg')] bg-cover bg-center">
            <div className="flex-col items-start gap-2.5 flex-1 w-full grow flex">
              <p className="self-stretch font-p1 font-[number:var(--p1-font-weight)] text-white text-[length:var(--p1-font-size)] tracking-[var(--p1-letter-spacing)] leading-[var(--p1-line-height)] [font-style:var(--p1-font-style)]">
                {joinCommunityWrapperData.tagline}
              </p>

              <h5 className="self-stretch text-white text-[24px] md:text-[30px] font-bold font-[700] leading-[var(--h5-line-height)] tracking-[var(--h5-letter-spacing)] max-w-[600px]">
                {joinCommunityWrapperData.title}
              </h5>
            </div>

            {!user && (
              <Button
                onClick={() => setActiveAuthModal("login")}
                className="w-[300px] h-[60px] bg-[#FECC39] hover:bg-white hover:text-id-6 text-id-6 font-wix font-button font-bold font-[700] text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)] rounded-none"
              >
                {joinCommunityWrapperData.buttonText}
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