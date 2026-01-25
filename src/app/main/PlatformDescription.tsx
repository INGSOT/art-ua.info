export default function PlatformDescription() {
  const aboutPlatform = {
    tagline: "art-ua",
    title: "Про платформу",
    subtitle: "Спільнота підтримки\nукраїнських митців",
    paragraphs: [
      "Ми створюємо всеукраїнську платформу особистостей з різних культурних сфер діяльності, чия професійна кваліфікація передбачає високий творчий потенціал для створення унікальних витворів мистецтва, що художньо переосмислюють сучасні історичні події та стани людства, пропагують мир, збагачують світову мистецьку спадщину.",
      "Для подолання глобальної культурної кризи в країні, яка стоїть на варті миру у всьому світі, ми надаємо можливість формувати новітню мистецьку спадщину, яка транслює мистецтво перемоги та вбереже наступні покоління від руїн.",
    ],
  };

  return (
    <section className="flex flex-col items-center gap-[30px] p-4 md:p-10 lg:p-20 w-full bg-white">
      <header className="flex flex-col items-start gap-2.5 w-full">
        <div className="self-stretch text-[#FECC39] font-[family-name:var(--font-unbounded)]">
          {aboutPlatform.tagline}
        </div>

        <h2 className="self-stretch text-black text-[40px] font-semibold font-[family-name:var(--font-unbounded)]">
          {aboutPlatform.title}
        </h2>
      </header>

      <div className="flex flex-col md:flex-row items-start gap-6 md:gap-[60px] pt-0 pb-[30px] px-0 w-full">
        <h5 className="text-black text-[24px] md:text-[30px] font-semibold flex-1 font-[family-name:var(--font-unbounded)] whitespace-pre-line">
          {aboutPlatform.subtitle}
        </h5>

        {aboutPlatform.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="flex-1 font-p1 font-[number:var(--p1-font-weight)] text-black text-[length:var(--p1-font-size)] tracking-[var(--p1-letter-spacing)] leading-[var(--p1-line-height)] [font-style:var(--p1-font-style)]"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}