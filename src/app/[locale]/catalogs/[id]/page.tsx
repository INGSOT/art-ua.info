import { notFound } from "next/navigation";
import Header from "../../../../components/Header";
import LatestNews from "../../../../components/LatestNews";
import JoinCommunityWrapper from "../../../../components/JoinCommunityWrapper";
import { publicCatalogsAPI } from "../../../../lib/api/publicCatalogs";
import { localeToApiLanguage, type Locale } from "../../../../i18n/routing";
import CatalogViewer from "./CatalogViewer";

interface CatalogPageProps {
  params: Promise<{ id: string; locale: Locale }>;
}

export default async function CatalogPage({ params }: CatalogPageProps) {
  const { id, locale } = await params;

  const catalog = await publicCatalogsAPI.show(id, localeToApiLanguage(locale)).catch(() => null);

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
