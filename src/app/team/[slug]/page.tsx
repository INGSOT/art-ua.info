import { redirect } from "next/navigation";

export default async function TeamSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/team/${encodeURIComponent(slug)}/projects`);
}
