import { Suspense, type ReactNode } from "react";
import { ProfileViewProvider } from "./ProfileViewContext";
import ProfileAuthGuard from "./ProfileAuthGuard";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ProfileAuthGuard>
        <ProfileViewProvider>{children}</ProfileViewProvider>
      </ProfileAuthGuard>
    </Suspense>
  );
}
