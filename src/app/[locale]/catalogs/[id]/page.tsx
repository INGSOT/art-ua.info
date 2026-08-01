import { notFound } from "next/navigation";
import Header from "../../../../components/Header";
import LatestNews from "../../../../components/LatestNews";
import JoinCommunityWrapper from "../../../../components/JoinCommunityWrapper";
import { publicCatalogsAPI } from "../../../../lib/api/publicCatalogs";
import CatalogViewer from "./CatalogViewer";

interface CatalogPageProps {
  params: Promise<{ id: string }>;
}

export default async function CatalogPage({ params }: CatalogPageProps) {
  const { id } = await params;

  const catalog = await publicCatalogsAPI.show(id).catch(() => null);

  if (!catalog) {
    notFound();
  }

  return (
    <>
      <Header isHomePage={false} />
      <CatalogViewer catalog={catalog} />
      <LatestNews />
      <JoinCommunityWrapper />
    </>
  );
}
