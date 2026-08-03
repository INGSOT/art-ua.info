"use client";
import Header from "../../../../../components/Header";
import AboutMe from "../../AboutMe";
import ListOfTeams from "./ListOfTeams";

export default function TeamsPage() {

  return (
    <>
      <Header isHomePage={false} />
      <AboutMe />
      <ListOfTeams />
    </>
  );
}

