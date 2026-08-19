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
  // Три незалежні запити — виконуємо паралельно (Promise.allSettled), а не
  // послідовно один за одним, інакше час завантаження головної складається
  // з усіх трьох round-trip'ів замість найповільнішого з них.
  const [projectsResult, catalogsResult, artistsResult] = await Promise.allSettled([
    projectsAPI.list(language, { per_page: 20, sort_by: "popular" }),
    publicCatalogsAPI.browse(language, { per_page: 30, sort_by: "likes" }),
    artistsAPI.list(language, { per_page: 30 }),
  ]);

  let projects: Awaited<ReturnType<typeof projectsAPI.list>> = [];
  if (projectsResult.status === "fulfilled") {
    projects = projectsResult.value;
  } else {
    console.error("Failed to load featured projects:", projectsResult.reason);
  }

  const featuredProjectSlides = shuffleProjects(projects).map((project) => ({
    slug: project.slug,
    title: project.title,
    image: project.cover_url ?? FALLBACK_PROJECT_IMAGE,
    likes: project.likes_count,
    tags: project.tags,
  }));

  let catalogs: PublicCatalog[] = [];
  if (catalogsResult.status === "fulfilled") {
    catalogs = catalogsResult.value.data;
  } else {
    console.error("Failed to load catalogs:", catalogsResult.reason);
  }

  let artists: PublicArtist[] = [];
  if (artistsResult.status === "fulfilled") {
    artists = artistsResult.value;
  } else {
    console.error("Failed to load artists:", artistsResult.reason);
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
