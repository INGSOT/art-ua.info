export default function SupportArtistsSection() {
  return (
    <section 
      className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-[30px] p-6 md:p-10 lg:p-20 w-full bg-id-7 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/support_artists.jpg)' }}
    >
      <h5 className="font-h5 font-bold font-[700] font-[number:var(--h5-font-weight)] text-white text-[24px] md:text-[30px] text-center tracking-[var(--h5-letter-spacing)] leading-[var(--h5-line-height)] [font-style:var(--h5-font-style)] max-w-[600px]">
        Підтримати митців
      </h5>

      <h5 className="font-h5 font-bold font-[700] font-[number:var(--h5-font-weight)] text-white text-[24px] md:text-[30px] text-center tracking-[var(--h5-letter-spacing)] leading-[var(--h5-line-height)] [font-style:var(--h5-font-style)] max-w-[600px] hover:text-[#FECC39] transition-colors cursor-pointer">
        save-art.in.ua
      </h5>
    </section>
  );
};