import Photo from "./Photo";
import ArticleText from "./ArticleText";
import SocialLinksBar from "./SocialLinksBar";
import JoinCommunityWrapper from "../../../components/JoinCommunityWrapper";
import Header from "../../../components/Header";

export default function ArticlePage() {
  return (
    <>
     <Header isHomePage={false} />
   
      {/* Main article section with Photo and ArticleText */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left side - Photo */}
        <Photo />
        
        {/* Right side - Article Text */}
        <ArticleText />
      </div>

      {/* Social Links Bar */}
      <SocialLinksBar />

      {/* Join Community Section */}
      <JoinCommunityWrapper />
   
    </>
  );
}
