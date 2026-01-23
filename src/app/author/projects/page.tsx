"use client";

import Header from "../../../components/Header";
import AboutTheAuthor from "../AboutTheAuthor";
import Menu from "../Menu";
import Projects from "./Projects";

export default function ProjectsPage() {
    return (
        <>
            <Header isHomePage={false} />
            <AboutTheAuthor />
            <Menu activeItem="projects" />
            <Projects />
        </>
    );
}