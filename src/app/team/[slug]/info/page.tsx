"use client";

import Header from "../../../../components/Header";
import AboutTeam from "../../AboutTeam";
import Menu from "../../Menu";
import TeamInformation from "./TeamInformation";

export default function TeamInfoPage() {
  return (
    <>
      <Header isHomePage={false} />
      <AboutTeam />
      <Menu activeItem="info" />
      <TeamInformation />
    </>
  );
}
