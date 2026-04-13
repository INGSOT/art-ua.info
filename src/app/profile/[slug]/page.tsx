import { redirect } from "next/navigation";

type Params = Promise<{ slug: string }>;

export default async function ProfileSlugPage({ params }: { params: Params }) {
  const { slug } = await params;
  redirect(`/profile/${slug}/projects`);
}
