import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

// Кожен розділ сайту зберігає переклади у власному файлі, щоб їх можна
// було редагувати паралельно без конфліктів в одному великому JSON.
const NAMESPACE_FILES = [
  "common",
  "main",
  "authors",
  "projects",
  "services",
  "catalogs",
  "news",
  "faq",
  "team",
  "terms",
  "profile",
  "profileServices",
  "createProject",
  "modals",
  "moderation",
] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const namespaceModules = await Promise.all(
    NAMESPACE_FILES.map((namespace) => import(`../../messages/${locale}/${namespace}.json`))
  );

  const messages = namespaceModules.reduce<Record<string, unknown>>((acc, mod) => {
    return { ...acc, ...mod.default };
  }, {});

  return { locale, messages };
});
