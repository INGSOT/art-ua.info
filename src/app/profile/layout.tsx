import { Suspense, type ReactNode } from "react";
import { ProfileViewProvider } from "./ProfileViewContext";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ProfileViewProvider>{children}</ProfileViewProvider>
    </Suspense>
  );
}
