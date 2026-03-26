"use client";

import { useEffect, useState } from "react";

interface ResetPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  disableAnimation?: boolean;
}

export default function ResetPassModal({
  isOpen,
  onClose,
  onSwitchToLogin,
  disableAnimation = false,
}: ResetPassModalProps) {
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [repeatPasswordValue, setRepeatPasswordValue] = useState("");

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

      <div
        className={`fixed right-0 top-0 h-full w-full md:w-[600px] bg-[#414141] z-50 flex flex-col overflow-y-auto ${
          disableAnimation ? "" : "animate-slide-in"
        }`}
      >
        <div className="p-6 md:p-[30px] flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="w-10 h-10 flex items-center justify-center hover:bg-[#343434] transition-colors"
                aria-label="Повернутись до входу"
              >
                <img
                  src="/yellow_triangle_left.svg"
                  alt="Повернутись до входу"
                  className="w-6 h-6"
                />
              </button>
              <div className="font-bold text-white text-[16px] font-[family-name:var(--font-unbounded)]">
                Відновлення паролю
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#343434] transition-colors"
              aria-label="Закрити"
            >
              <img src="/yellow_cross.svg" alt="Закрити" className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-8 font-bold text-white text-[16px] leading-[1.2] font-[family-name:var(--font-unbounded)]">
            Створіть новий пароль для свого облікового запису.
          </div>

          <div className="mt-8 w-full border-t border-[#343434]" />

          <div className="mt-8 flex flex-col gap-2">
            <input
              type="text"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              placeholder="Електронна пошта"
              className="font-wix w-full h-[60px] bg-[#343434] px-6 text-white placeholder-[#A0A0A0]"
            />

            <div className="relative w-full h-[60px]">
              <input
                type={isNewPasswordVisible ? "text" : "password"}
                value={newPasswordValue}
                onChange={(e) => setNewPasswordValue(e.target.value)}
                placeholder="Новий пароль"
                className="font-wix w-full h-full bg-[#343434] px-6 pr-16 text-white placeholder-[#A0A0A0]"
              />
              <button
                type="button"
                onClick={() => setIsNewPasswordVisible((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center"
                aria-label={
                  isNewPasswordVisible ? "Сховати пароль" : "Показати пароль"
                }
              >
                <img
                  src={isNewPasswordVisible ? "/visible.svg" : "/hidden.svg"}
                  alt={isNewPasswordVisible ? "Visible" : "Hidden"}
                  className="w-6 h-6"
                />
              </button>
            </div>

            <div className="relative w-full h-[60px]">
              <input
                type={isRepeatPasswordVisible ? "text" : "password"}
                value={repeatPasswordValue}
                onChange={(e) => setRepeatPasswordValue(e.target.value)}
                placeholder="Повторіть новий пароль"
                className="font-wix w-full h-full bg-[#343434] px-6 pr-16 text-white placeholder-[#A0A0A0]"
              />
              <button
                type="button"
                onClick={() => setIsRepeatPasswordVisible((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center"
                aria-label={
                  isRepeatPasswordVisible ? "Сховати пароль" : "Показати пароль"
                }
              >
                <img
                  src={isRepeatPasswordVisible ? "/visible.svg" : "/hidden.svg"}
                  alt={isRepeatPasswordVisible ? "Visible" : "Hidden"}
                  className="w-6 h-6"
                />
              </button>
            </div>
          </div>

          <button
            type="button"
            className="mt-8 w-full h-[60px] bg-[#FECC39] text-[#343434] font-bold text-[14px] hover:bg-white transition-colors"
          >
            Увійти
          </button>
        </div>
      </div>
    </>
  );
}
