"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/src/i18n/navigation";
import { authAPI } from "../../../../../lib/api/auth";
import { useAuth } from "../../../../../context/AuthContext";
import { getApiErrorMessage } from "../../../../../lib/apiError";

// Сторінка-місток для Google OAuth (як save-art/src/pages/GoogleCallbackPage.jsx):
// Google редиректить сюди з ?code=..., ми обмінюємо code на Bearer-токен
// через бекенд і заходимо в акаунт.
export default function GoogleCallbackRedirect() {
  const t = useTranslations("Modals.googleCallback");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();
  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const code = searchParams.get("code");

    if (!code) {
      setError(t("error"));
      return;
    }

    (async () => {
      try {
        const data = await authAPI.googleCallback(code);
        setSession(data.token, data.user);
        router.replace("/");
      } catch (err) {
        setError(getApiErrorMessage(err, t("error")));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#272727] px-4">
      <div className="w-full max-w-[480px] bg-[#414141] p-6 md:p-[30px] text-center">
        {error ? (
          <>
            <p className="font-wix text-white">{error}</p>
            <Link
              href="/"
              className="mt-8 inline-block w-full h-[60px] leading-[60px] text-center bg-[#FECC39] text-[#343434] font-bold text-[14px] hover:bg-white transition-colors"
            >
              {t("home")}
            </Link>
          </>
        ) : (
          <p className="font-wix text-white">{t("loading")}</p>
        )}
      </div>
    </div>
  );
}
