import Image from "next/image";

interface PhotoProps {
  mainImage: string;
  title: string;
}

export default function Photo({ mainImage, title }: PhotoProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="relative aspect-square w-full">
        <Image src={mainImage} alt={title} fill className="object-cover" />
      </div>
      <div className="flex-1 bg-[#414141]"></div>
    </div>
  );
}
