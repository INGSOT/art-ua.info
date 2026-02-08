import { supportArtistsData } from "../../data/mainData";

export default function SupportArtists() {
  return (
    <section 
      className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-[30px] p-6 md:p-10 lg:p-20 w-full bg-id-7 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${supportArtistsData.backgroundImage})` }}
    >
      <h5 className="font-h5 font-bold font-[700] font-[number:var(--h5-font-weight)] text-white text-[24px] md:text-[30px] text-center tracking-[var(--h5-letter-spacing)] leading-[var(--h5-line-height)] [font-style:var(--h5-font-style)] max-w-[600px]">
        {supportArtistsData.title}
      </h5>

      <h5 className="font-h5 font-bold font-[700] font-[number:var(--h5-font-weight)] text-white text-[24px] md:text-[30px] text-center tracking-[var(--h5-letter-spacing)] leading-[var(--h5-line-height)] [font-style:var(--h5-font-style)] max-w-[600px] hover:text-[#FECC39] transition-colors cursor-pointer">
        {supportArtistsData.link}
      </h5>
    </section>
  );
};