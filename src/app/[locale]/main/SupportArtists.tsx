import { getTranslations } from "next-intl/server";
import { supportArtistsData } from "../../../data/mainData";
import { homeAPI } from "../../../lib/api/home";
import { SAVE_ART_URL } from "../../../lib/siteDomains";

export default async function SupportArtists() {
  const t = await getTranslations("Main.supportArtists");
  let title: string = t("title");
  let linkText: string = supportArtistsData.link;
  let backgroundImage: string = supportArtistsData.backgroundImage;

  try {
    const { first } = await homeAPI.getAdBlocks();
    if (first.title) title = first.title;
    if (first.buttonText) linkText = first.buttonText;
    if (first.image) backgroundImage = first.image;
  } catch (error) {
    console.error("Failed to load support artists block:", error);
  }

  return (
    <section
      className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-[30px] p-6 md:p-10 lg:p-20 w-full bg-[#272727] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h5 className="font-h5 font-bold font-[700] font-[number:var(--h5-font-weight)] text-white text-[24px] md:text-[30px] text-center tracking-[var(--h5-letter-spacing)] leading-[var(--h5-line-height)] [font-style:var(--h5-font-style)]">
        {title}
      </h5>

      <a
        href={`${SAVE_ART_URL}/support-platform`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-h5 font-bold font-[700] font-[number:var(--h5-font-weight)] text-white text-[24px] md:text-[30px] text-center tracking-[var(--h5-letter-spacing)] leading-[var(--h5-line-height)] [font-style:var(--h5-font-style)] hover:text-[#FECC39] transition-colors cursor-pointer"
      >
        {linkText}
      </a>
    </section>
  );
};