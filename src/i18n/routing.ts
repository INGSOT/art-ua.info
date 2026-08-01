import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ua", "en"],
  defaultLocale: "ua",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

export type ApiLanguage = "uk" | "en";

const LOCALE_TO_API_LANGUAGE: Record<Locale, ApiLanguage> = {
  ua: "uk",
  en: "en",
};

export function localeToApiLanguage(locale: Locale): ApiLanguage {
  return LOCALE_TO_API_LANGUAGE[locale];
}
