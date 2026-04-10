"use client";

import Catalog from "./Catalog";
import { myCatalogs } from "../../../data/profileData";

export default function ListOfCatalogs() {

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
