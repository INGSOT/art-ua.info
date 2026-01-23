export default function PlatformDescription() {
    return (
    <section className="flex flex-col items-center gap-[30px] p-4 md:p-10 lg:p-20 w-full bg-white">
      <header className="flex flex-col items-start gap-2.5 w-full">
        <div className="self-stretch text-[#FECC39] font-[family-name:var(--font-unbounded)]">
          art-ua
        </div>

        <h2 className="self-stretch text-black text-[40px] font-semibold font-[family-name:var(--font-unbounded)]">
          Про платформу
        </h2>
      </header>

      <div className="flex flex-col md:flex-row items-start gap-6 md:gap-[60px] pt-0 pb-[30px] px-0 w-full">
        <h5 className="text-black text-[24px] md:text-[30px] font-semibold flex-1 font-[family-name:var(--font-unbounded)]">
          Спільнота підтримки
          <br />
          українських митців
        </h5>

        <p className="flex-1 font-p1 font-[number:var(--p1-font-weight)] text-black text-[length:var(--p1-font-size)] tracking-[var(--p1-letter-spacing)] leading-[var(--p1-line-height)] [font-style:var(--p1-font-style)]">
          Ми створюємо всеукраїнську платформу особистостей з різних культурних
          сфер діяльності, чия професійна кваліфікація передбачає високий
          творчий потенціал для створення унікальних витворів мистецтва, що
          художньо переосмислюють сучасні історичні події та стани людства,
          пропагують мир, збагачують світову мистецьку спадщину.
        </p>

        <p className="flex-1 font-p1 font-[number:var(--p1-font-weight)] text-black text-[length:var(--p1-font-size)] tracking-[var(--p1-letter-spacing)] leading-[var(--p1-line-height)] [font-style:var(--p1-font-style)]">
          Для подолання глобальної культурної кризи в країні, яка стоїть на
          варті миру у всьому світі, ми надаємо можливість формувати новітню
          мистецьку спадщину, яка транслює мистецтво перемоги та вбереже
          наступні покоління від руїн.
        </p>
      </div>
    </section>
    )
}