"use client";

import { useEffect } from "react";
import { useRouter } from "@/src/i18n/navigation";
import { useAuth } from "../../../../context/AuthContext";
import { profileAPI } from "../../../../lib/api/profile";

// Особистий кабінет переїхав у Filament-панель бекенду (як у save-art) —
// замість внутрішньої сторінки одразу відкриваємо SSO-грант.
export default function ProfileSlugPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/");
      return;
    }

    void profileAPI.redirectToProfile("/profile/projects");
  }, [loading, user, router]);

  return null;
}
