import HeroBanner from "./main/HeroBanner";
import MainNavigation from "./main/MainNavigation";
import PlatformDescription from "./main/PlatformDescription";
import PlatformFeatures from "./main/PlatformFeatures";
import FeaturedWorks from "./main/FeaturedWorks";
import ImageCatalog from "./main/ImageCatalog";
import SupportArtists from "./main/SupportArtists";
import JoinCommunity from "./main/JoinCommunity";
import LatestNews from "../../components/LatestNews";
import FAQ from "./main/FAQ";
import Partners from "./main/Partners";
import JoinCommunityWrapper from "../../components/JoinCommunityWrapper";
import { projectsAPI } from "../../lib/api/projects";
import { publicCatalogsAPI, type PublicCatalog } from "../../lib/api/publicCatalogs";
import { artistsAPI } from "../../lib/api/artists";
import type { PublicArtist } from "../../lib/api/artists";
import { getLocale } from "next-intl/server";
import { localeToApiLanguage, type Locale } from "../../i18n/routing";

export const dynamic = "force-dynamic";

const FALLBACK_PROJECT_IMAGE = "/projects/project-photo-1.png";

function shuffleProjects<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = tmp;
  }
  return copy;
}

export default async function Home() {
  const seed = Date.now();
  const locale = (await getLocale()) as Locale;
  const language = localeToApiLanguage(locale);
  let projects: Awaited<ReturnType<typeof projectsAPI.list>> = [];
  try {
    projects = await projectsAPI.list(language, { per_page: 20, sort_by: "popular" });
  } catch (error) {
    console.error("Failed to load featured projects:", error);
  }

  const featuredProjectSlides = shuffleProjects(projects).map((project) => ({
    slug: project.slug,
    title: project.title,
    image: project.cover_url ?? FALLBACK_PROJECT_IMAGE,
    likes: project.likes_count,
    tags: project.tags,
  }));

  let catalogs: PublicCatalog[] = [];
  try {
    const result = await publicCatalogsAPI.browse(language, { per_page: 30, sort_by: "likes" });
    catalogs = result.data;
  } catch (error) {
    console.error("Failed to load catalogs:", error);
  }

  let artists: PublicArtist[] = [];
  try {
    artists = await artistsAPI.list(language, { per_page: 30 });
  } catch (error) {
    console.error("Failed to load artists:", error);
  }

  return (
    <>
    <HeroBanner />
    <MainNavigation />
    <PlatformDescription />
    <PlatformFeatures />
    <FeaturedWorks artworks={featuredProjectSlides} />
    <ImageCatalog seed={seed} catalogs={catalogs} />
    <SupportArtists />
    <JoinCommunity artists={artists} />
    <LatestNews />
    <FAQ />
    <Partners />
    <JoinCommunityWrapper />
    </>
  );
}
