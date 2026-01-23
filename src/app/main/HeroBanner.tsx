import Header from "../../components/Header";
export default function HeroBanner() {
  return (
    <section className="relative w-full h-[600px] md:h-[750px] lg:h-[900px] [background:url(/hero.png)_50%_50%_/_cover]">
      <Header isHomePage={true} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[80%] lg:w-[1338px] flex items-center justify-center text-white text-[32px] md:text-[50px] lg:text-[70px] font-bold font-[family-name:var(--font-unbounded)] leading-tight text-center opacity-30 px-4">
        Мистецтво допомоги —<br />
        найсучасніше з мистецтв
      </div>
    </section>
  );
}