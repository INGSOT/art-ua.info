"use client";

import { Suspense } from "react";
import Header from "../../../../../components/Header";
import TeamForm from "../../team/TeamForm";

export default function EditTeamPage() {
  return (
    <>
      <Header isHomePage={false} />
      <Suspense fallback={null}>
        <TeamForm mode="edit" />
      </Suspense>
    </>
  );
}

