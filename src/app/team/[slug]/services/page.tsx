"use client";

import Header from "../../../../components/Header";
import AboutTeam from "../../AboutTeam";
import Menu from "../../Menu";
import ListOfServices from "./ListOfServices";

export default function TeamServicesPage() {
  return (
    <>
      <Header isHomePage={false} />
      <AboutTeam />
      <Menu activeItem="services" />
      <ListOfServices />
    </>
  );
}
