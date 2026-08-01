import { getLocale } from "next-intl/server";
import { redirect } from "@/src/i18n/navigation";

export default async function TeamSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  redirect({ href: `/team/${encodeURIComponent(slug)}/projects`, locale });
}
