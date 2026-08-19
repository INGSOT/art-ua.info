"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage, getApiFieldErrors } from "../lib/apiError";
import { authAPI } from "../lib/api/auth";
import { SAVE_ART_DOMAIN } from "../lib/siteDomains";

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
  const t = useTranslations("Modals");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [repeatPasswordValue, setRepeatPasswordValue] = useState("");
  const [isAgreementHovered, setIsAgreementHovered] = useState(false);
  const [isAgreementAccepted, setIsAgreementAccepted] = useState(false);
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    setError("");
    try {
      const { url } = await authAPI.getGoogleRedirectUrl();
      window.location.href = url;
    } catch (err) {
      setError(getApiErrorMessage(err, t("registration.error")));
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAgreementAccepted) {
      setError(t("registration.agreementRequired"));
      return;
    }

    if (passwordValue !== repeatPasswordValue) {
      setError(t("registration.passwordMismatch"));
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await register(nameValue, emailValue, passwordValue, repeatPasswordValue);
      setIsSent(true);
    } catch (err) {
      const fieldErrors = getApiFieldErrors(err);
      if (fieldErrors?.email) {
        setError(t("registration.emailTaken"));
      } else {
        setError(getApiErrorMessage(err, t("registration.error")));
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
              {SAVE_ART_DOMAIN}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#343434] transition-colors"
              aria-label={t("shared.close")}
            >
              <img
                src="/yellow_cross.svg"
                alt={t("shared.close")}
                className="w-6 h-6"
              />
            </button>
          </div>

          <div className="mt-8 font-bold text-white text-[16px] leading-[1.2] font-[family-name:var(--font-unbounded)]">
            {SAVE_ART_DOMAIN} {t("shared.platformDescription")}
          </div>

          <div className="mt-8 w-full border-t border-[#343434]" />

          {isSent ? (
            <p className="mt-8 font-wix text-white">
              {t("registration.checkEmail")}
            </p>
          ) : (
            <>
              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="font-bold text-[16px] leading-[1.2] font-[family-name:var(--font-unbounded)] transition-colors text-white hover:text-[#FECC39]"
                >
                  {t("shared.loginTab")}
                </button>
                <button
                  type="button"
                  className="font-bold text-[16px] leading-[1.2] font-[family-name:var(--font-unbounded)] transition-colors text-[#FECC39]"
                >
                  {t("shared.registerTab")}
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mt-8 flex flex-col gap-2">
                  <input
                    type="text"
                    required
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    placeholder={t("registration.namePlaceholder")}
                    className="font-wix w-full h-[60px] bg-[#343434] px-6 text-white placeholder-[#A0A0A0]"
                  />

                  <input
                    type="email"
                    required
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    placeholder={t("registration.emailPlaceholder")}
                    className="font-wix w-full h-[60px] bg-[#343434] px-6 text-white placeholder-[#A0A0A0]"
                  />

                  <div className="relative w-full h-[60px]">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      required
                      value={passwordValue}
                      onChange={(e) => setPasswordValue(e.target.value)}
                      placeholder={t("registration.passwordPlaceholder")}
                      className="font-wix w-full h-full bg-[#343434] px-6 pr-16 text-white placeholder-[#A0A0A0]"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center"
                      aria-label={
                        isPasswordVisible
                          ? t("shared.hidePassword")
                          : t("shared.showPassword")
                      }
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
                      placeholder={t("registration.repeatPasswordPlaceholder")}
                      className="font-wix w-full h-full bg-[#343434] px-6 pr-16 text-white placeholder-[#A0A0A0]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setIsRepeatPasswordVisible((prev) => !prev)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center"
                      aria-label={
                        isRepeatPasswordVisible
                          ? t("shared.hidePassword")
                          : t("shared.showPassword")
                      }
                    >
                      <img
                        src={
                          isRepeatPasswordVisible
                            ? "/visible.svg"
                            : "/hidden.svg"
                        }
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
                      alt={t("shared.agreementImageAlt")}
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
                    {t("registration.agreementText")}
                  </span>
                </button>

                {error && (
                  <p className="mt-4 font-wix text-sm text-[#FECC39] whitespace-pre-line">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-8 w-full h-[60px] bg-[#FECC39] text-[#343434] font-bold text-[16px] hover:bg-white transition-colors disabled:opacity-60"
                >
                  {isSubmitting ? t("shared.wait") : t("registration.submit")}
                </button>
              </form>

              {process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true" && (
                <>
                  <div className="mt-8 w-full border-t border-[#343434]" />

                  <button
                    type="button"
                    onClick={handleGoogleRegister}
                    disabled={isGoogleLoading}
                    className="mt-8 w-full flex items-center justify-center gap-3 text-white hover:text-[#FECC39] transition-colors disabled:opacity-50"
                  >
                    <img src="/google.svg" alt="Google" className="w-7 h-7" />
                    <span className="font-bold text-[16px] leading-[1.2] font-[family-name:var(--font-unbounded)]">
                      {t("shared.googleContinue")}
                    </span>
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
