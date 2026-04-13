"use client";

import Header from "../../../../../components/Header";
import TeamForm from "../../team/TeamForm";

export default function EditTeamPage() {
  return (
    <>
      <Header isHomePage={false} />
      <TeamForm mode="edit" />
    </>
  );
}

