import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { newsData } from "../data/newsData";
import Link from "next/link";

export default function LatestNews() {
  const latestThreeNews = newsData.slice(0, 3);

  return (
    <section className="flex flex-col items-center gap-[30px] px-4 py-10 md:py-20 w-full bg-white">
      <div className="flex flex-col w-full max-w-[1440px] items-start gap-2.5">
        <p className="self-stretch mt-[-1.00px] font-p1 font-[number:var(--p1-font-weight)] text-[#FECC39] text-[length:var(--p1-font-size)] tracking-[var(--p1-letter-spacing)] leading-[var(--p1-line-height)] [font-style:var(--p1-font-style)]">
           Новини та події
        </p>

        <h4 className="self-stretch font-h4 font-bold text-black text-[24px] md:text-[32px] lg:text-[40px] tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)] [font-style:var(--h4-font-style)] max-w-[600px] lg:whitespace-nowrap">
         Актуальні новини та події у спільноті
        </h4>
      </div>

      <div className="flex flex-wrap items-start justify-center md:justify-start lg:justify-center gap-6 md:gap-[30px] lg:gap-[60px] w-full max-w-[1440px]">
        {latestThreeNews.map((item) => (
          <Card
            key={item.id}
            className="flex flex-col w-full md:w-[calc(50%-15px)] lg:max-w-[440px] items-start gap-2.5 border-0 shadow-none"
          >
            <CardContent className="flex flex-col w-full items-start gap-2.5 p-0">
              <div
                className="relative w-full h-[400px] bg-cover bg-center bg-no-repeat group cursor-pointer overflow-hidden"
                style={{ backgroundImage: `url(${item.image})` }}
              >
                {/* Darkening overlay on hover */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                
                {/* Centered arrow on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <img src="/arrow-chevron-right-white.svg" alt="View" className="w-12 h-12" />
                </div>
              </div>

              <div className="flex items-start gap-2.5 w-full">
                <p className="flex-1 mt-[-1.00px] font-p3 font-[number:var(--p3-font-weight)] text-black text-[length:var(--p3-font-size)] tracking-[var(--p3-letter-spacing)] leading-[var(--p3-line-height)] [font-style:var(--p3-font-style)]">
                  {item.category}
                </p>

                <p className="flex-1 mt-[-1.00px] font-p3 font-[number:var(--p3-font-weight)] text-black text-[length:var(--p3-font-size)] text-right tracking-[var(--p3-letter-spacing)] leading-[var(--p3-line-height)] [font-style:var(--p3-font-style)]">
                  {item.date}
                </p>
              </div>

              <h3 className="self-stretch font-h6 font-bold text-black text-[length:var(--h6-font-size)] tracking-[var(--h6-letter-spacing)] leading-[var(--h6-line-height)] [font-style:var(--h6-font-style)] max-w-[600px]">
                {item.title}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex w-full max-w-[1440px] items-center gap-2 md:gap-4">
        <button
          className="w-12 h-12 flex-shrink-0 bg-transparent border-0 cursor-pointer hover:opacity-80 transition-opacity"
          aria-label="Previous"
        >
          <img src="/arrow-chevron-left-yellow.svg" alt="Previous" className="w-full h-full" />
        </button>

        <div className="flex-1 flex justify-center">
          <Button
            asChild
            className="w-[300px] h-[60px] bg-[#343434] hover:bg-[#FECC39] text-[#FECC39] hover:text-[#343434] font-button font-bold text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)] rounded-none transition-colors"
          >
            <Link href="/news_events">Більше новин</Link>
          </Button>
        </div>

        <button
          className="w-12 h-12 flex-shrink-0 bg-transparent border-0 cursor-pointer hover:opacity-80 transition-opacity"
          aria-label="Next"
        >
          <img src="/arrow-chevron-right-yellow.svg" alt="Next" className="w-full h-full" />
        </button>
      </div>
    </section>
  );
}