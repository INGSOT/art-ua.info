"use client";

import { Suspense } from "react";
import Header from "../../../../../components/Header";
import AboutMe from "../../../AboutMe";
import Menu from "../../../Menu";
import TeamServices from "./TeamServices";

export default function TeamServicesPage() {
  return (
    <>
      <Header isHomePage={false} />
      <AboutMe />
      <Menu activeItem="team" />
      <Suspense fallback={null}>
        <TeamServices />
      </Suspense>
    </>
  );
}
