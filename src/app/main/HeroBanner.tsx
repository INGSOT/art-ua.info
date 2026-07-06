import Header from "../../components/Header";
import { heroBannerData } from "../../data/mainData";

export default function HeroBanner() {
  return (
    <section className="relative w-full h-[600px] md:h-[750px] lg:h-[900px] overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden
      >
        <source src={heroBannerData.backgroundVideo} type="video/mp4" />
      </video>
      <div className="relative z-20">
        <Header isHomePage={true} />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[90%] md:w-[80%] lg:w-[1338px] flex items-center justify-center text-white text-[32px] md:text-[50px] lg:text-[70px] font-bold font-[family-name:var(--font-unbounded)] leading-tight text-center opacity-30 px-4 whitespace-pre-line">
        {heroBannerData.heroText}
      </div>
    </section>
  );
}