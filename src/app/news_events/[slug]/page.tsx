import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import JoinCommunityWrapper from "../../../components/JoinCommunityWrapper";
import { newsData } from "../../../data/newsData";
import ArticleText from "./ArticleText";
import Photo from "./Photo";
import SocialLinksBar from "./SocialLinksBar";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = newsData.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <Header isHomePage={false} />

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <Photo mainImage={article.mainImage} title={article.title} />
        <ArticleText article={article} />
      </div>

      <SocialLinksBar />
      <JoinCommunityWrapper />
    </>
  );
}
