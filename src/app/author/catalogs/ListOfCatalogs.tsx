"use client";

import Catalog from "./Catalog";
import { getMyCatalogsByAuthorId } from "../../../data/catalogsData";
import { useAuthorProfile } from "../AuthorProfileContext";

export default function ListOfCatalogs() {
  const { id: authorId } = useAuthorProfile();
  const myCatalogs = getMyCatalogsByAuthorId(authorId);

  return (
    <section className="w-full bg-[#414141] py-8 px-4 md:px-10 lg:px-[75px]">
      <div className="flex flex-col gap-4">
        {myCatalogs.map((catalog) => (
          <Catalog key={catalog.id} title={catalog.title} />
        ))}
      </div>
    </section>
  );
}
