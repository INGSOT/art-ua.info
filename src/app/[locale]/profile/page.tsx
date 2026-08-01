"use client";

import { useEffect } from "react";
import { useRouter } from "@/src/i18n/navigation";
import { useAuth } from "../../../context/AuthContext";

export default function ProfileRootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? `/profile/${user.slug}/projects` : "/");
  }, [loading, user, router]);

  return null;
}
