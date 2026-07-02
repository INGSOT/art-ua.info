import { Suspense } from "react";

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-[50vh] w-full bg-[#414141]" aria-hidden />}>
      {children}
    </Suspense>
  );
}
