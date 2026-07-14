"use client";

import { useEffect, useState } from "react";
import { authAPI } from "../lib/api/auth";
import { getApiErrorMessage } from "../lib/apiError";

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
  const [emailValue, setEmailValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await authAPI.forgotPassword(emailValue.trim());
      setIsSent(true);
    } catch (err) {
      setError(getApiErrorMessage(err, "Не вдалося надіслати лист"));
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {isSent
              ? "Перевірте вашу пошту — ми надіслали посилання для відновлення паролю."
              : "Вкажіть email, і ми надішлемо посилання для встановлення нового паролю."}
          </div>

          <div className="mt-8 w-full border-t border-[#343434]" />

          {!isSent && (
            <form onSubmit={handleSubmit}>
              <div className="mt-8 flex flex-col gap-2">
                <input
                  type="email"
                  required
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  placeholder="Електронна пошта"
                  className="font-wix w-full h-[60px] bg-[#343434] px-6 text-white placeholder-[#A0A0A0]"
                />
              </div>

              {error && (
                <p className="mt-4 font-wix text-sm text-[#FECC39] whitespace-pre-line">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 w-full h-[60px] bg-[#FECC39] text-[#343434] font-bold text-[14px] hover:bg-white transition-colors disabled:opacity-60"
              >
                {isSubmitting ? "Надсилаємо..." : "Надіслати посилання"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
