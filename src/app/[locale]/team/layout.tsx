import { Suspense, type ReactNode } from "react";
import { TeamProfileProvider } from "./TeamProfileContext";

export default function TeamLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <TeamProfileProvider>{children}</TeamProfileProvider>
    </Suspense>
  );
}
