"use client";

import { Suspense } from "react";
import Header from "../../../../../../../components/Header";
import TeamServiceForm from "../TeamServiceForm";

export default function EditTeamServicePage() {
  return (
    <>
      <Header isHomePage={false} />
      <Suspense fallback={null}>
        <TeamServiceForm mode="edit" />
      </Suspense>
    </>
  );
}
