"use client";

import Header from "../../../../../components/Header";
import ServiceForm from "../ServiceForm";

export default function NewServicePage() {
  return (
    <>
      <Header isHomePage={false} />
      <ServiceForm mode="create" />
    </>
  );
}
