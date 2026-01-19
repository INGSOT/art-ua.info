
  const artists = [
    {
      photo: "/artists/artist-photo-1.png",
      name: "Вадим\nІгнатенко",
    },
    {
      photo: "/artists/artist-photo-2.png",
      name: "Вадим\nІгнатенко",
    },
    {
      photo: "/artists/artist-photo-3.png",
      name: "Вадим\nІгнатенко",
    },
    {
      photo: "/artists/artist-photo-4.png",
      name: "Вадим\nІгнатенко",
    },
  ];

export default function JoinCommunitySection() {
  return (
     <section className="flex flex-col items-center justify-center gap-[30px] px-4 md:px-[60px] py-10 md:py-20 w-full bg-[#FFFCF5]">
      <div className="flex flex-col items-center gap-0">
        <h4 className="font-h4 font-bold text-black text-[24px] md:text-[32px] lg:text-[40px] text-center tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)] [font-style:var(--h4-font-style)]">
          Приєднуйся вже зараз
        </h4>
        <h4 className="font-h4 font-bold text-black text-[24px] md:text-[32px] lg:text-[40px] text-center tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)] [font-style:var(--h4-font-style)]">
          та стань учасником арт-спільноти
        </h4>
      </div>

      {/* Desktop and Tablet version */}
      <div className="hidden md:inline-flex flex-col items-start gap-2.5">
        <div className="flex items-center justify-center gap-4 md:gap-10 flex-wrap">
          {artists.map((artist, index) => (
            <img
              key={`artist-${index}`}
              className="w-[90px] h-[90px] rounded-[50px] object-cover"
              alt="Artist photo"
              src={artist.photo}
            />
          ))}

          <div className="w-[90px] h-[90px] bg-[#FECC39] rounded-[50px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
            <img src="/plus.svg" alt="Plus" className="w-6 h-6" />
          </div>
        </div>

        <div className="flex items-start gap-4 md:gap-10 flex-wrap justify-center">
          {artists.map((artist, index) => (
            <div
              key={`name-${index}`}
              className="w-[90px] font-p3 font-[number:var(--p3-font-weight)] text-black text-[length:var(--p3-font-size)] text-center tracking-[var(--p3-letter-spacing)] leading-[var(--p3-line-height)] [font-style:var(--p3-font-style)]"
            >
              {artist.name.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </div>
          ))}

          <div className="w-[90px] font-p3 font-[number:var(--p3-font-weight)] text-black text-[length:var(--p3-font-size)] text-center tracking-[var(--p3-letter-spacing)] leading-[var(--p3-line-height)] [font-style:var(--p3-font-style)]">
            Приєднуйтесь
            <br />
            зараз
          </div>
        </div>
      </div>

      {/* Mobile version */}
      <div className="flex md:hidden w-full max-w-[400px]">
        <div className="flex flex-col items-start gap-4">
          {artists.map((artist, index) => (
            <div key={`mobile-artist-${index}`} className="flex items-center gap-4 w-full">
              <img
                className="w-[90px] h-[90px] rounded-[50px] object-cover"
                alt="Artist photo"
                src={artist.photo}
              />
              <div className="font-p3 font-[number:var(--p3-font-weight)] text-black text-[length:var(--p3-font-size)] text-left tracking-[var(--p3-letter-spacing)] leading-[var(--p3-line-height)] [font-style:var(--p3-font-style)]">
                {artist.name.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i === 0 && <br />}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-4 w-full">
            <div className="w-[90px] h-[90px] bg-[#FECC39] rounded-[50px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
              <img src="/plus.svg" alt="Plus" className="w-6 h-6" />
            </div>
            <div className="font-p3 font-[number:var(--p3-font-weight)] text-black text-[length:var(--p3-font-size)] text-left tracking-[var(--p3-letter-spacing)] leading-[var(--p3-line-height)] [font-style:var(--p3-font-style)]">
              Приєднуйтесь
              <br />
              зараз
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
