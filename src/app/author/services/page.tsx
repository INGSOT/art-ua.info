"use client";

import Header from "../../../components/Header";
import AboutTheAuthor from "../AboutTheAuthor";
import MenuSection from "../MenuSection";
import ListOfServices from "./ListOfServices";



export default function Services() {
    return (
        <>
            <Header isHomePage={false} />
            <AboutTheAuthor />
            <MenuSection activeItem="services" />
            <ListOfServices />
        </>
    );
}