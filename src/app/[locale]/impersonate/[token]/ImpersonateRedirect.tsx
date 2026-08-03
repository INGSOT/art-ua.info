"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import { Link } from "@/src/i18n/navigation";
import { authAPI } from "../../../../lib/api/auth";
import { useAuth } from "../../../../context/AuthContext";
import { getApiErrorMessage } from "../../../../lib/apiError";

export default function ImpersonateRedirect({ token }: { token: string }) {
  const t = useTranslations("Modals.impersonate");
  const router = useRouter();
  const { setSession } = useAuth();
  const [error, setError] = useState("");
  const exchanged = useRef(false);

  useEffect(() => {
    // Грант одноразовий — у dev/StrictMode ефект може виконатись двічі,
    // другий виклик впаде в 404 і невірно покаже помилку.
    if (exchanged.current) return;
    exchanged.current = true;

    (async () => {
      try {
        const data = await authAPI.exchangeImpersonationToken(token);
        setSession(data.token, data.user);
        router.replace(data.redirect_path);
      } catch (err) {
        setError(getApiErrorMessage(err, t("error")));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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
