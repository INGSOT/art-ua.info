import Image from "next/image";

export default function ArticleText() {
  return (
    <div className="bg-[#FFFCF5] p-8 md:p-12 h-full">
      {/* Header with category and date */}
      <div className="flex justify-between items-start mb-6">
        <span className="text-xs text-gray-600">Новини</span>
        <span className="text-xs text-gray-600">12.01.25</span>
      </div>

      {/* Title */}
      <h4 className="text-2xl md:text-3xl font-medium mb-8">
        Заголовок новини або події
      </h4>

      {/* First text block */}
      <div className="mb-8">
        <p className="text-sm mb-4">Текст.</p>
        <p className="text-sm leading-relaxed">
          Культурна спадщина України в контексті нових історичних подій набула особливої актуальності та нових змістів.
        </p>
        <p className="text-sm leading-relaxed mt-4">
          Сьогодні образотворче мистецтво у фарбах на холсті відображає не просто сюжети чи метафори, а небувалий у сучасній історії злам епох. Художники фіксують не тільки події, а ще й глибину емоційно-почуттєвого фону, який неможливо передати на словах та в стрічці новин. Це - новітнє мистецтво, сучасне, переосмислене, глибинне, на віки.
        </p>
        <p className="text-sm leading-relaxed mt-4">
          Саме зараз настає його час - аби уберегти наступні покоління від руїн, транслюючи біль крізь художні образи.
        </p>
      </div>

      {/* Image */}
      <div className="relative w-full aspect-[16/10] mb-8">
        <Image
          src="/news/news-image-10.png"
          alt="Article image"
          fill
          className="object-cover"
        />
      </div>

      {/* Second text block */}
      <div>
        <p className="text-sm mb-4">Текст.</p>
        <p className="text-sm leading-relaxed">
          Культурна спадщина України в контексті нових історичних подій набула особливої актуальності та нових змістів.
        </p>
        <p className="text-sm leading-relaxed mt-4">
          Сьогодні образотворче мистецтво у фарбах на холсті відображає не просто сюжети чи метафори, а небувалий у сучасній історії злам епох. Художники фіксують не тільки події, а ще й глибину емоційно-почуттєвого фону, який неможливо передати на словах та в стрічці новин. Це - новітнє мистецтво, сучасне, переосмислене, глибинне, на віки.
        </p>
        <p className="text-sm leading-relaxed mt-4">
          Саме зараз настає його час - аби уберегти наступні покоління від руїн, транслюючи біль крізь художні образи.
        </p>
      </div>
    </div>
  );
}
