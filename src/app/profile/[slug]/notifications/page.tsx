"use client";

import Header from "../../../../components/Header";
import AboutMe from "../../AboutMe";
import Menu from "../../Menu";
import Notifications from "./Notifications";

export default function NotificationsPage() {
  return (
    <>
      <Header isHomePage={false} />
      <AboutMe />
      <Menu activeItem="notifications" />
      <Notifications />
    </>
  );
}
