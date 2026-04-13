"use client";

import Header from "../../../../../components/Header";
import ProjectInfo from "../../projects/project/ProjectInfo";
import ProjectDescription from "./ProjectDescription";

export default function ProjectPage() {
    return (
        <>
            <Header isHomePage={false} />
            <ProjectInfo />
            <ProjectDescription />
        </>
    );
}
