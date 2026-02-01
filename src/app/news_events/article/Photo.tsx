import Image from "next/image";

export default function Photo() {
  return (
    <div className="flex flex-col h-full">
      {/* Square photo section */}
      <div className="relative aspect-square w-full">
        <Image
          src="/news/news-image-4.png"
          alt="News article"
          fill
          className="object-cover"
        />
      </div>
      
      {/* Gray background section at bottom */}
      <div className="flex-1 bg-[#414141]"></div>
    </div>
  );
}
