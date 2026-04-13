import { Suspense, type ReactNode } from "react";
import { AuthorProfileProvider } from "./AuthorProfileContext";

export default function AuthorLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AuthorProfileProvider>{children}</AuthorProfileProvider>
    </Suspense>
  );
}
