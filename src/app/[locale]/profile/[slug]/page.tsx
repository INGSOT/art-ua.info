import { getLocale } from "next-intl/server";
import { redirect } from "@/src/i18n/navigation";

type Params = Promise<{ slug: string }>;

export default async function ProfileSlugPage({ params }: { params: Params }) {
  const { slug } = await params;
  const locale = await getLocale();
  redirect({ href: `/profile/${slug}/projects`, locale });
}
