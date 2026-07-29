"use client";

import Header from "../../../../components/Header";
import ProjectCreating from "../create-project/ProjectCreating";

export default function EditProjectPage() {
  return (
    <>
      <Header isHomePage={false} />
      <ProjectCreating />
    </>
  );
}
