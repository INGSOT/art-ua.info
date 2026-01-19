import HeroBannerSection from "./main/HeroBannerSection";
import MainNavigationSection from "./main/MainNavigationSection";
import PlatformDescriptionSection from "./main/PlatformDescriptionSection";
import PlatformFeaturesSection from "./main/PlatformFeaturesSection";
import FeaturedWorksSection from "./main/FeaturedWorksSection";
import ImageCatalogSection from "./main/ImageCatalogSection";
import SupportArtistsSection from "./main/SupportArtistsSection";
import JoinCommunitySection from "../common_elements/JoinCommunitySection";
import LatestNewsSection from "../common_elements/LatestNewsSection";
import FAQSection from "./main/FAQSection";
import PartnersSection from "./main/PartnersSection";
import JoinCommunityWrapperSection from "./main/JoinCommunityWrapperSection";

export default function Home() {
  return (
    <>
    <HeroBannerSection />
    <MainNavigationSection />
    <PlatformDescriptionSection />
    <PlatformFeaturesSection />
    <FeaturedWorksSection />
    <ImageCatalogSection />
    <SupportArtistsSection />
    <JoinCommunitySection />
    <LatestNewsSection />
    <FAQSection />
    <PartnersSection />
    <JoinCommunityWrapperSection />
    </>
  );
}
