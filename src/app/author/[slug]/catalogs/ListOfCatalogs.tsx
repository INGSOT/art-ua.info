"use client";

import { useEffect, useState } from "react";
import Catalog from "./Catalog";
import { publicCatalogsAPI, type PublicCatalog } from "../../../../lib/api/publicCatalogs";
import { useAuthorProfile } from "../../AuthorProfileContext";

export default function ListOfCatalogs() {
  const { slug, loading: profileLoading, notFound } = useAuthorProfile();
  const [myCatalogs, setMyCatalogs] = useState<PublicCatalog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileLoading || notFound) return;
    let ignore = false;

    (async () => {
      setLoading(true);
      try {
        const result = await publicCatalogsAPI.browse({ author_slug: slug, per_page: 50 });
        if (!ignore) setMyCatalogs(result.data);
      } catch (error) {
        if (!ignore) {
          console.error(`Failed to load catalogs for "${slug}":`, error);
          setMyCatalogs([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [slug, profileLoading, notFound]);

  if (notFound) {
    return null;
  }

  if (profileLoading || loading) {
    return (
      <section className="w-full bg-[#414141] py-8 px-4 md:px-10 lg:px-[75px] min-h-[200px] flex items-center justify-center">
        <p className="text-white text-lg">Завантаження...</p>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#414141] py-8 px-4 md:px-10 lg:px-[75px]">
      <div className="flex flex-col gap-4">
        {myCatalogs.map((catalog) => (
          <Catalog key={catalog.id} id={catalog.id} title={catalog.title} pdfUrl={catalog.pdfUrl} />
        ))}
      </div>
    </section>
  );
}
