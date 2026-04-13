"use client";

import Header from "../../../../components/Header";
import AboutTeam from "../../AboutTeam";
import Menu from "../../Menu";
import Projects from "./Projects";

export default function TeamProjectsPage() {
  return (
    <>
      <Header isHomePage={false} />
      <AboutTeam />
      <Menu activeItem="projects" />
      <Projects />
    </>
  );
}
