"use client";

import Header from "../../../components/Header";
import AboutTheAuthor from "../AboutTheAuthor";
import Menu from "../Menu";
import ListOfCatalogs from "./ListOfCatalogs";

export default function CatalogsPage() {
    return (
        <>
            <Header isHomePage={false} />
            <AboutTheAuthor />
            <Menu activeItem="catalogs" />
            <ListOfCatalogs />
        </>
    );
}