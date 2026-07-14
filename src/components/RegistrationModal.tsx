"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getApiErrorMessage, getApiFieldErrors } from "../lib/apiError";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  disableAnimation?: boolean;
}

export default function RegistrationModal({
  isOpen,
  onClose,
  onSwitchToLogin,
  disableAnimation = false,
}: RegistrationModalProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [repeatPasswordValue, setRepeatPasswordValue] = useState("");
  const [isAgreementHovered, setIsAgreementHovered] = useState(false);
  const [isAgreementAccepted, setIsAgreementAccepted] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAgreementAccepted) {
      setError("Потрібно прийняти умови використання платформи");
      return;
    }

    if (passwordValue !== repeatPasswordValue) {
      setError("Паролі не співпадають");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await register(nameValue, emailValue, passwordValue, repeatPasswordValue);
      showToast("Реєстрація успішна! Вітаємо у спільноті.", "green");
      onClose();
    } catch (err) {
      const fieldErrors = getApiFieldErrors(err);
      if (fieldErrors?.email) {
        setError("Користувач з таким email вже існує. Спробуйте увійти або відновити пароль.");
      } else {
        setError(getApiErrorMessage(err, "Не вдалося зареєструватися"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
        } scrollbar-hide`}
      >
        <div className="p-6 md:p-[30px] flex-1">
          <div className="flex items-center justify-between">
            <div className="font-bold text-white text-[16px] font-[family-name:var(--font-unbounded)]">
              save-art.in.ua
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
            save-art.in.ua - платформа для митців та бажаючих долучитись до
            створення, розвитку і збереження новітнього українського мистецтва
          </div>

          <div className="mt-8 w-full border-t border-[#343434]" />

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-bold text-[16px] leading-[1.2] font-[family-name:var(--font-unbounded)] transition-colors text-white hover:text-[#FECC39]"
            >
              Вхід до спільноти
            </button>
            <button
              type="button"
              className="font-bold text-[16px] leading-[1.2] font-[family-name:var(--font-unbounded)] transition-colors text-[#FECC39]"
            >
              Реєстрація
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-8">
            <button
              type="button"
              className="font-wix text-sm text-white hover:text-[#FECC39] transition-colors"
            >
              save-art.in.ua
            </button>
            <button
              type="button"
              className="font-wix text-sm text-white hover:text-[#FECC39] transition-colors"
            >
              art-ua.com
            </button>
            <button
              type="button"
              className="font-wix text-sm text-white hover:text-[#FECC39] transition-colors"
            >
              art-ua.info
            </button>
          </div>

          <form onSubmit={handleSubmit}>
          <div className="mt-8 flex flex-col gap-2">
            <input
              type="text"
              required
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              placeholder="Ваше ім'я"
              className="font-wix w-full h-[60px] bg-[#343434] px-6 text-white placeholder-[#A0A0A0]"
            />

            <input
              type="email"
              required
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              placeholder="Електронна пошта"
              className="font-wix w-full h-[60px] bg-[#343434] px-6 text-white placeholder-[#A0A0A0]"
            />

            <div className="relative w-full h-[60px]">
              <input
                type={isPasswordVisible ? "text" : "password"}
                required
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                placeholder="Пароль"
                className="font-wix w-full h-full bg-[#343434] px-6 pr-16 text-white placeholder-[#A0A0A0]"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center"
                aria-label={isPasswordVisible ? "Сховати пароль" : "Показати пароль"}
              >
                <img
                  src={isPasswordVisible ? "/visible.svg" : "/hidden.svg"}
                  alt={isPasswordVisible ? "Visible" : "Hidden"}
                  className="w-6 h-6"
                />
              </button>
            </div>

            <div className="relative w-full h-[60px]">
              <input
                type={isRepeatPasswordVisible ? "text" : "password"}
                required
                value={repeatPasswordValue}
                onChange={(e) => setRepeatPasswordValue(e.target.value)}
                placeholder="Повторіть пароль"
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
            className="mt-8 w-full flex items-center gap-3 text-left"
            onClick={() => setIsAgreementAccepted((prev) => !prev)}
            onMouseEnter={() => setIsAgreementHovered(true)}
            onMouseLeave={() => setIsAgreementHovered(false)}
          >
            <span
              className={`w-[18px] h-[18px] shrink-0 flex items-center justify-center transition-colors ${
                isAgreementAccepted ? "bg-[#FECC39]" : "bg-transparent"
              }`}
            >
              <img
                src={
                  isAgreementAccepted
                    ? "/grey_check.svg"
                    : isAgreementHovered
                    ? "/yellow_check.svg"
                    : "/grey_check.svg"
                }
                alt="Умови використання"
                className="w-[14px] h-[11px]"
              />
            </span>
            <span
              className={`font-bold text-[16px] font-[family-name:var(--font-unbounded)] ${
                isAgreementAccepted || isAgreementHovered
                  ? "text-[#FECC39]"
                  : "text-white"
              }`}
            >
              Я приймаю умови використання платформи
            </span>
          </button>

          {error && (
            <p className="mt-4 font-wix text-sm text-[#FECC39] whitespace-pre-line">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 w-full h-[60px] bg-[#FECC39] text-[#343434] font-bold text-[16px] hover:bg-white transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Зачекайте..." : "Зареєструватись"}
          </button>
          </form>

          {process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true" && (
            <>
              <div className="mt-8 w-full border-t border-[#343434]" />

              <button
                type="button"
                className="mt-8 w-full flex items-center justify-center gap-3 text-white hover:text-[#FECC39] transition-colors"
              >
                <img src="/google.svg" alt="Google" className="w-7 h-7" />
                <span className="font-bold text-[16px] leading-[1.2] font-[family-name:var(--font-unbounded)]">
                  Продовжити з Google
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
