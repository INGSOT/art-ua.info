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

export const dynamic = "force-dynamic";

export default function Home() {
  const seed = Date.now();

  return (
    <>
    <HeroBanner />
    <MainNavigation />
    <PlatformDescription />
    <PlatformFeatures />
    <FeaturedWorks />
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
