"use client";

import Header from "../../../../components/Header";
import ProjectCreating from "./ProjectCreating";

export default function NewProjectPage() {
  return (
    <>
      <Header isHomePage={false} />
      <ProjectCreating />
    </>
  );
}
