import { Suspense } from "react";
import GoogleCallbackRedirect from "./GoogleCallbackRedirect";

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={null}>
      <GoogleCallbackRedirect />
    </Suspense>
  );
}
