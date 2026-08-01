import { platformDescriptionData } from "../../data/mainData";
import { homeAPI } from "../../lib/api/home";

export default async function PlatformDescription() {
  let data = platformDescriptionData;

  try {
    const description = await homeAPI.getPlatformDescription();
    data = {
      tagline: description.tagline || platformDescriptionData.tagline,
      title: description.title || platformDescriptionData.title,
      subtitle: description.subtitle || platformDescriptionData.subtitle,
      paragraphs: description.paragraphs.length
        ? description.paragraphs
        : platformDescriptionData.paragraphs,
    };
  } catch (error) {
    console.error("Failed to load platform description:", error);
  }

  return (
    <section className="flex flex-col items-center gap-[30px] p-4 md:p-10 lg:p-20 w-full bg-white">
      <header className="flex flex-col items-start gap-2.5 w-full">
        <div className="self-stretch text-[#FECC39] font-wix">
          {data.tagline}
        </div>

        <h2 className="self-stretch text-black text-[40px] font-semibold font-[family-name:var(--font-unbounded)]">
          {data.title}
        </h2>
      </header>

      <div className="flex flex-col md:flex-row items-start gap-6 md:gap-[60px] pt-0 pb-[30px] px-0 w-full">
        <h5 className="text-black text-[24px] md:text-[30px] font-semibold flex-1 font-[family-name:var(--font-unbounded)] whitespace-pre-line">
          {data.subtitle}
        </h5>

        {data.paragraphs.map((paragraph, index) => (
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
