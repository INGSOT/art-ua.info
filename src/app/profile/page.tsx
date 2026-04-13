import { redirect } from "next/navigation";
import { DEFAULT_AUTHOR_PROFILE_SLUG } from "../../data/profileData";

export default function ProfileRootPage() {
  redirect(`/profile/${DEFAULT_AUTHOR_PROFILE_SLUG}/projects`);
}
