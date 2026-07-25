import Image from "next/image";

const NEWS_IMAGE_PLACEHOLDER = "/news/news-image-1.png";

interface PhotoProps {
  mainImage: string | null;
  title: string;
}

export default function Photo({ mainImage, title }: PhotoProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="relative aspect-square w-full">
        <Image src={mainImage ?? NEWS_IMAGE_PLACEHOLDER} alt={title} fill className="object-cover" />
      </div>
      <div className="flex-1 bg-[#414141]"></div>
    </div>
  );
}
