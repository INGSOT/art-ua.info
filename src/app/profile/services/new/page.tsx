"use client";

import Header from "../../../../components/Header";
import NewServiceForm from "./NewServiceForm";

export default function NewServicePage() {
  return (
    <>
      <Header isHomePage={false} />
      <NewServiceForm />
    </>
  );
}
