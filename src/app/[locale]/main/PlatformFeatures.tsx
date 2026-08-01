import { getLocale, getTranslations } from "next-intl/server";
import { homeAPI } from "../../../lib/api/home";
import { localeToApiLanguage, type Locale } from "../../../i18n/routing";

export default async function PlatformFeatures() {
  const t = await getTranslations("Main.platformFeatures");
  const locale = (await getLocale()) as Locale;
  let features: { title: string; description: string }[] = [
    { title: t("inspiration.title"), description: t("inspiration.description") },
    { title: t("recognition.title"), description: t("recognition.description") },
    { title: t("learning.title"), description: t("learning.description") },
  ];

  try {
    const loaded = await homeAPI.getPlatformFeatures(localeToApiLanguage(locale));
    if (loaded.length) {
      features = loaded;
    }
  } catch (error) {
    console.error("Failed to load platform features:", error);
  }

  return (
    <section className="flex flex-col md:flex-row items-start gap-6 md:gap-[60px] p-4 md:p-10 lg:p-20 w-full bg-[#FECC39]">
      {features.map((feature, index) => (
        <div key={index} className="flex flex-col items-start gap-5 flex-1">
          <h6 className="self-stretch text-black text-[18px] font-semibold font-[family-name:var(--font-unbounded)]">
            {feature.title}
          </h6>
          <p className="self-stretch font-p1 font-[number:var(--p1-font-weight)] text-black text-[length:var(--p1-font-size)] tracking-[var(--p1-letter-spacing)] leading-[var(--p1-line-height)] [font-style:var(--p1-font-style)]">
            {feature.description}
          </p>
        </div>
      ))}
    </section>
  );
}
