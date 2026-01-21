"use client";

import Header from "../../../components/Header";
import AboutTheAuthor from "../AboutTheAuthor";
import MenuSection from "../MenuSection";
import InformationSection from "./InformationSection";

export default function Info() {
    return (
        <>
            <Header isHomePage={false} />
            <AboutTheAuthor />
            <MenuSection activeItem="info" />
            <InformationSection />
        </>
    );
}