import HeroBanner from "./main/HeroBanner";
import MainNavigation from "./main/MainNavigation";
import PlatformDescription from "./main/PlatformDescription";
import PlatformFeatures from "./main/PlatformFeatures";
import FeaturedWorks from "./main/FeaturedWorks";
import ImageCatalog from "./main/ImageCatalog";
import SupportArtists from "./main/SupportArtists";
import JoinCommunity from "./main/JoinCommunity";
import LatestNews from "../components/LatestNews";
import FAQ from "./main/FAQ";
import Partners from "./main/Partners";
import JoinCommunityWrapper from "../components/JoinCommunityWrapper";
import { projectsAPI } from "../lib/api/projects";

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
  let projects: Awaited<ReturnType<typeof projectsAPI.list>> = [];
  try {
    projects = await projectsAPI.list({ per_page: 20, sort_by: "popular" });
  } catch (error) {
    console.error("Failed to load featured projects:", error);
  }

  const featuredProjectSlides = shuffleProjects(projects).map((project) => ({
    slug: project.slug,
    title: project.title,
    image: project.cover_url ?? FALLBACK_PROJECT_IMAGE,
    likes: project.likes_count,
  }));

  return (
    <>
    <HeroBanner />
    <MainNavigation />
    <PlatformDescription />
    <PlatformFeatures />
    <FeaturedWorks artworks={featuredProjectSlides} />
    <ImageCatalog seed={seed} />
    <SupportArtists />
    <JoinCommunity />
    <LatestNews />
    <FAQ />
    <Partners />
    <JoinCommunityWrapper />
    </>
  );
}
