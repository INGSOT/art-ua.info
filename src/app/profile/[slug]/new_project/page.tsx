"use client";

import Header from "../../../../components/Header";
import ProjectCreating from "./ProjectCreating";
import SoldProject from "./SoldProject";
import ProjectPublication from "./ProjectPublication";

export default function NewProjectPage() {
  return (
    <>
      <Header isHomePage={false} />
      <ProjectCreating />
      <SoldProject />
      <ProjectPublication />
    </>
  );
}
