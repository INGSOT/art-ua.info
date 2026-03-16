"use client";
import Header from "../../../components/Header";
import AboutMe from "../AboutMe";
import Menu from "../Menu";
import ListOfTeams from "./ListOfTeams";

export default function TeamsPage() {

  return (
    <>
      <Header isHomePage={false} />
      <AboutMe />
      <Menu activeItem="team" />
      <ListOfTeams />
    </>
  );
}

