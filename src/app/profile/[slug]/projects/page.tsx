"use client";

import Header from "../../../../components/Header";
import AboutMe from "../../AboutMe";
import Menu from "../../Menu";
import Projects from "../projects/Projects";

export default function ProjectsPage() {
    return (
        <>
            <Header isHomePage={false} />
            <AboutMe />
            <Menu activeItem="projects" />
            <Projects />
        </>
    );
}