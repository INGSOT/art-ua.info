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

export default function Home() {
  return (
    <>
    <HeroBanner />
    <MainNavigation />
    <PlatformDescription />
    <PlatformFeatures />
    <FeaturedWorks />
    <ImageCatalog />
    <SupportArtists />
    <JoinCommunity />
    <LatestNews />
    <FAQ />
    <Partners />
    <JoinCommunityWrapper />
    </>
  );
}
