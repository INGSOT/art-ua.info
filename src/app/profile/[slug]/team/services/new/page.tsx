"use client";

import { Suspense } from "react";
import Header from "../../../../../../components/Header";
import TeamServiceForm from "../TeamServiceForm";

export default function NewTeamServicePage() {
  return (
    <>
      <Header isHomePage={false} />
      <Suspense fallback={null}>
        <TeamServiceForm mode="create" />
      </Suspense>
    </>
  );
}
