"use client";

import Header from "../../../../components/Header";
import EditProfileForm from "./EditProfileForm";

export default function EditProfilePage() {
  return (
    <>
      <Header isHomePage={false} />
      <EditProfileForm />
    </>
  );
}
