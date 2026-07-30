import Image from "next/image";

export interface ArticleTextBlock {
  paragraphs: string[];
  imageUrl: string | null;
}

export interface ArticleData {
  category: string;
  date: string;
  title: string;
  textBlocks: ArticleTextBlock[];
}

interface ArticleTextProps {
  article: ArticleData;
}

export default function ArticleText({ article }: ArticleTextProps) {
  return (
    <div className="bg-[#FFFCF5] text-black p-8 md:p-12 h-full">
      <div className="flex justify-between items-start mb-6">
        <span className="font-wix text-xs">{article.category}</span>
        <span className="font-wix text-xs">{article.date}</span>
      </div>

      <h4 className="text-2xl md:text-3xl font-medium mb-8">{article.title}</h4>

      {article.textBlocks.map((block, blockIndex) => (
        <div key={blockIndex} className={blockIndex < article.textBlocks.length - 1 ? "mb-8" : ""}>
          {block.paragraphs.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex} className={`text-sm leading-relaxed ${paragraphIndex === 0 ? "mb-4" : "mt-4"}`}>
              {paragraph}
            </p>
          ))}

          {block.imageUrl && (
            <div className="relative w-full aspect-[16/10] mb-8 mt-8">
              <Image src={block.imageUrl} alt={article.title} fill className="object-contain" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
