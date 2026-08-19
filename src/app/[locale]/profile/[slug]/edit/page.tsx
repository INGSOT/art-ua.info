"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import Header from "../../../../../components/Header";
import { profileAPI } from "../../../../../lib/api/profile";
import { getApiErrorMessage } from "../../../../../lib/apiError";

// Редагування профілю переїхало в Filament-панель бекенду — ця сторінка лише
// відкриває одноразовий SSO-грант (той самий механізм, що й save-art SPA) і
// одразу перекидає користувача туди вже залогіненим.
export default function EditProfilePage() {
  const t = useTranslations("Profile.edit");
  const [error, setError] = useState("");
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;

    (async () => {
      try {
        const { url } = await profileAPI.requestProfileSso("/profile/profile");
        window.location.href = url;
      } catch (err) {
        setError(getApiErrorMessage(err, t("error")));
      }
    })();
  }, [t]);

  return (
    <>
      <Header isHomePage={false} />
      <div className="flex items-center justify-center min-h-[60vh] bg-[#272727] px-4">
        <div className="w-full max-w-[480px] bg-[#414141] p-6 md:p-[30px] text-center">
          {error ? (
            <>
              <p className="font-wix text-white">{error}</p>
              <Link
                href="/"
                className="mt-8 inline-block w-full h-[60px] leading-[60px] text-center bg-[#FECC39] text-[#343434] font-bold text-[14px] hover:bg-white transition-colors"
              >
                {t("backHome")}
              </Link>
            </>
          ) : (
            <p className="font-wix text-white">{t("redirecting")}</p>
          )}
        </div>
      </div>
    </>
  );
}
