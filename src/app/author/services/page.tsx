"use client";

import Header from "../../../components/Header";
import AboutTheAuthor from "../AboutTheAuthor";
import Menu from "../Menu";
import ListOfServices from "./ListOfServices";

export default function ServicesPage() {
    return (
        <>
            <Header isHomePage={false} />
            <AboutTheAuthor />
            <Menu activeItem="services" />
            <ListOfServices />
        </>
    );
}