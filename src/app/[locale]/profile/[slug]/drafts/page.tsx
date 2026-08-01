"use client";

import Header from "../../../../../components/Header";
import AboutMe from "../../AboutMe";
import Menu from "../../Menu";
import Drafts from "./Drafts";

export default function DraftsPage() {
    return (
        <>
            <Header isHomePage={false} />
            <AboutMe />
            <Menu activeItem="drafts" />
            <Drafts />
        </>
    );
}
