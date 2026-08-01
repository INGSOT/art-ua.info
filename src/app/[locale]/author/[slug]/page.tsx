import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { redirect } from "@/src/i18n/navigation";
import { artistsAPI } from "../../../../lib/api/artists";
import { localeToApiLanguage, type Locale } from "../../../../i18n/routing";

type Params = Promise<{ slug: string }>;

export default async function AuthorSlugPage({ params }: { params: Params }) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;

  try {
    await artistsAPI.get(slug, localeToApiLanguage(locale));
  } catch (error) {
    console.error(`Failed to load artist "${slug}":`, error);
    notFound();
  }

  redirect({ href: `/author/${slug}/projects`, locale });
}
