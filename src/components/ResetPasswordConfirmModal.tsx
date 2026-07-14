"use client";

import { useState } from "react";
import Link from "next/link";
import { authAPI } from "../lib/api/auth";
import { getApiErrorMessage } from "../lib/apiError";

interface ResetPasswordConfirmModalProps {
  token: string | null;
  email: string | null;
}

export default function ResetPasswordConfirmModal({ token, email }: ResetPasswordConfirmModalProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [repeatPasswordValue, setRepeatPasswordValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const isLinkInvalid = !token || !email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordValue !== repeatPasswordValue) {
      setError("Паролі не співпадають");
      return;
    }

    if (!token || !email) return;

    setIsSubmitting(true);
    setError("");
    try {
      await authAPI.resetPassword(token, email, passwordValue, repeatPasswordValue);
      setIsSuccess(true);
    } catch (err) {
      setError(getApiErrorMessage(err, "Не вдалося змінити пароль"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#272727] px-4">
      <div className="w-full max-w-[480px] bg-[#414141] p-6 md:p-[30px]">
        <div className="font-bold text-white text-[16px] font-[family-name:var(--font-unbounded)]">
          Встановлення нового паролю
        </div>

        <div className="mt-8 w-full border-t border-[#343434]" />

        <div className="mt-8">
          {isLinkInvalid ? (
            <p className="font-wix text-white">
              Посилання недійсне або застаріле. Запросіть відновлення паролю ще раз.
            </p>
          ) : isSuccess ? (
            <>
              <p className="font-wix text-white">Пароль успішно змінено.</p>
              <Link
                href="/"
                className="mt-8 inline-block w-full h-[60px] leading-[60px] text-center bg-[#FECC39] text-[#343434] font-bold text-[14px] hover:bg-white transition-colors"
              >
                На головну
              </Link>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <div className="relative w-full h-[60px]">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    required
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    placeholder="Новий пароль"
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
                    placeholder="Повторіть новий пароль"
                    className="font-wix w-full h-full bg-[#343434] px-6 pr-16 text-white placeholder-[#A0A0A0]"
                  />
                  <button
                    type="button"
                    onClick={() => setIsRepeatPasswordVisible((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center"
                    aria-label={isRepeatPasswordVisible ? "Сховати пароль" : "Показати пароль"}
                  >
                    <img
                      src={isRepeatPasswordVisible ? "/visible.svg" : "/hidden.svg"}
                      alt={isRepeatPasswordVisible ? "Visible" : "Hidden"}
                      className="w-6 h-6"
                    />
                  </button>
                </div>
              </div>

              {error && (
                <p className="mt-4 font-wix text-sm text-[#FECC39] whitespace-pre-line">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 w-full h-[60px] bg-[#FECC39] text-[#343434] font-bold text-[14px] hover:bg-white transition-colors disabled:opacity-60"
              >
                {isSubmitting ? "Зберігаємо..." : "Зберегти пароль"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
