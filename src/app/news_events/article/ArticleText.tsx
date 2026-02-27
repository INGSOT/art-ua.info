import Image from "next/image";
import { articleData } from "../../../data/articleData";

export default function ArticleText() {
  return (
    <div className="bg-[#FFFCF5] p-8 md:p-12 h-full">
      {/* Header with category and date */}
      <div className="flex justify-between items-start mb-6">
        <span className="font-wix text-xs ">{articleData.category}</span>
        <span className="font-wix text-xs ">{articleData.date}</span>
      </div>

      {/* Title */}
      <h4 className="text-2xl md:text-3xl font-medium mb-8">
        {articleData.title}
      </h4>

      {/* Text blocks */}
      {articleData.textBlocks.map((block, blockIndex) => (
        <div key={blockIndex} className={blockIndex < articleData.textBlocks.length - 1 ? "mb-8" : ""}>
          {block.paragraphs.map((paragraph, paragraphIndex) => (
            <p 
              key={paragraphIndex} 
              className={`text-sm leading-relaxed ${paragraphIndex === 0 ? "mb-4" : paragraphIndex > 0 ? "mt-4" : ""}`}
            >
              {paragraph}
            </p>
          ))}
          
          {/* Image if exists */}
          {block.image && (
            <div className="relative w-full aspect-[16/10] mb-8 mt-8">
              <Image
                src={block.image}
                alt="Article image"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
