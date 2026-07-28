"use client";

import { Suspense } from "react";
import Header from "../../../../../components/Header";
import ServiceForm from "../ServiceForm";

export default function NewServicePage() {
  return (
    <>
      <Header isHomePage={false} />
      <Suspense fallback={null}>
        <ServiceForm mode="create" />
      </Suspense>
    </>
  );
}
