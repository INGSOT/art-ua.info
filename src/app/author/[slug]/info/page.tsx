"use client";

import Header from "../../../../components/Header";
import AboutTheAuthor from "../../AboutTheAuthor";
import Menu from "../../Menu";
import Information from "./Information";

export default function InfoPage() {
    return (
        <>
            <Header isHomePage={false} />
            <AboutTheAuthor />
            <Menu activeItem="info" />
            <Information />
        </>
    );
}