import { Suspense, type ReactNode } from "react";
import ProfileAuthGuard from "./ProfileAuthGuard";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ProfileAuthGuard>{children}</ProfileAuthGuard>
    </Suspense>
  );
}
