"use client";

import Header from "../../../components/Header";
import AboutTeam from "../AboutTeam";
import Menu from "../Menu";
import Participants from "./Participants";

export default function TeamParticipantsPage() {
  return (
    <>
      <Header isHomePage={false} />
      <AboutTeam />
      <Menu activeItem="participants" />
      <Participants />
    </>
  );
}
