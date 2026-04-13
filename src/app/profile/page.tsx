import { redirect } from "next/navigation";

type SearchParams = Promise<{ id?: string }>;

export default async function ProfileRootPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { id } = await searchParams;
  const q =
    id !== undefined && id !== ""
      ? `?id=${encodeURIComponent(id)}`
      : "?id=1";
  redirect(`/profile/projects${q}`);
}
