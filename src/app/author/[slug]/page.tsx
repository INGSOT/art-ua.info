import { notFound, redirect } from "next/navigation";
import { artistsAPI } from "../../../lib/api/artists";

type Params = Promise<{ slug: string }>;

export default async function AuthorSlugPage({ params }: { params: Params }) {
  const { slug } = await params;

  try {
    await artistsAPI.get(slug);
  } catch (error) {
    console.error(`Failed to load artist "${slug}":`, error);
    notFound();
  }

  redirect(`/author/${slug}/projects`);
}
