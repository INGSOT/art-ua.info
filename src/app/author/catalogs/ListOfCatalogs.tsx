"use client";

import CatalogSection from "./CatalogSection";

export default function ListOfCatalogs() {
  const catalogs = [
    { id: 1, title: "Назва каталогу на декілька слів" },
    { id: 2, title: "Назва каталогу на декілька слів" },
    { id: 3, title: "Назва каталогу на декілька слів" },
    { id: 4, title: "Назва каталогу на декілька слів" },
  ];

  return (
    <section className="w-full bg-[#414141] py-8 px-4 md:px-10 lg:px-20">
      <div className="flex flex-col gap-4">
        {catalogs.map((catalog) => (
          <CatalogSection key={catalog.id} title={catalog.title} />
        ))}
      </div>
    </section>
  );
}
