"use client";

import Header from "../../../components/Header";
import AboutTheAuthor from "../AboutTheAuthor";
import MenuSection from "../MenuSection";
import ListOfCatalogs from "./ListOfCatalogs";

export default function Catalogs() {
    return (
        <>
            <Header isHomePage={false} />
            <AboutTheAuthor />
            <MenuSection activeItem="catalogs" />
            <ListOfCatalogs />
        </>
    );
}