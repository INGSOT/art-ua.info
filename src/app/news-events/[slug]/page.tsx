import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import JoinCommunityWrapper from "../../../components/JoinCommunityWrapper";
import { newsAPI } from "../../../lib/api/news";
import ArticleText from "./ArticleText";
import Photo from "./Photo";
import SocialLinksBar from "./SocialLinksBar";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  let article;
  try {
    article = await newsAPI.get(slug, "uk");
  } catch {
    article = null;
  }

  if (!article) {
    notFound();
  }

  return (
    <>
      <Header isHomePage={false} />

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <Photo mainImage={article.mainImageUrl} title={article.title} />
        <ArticleText
          article={{
            category: article.categoryLabel,
            date: article.date,
            title: article.title,
            textBlocks: article.textBlocks,
          }}
        />
      </div>

      <SocialLinksBar slug={article.slug} title={article.title} />
      <JoinCommunityWrapper />
    </>
  );
}
