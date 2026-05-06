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
import { projectsData } from "../data/projectsData";

export const dynamic = "force-dynamic";

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

export default function Home() {
  const seed = Date.now();
  const featuredProjectSlides = shuffleProjects(projectsData).map((project) => ({
    slug: project.slug,
    title: project.title,
    image: project.image,
    likes: project.likes,
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
