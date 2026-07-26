"use client";

import { useEffect, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

// /profile/[slug]/* — приватний кабінет власника, а не публічна вітрина
// (для перегляду чужих профілів є /author/[slug]). Тому доступ сюди мають
// лише авторизовані користувачі, і лише до свого власного slug.
export default function ProfileAuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const params = useParams<{ slug?: string }>();
  const router = useRouter();

  const isOwner = !params?.slug || !user || params.slug === user.slug;

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/");
      return;
    }

    if (params?.slug && params.slug !== user.slug) {
      router.replace(`/profile/${user.slug}`);
    }
  }, [loading, user, params?.slug, router]);

  if (loading || !user || !isOwner) {
    return null;
  }

  return <>{children}</>;
}
