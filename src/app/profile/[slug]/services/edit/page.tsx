"use client";

import Header from "../../../../../components/Header";
import ServiceForm from "../ServiceForm";

export default function EditServicePage() {
  return (
    <>
      <Header isHomePage={false} />
      <ServiceForm mode="edit" />
    </>
  );
}

