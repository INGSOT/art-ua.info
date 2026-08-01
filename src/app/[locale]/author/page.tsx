import { getLocale } from "next-intl/server";
import { redirect } from "@/src/i18n/navigation";
import { DEFAULT_AUTHOR_PROFILE_SLUG } from "../../../data/profileData";

export default async function AuthorPage() {
  const locale = await getLocale();
  redirect({
    href: `/author/${DEFAULT_AUTHOR_PROFILE_SLUG}/projects`,
    locale,
  });
}
