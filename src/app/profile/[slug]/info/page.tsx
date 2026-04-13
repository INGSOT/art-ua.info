"use client";

import Header from "../../../../components/Header";
import AboutMe from "../../AboutMe";
import Menu from "../../Menu";
import Information from "../info/Information";

export default function InfoPage() {
  return (
    <>
      <Header isHomePage={false} />
      <AboutMe />
      <Menu activeItem="info" />
      <Information />
    </>
  );
}
