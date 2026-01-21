"use client";

import Header from "../../../components/Header";
import AboutTheAuthor from "../AboutTheAuthor";
import MenuSection from "../MenuSection";
import ProjectsSection from "../ProjectsSection";

export default function Projects() {
    return (
        <>
            <Header isHomePage={false} />
            <AboutTheAuthor />
            <MenuSection activeItem="projects" />

            <ProjectsSection />
        </>
    );
}