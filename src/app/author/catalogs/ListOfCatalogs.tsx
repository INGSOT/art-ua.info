"use client";

import Catalog from "./Catalog";
import { authorCatalogs } from "../../../data/authorData";

export default function ListOfCatalogs() {

  return (
    <section className="w-full bg-[#414141] py-8 px-4 md:px-10 lg:px-20">
      <div className="flex flex-col gap-4">
        {authorCatalogs.map((catalog) => (
          <Catalog key={catalog.id} title={catalog.title} />
        ))}
      </div>
    </section>
  );
}
