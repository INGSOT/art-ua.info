import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { catalogsAPI, type ArtCategory } from "../../../lib/api/catalogs";
import { navigationItems } from "../../../data/mainData";
import { localeToApiLanguage, type Locale } from "../../../i18n/routing";

export default async function MainNavigation() {
  const t = await getTranslations("Main.navigation");
  const locale = (await getLocale()) as Locale;
  let categories: ArtCategory[] = [];
  try {
    categories = await catalogsAPI.categories({ language: localeToApiLanguage(locale) });
  } catch (error) {
    console.error("Failed to load categories:", error);
  }

  const items = categories.length
    ? categories.map((category) => ({ slug: category.value as string | null, label: category.label }))
    : navigationItems.map((item) => ({ slug: null as string | null, label: t(item.key) }));

  return (
    <nav className="flex items-center justify-center gap-4 md:gap-[30px] px-4 md:px-10 lg:px-20 py-6 md:py-10 w-full bg-[#414141] flex-wrap">
      {items.map((item, index) => (
        <Link
          key={item.slug ?? index}
          href={item.slug ? `/authors?art_category=${item.slug}` : "/authors"}
          className="inline-flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80"
        >
          <span className="font-bold text-white text-center text-sm md:text-base">
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
