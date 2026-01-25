import Link from "next/link";
import { Button } from "../components/ui/button";

const socialIcons = [
  { src: "/socials/youtube_black.svg", alt: "Social" },
  { src: "/socials/instagram_black.svg", alt: "Social" },
  { src: "/socials/facebook_black.svg", alt: "Social" },
];

const expertiseItems = [
  {
    image: "/image-15.png",
    text: "Створення сучасного українського мистецтва",
  },
  {
    image: "/image-16.png",
    text: "Участь у проведенні виставок та мистецьких заходів",
  },
  {
    image: "/image-17.png",
    text: "Популяризація українських митців в усьому світі",
  },
];

const navigationData = [
  {
    title: "art-ua.info",
    links: [
      "Учасники",
      "Каталоги",
      "Проєкти",
      "Послуги",
      "Новини та події",
      "Часті питання",
      "Умови використання",
    ],
  },
  {
    title: "art-ua.com",
    links: [
      "Учасники",
      "Каталоги",
      "Проєкти",
      "Проєкти для продажу",
      "Послуги",
      "Новини та події",
      "Часті питання",
      "Умови використання",
    ],
  },
  {
    title: "save-art.in.ua",
    links: [
      "Проєкти",
      "Звіти",
      "Спецпроєкти",
      "Про нас",
      "Часті питання",
      "Умови використання",
    ],
  },
];

  const contactInfo = [
    { text: "м. Івано-Франківськ, Україна" },
    { text: "idartua.bo@gmail.com" },
    { text: "+380 98 765 43 21" },
  ];

  const socialLinks = [
    {
      icon: "/socials/facebook_black.svg",
      text: "ua.id.art",
    },
    {
      icon: "/socials/youtube_black.svg",
      text: "@id_artUA",
    },
  ];

export default function Footer() {
  return (
    <footer className="flex flex-col w-full items-start gap-6 md:gap-[30px] p-4 md:p-10 lg:p-20 relative bg-[#FFFCF5]">
      <section className="flex flex-col items-start w-full">
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:p-[30px] bg-[#414141] w-full">
          <h5 className="font-h5 font-bold text-[#FECC39] text-[20px] md:text-[24px] lg:text-[30px] tracking-[var(--h5-letter-spacing)] leading-[var(--h5-line-height)] [font-style:var(--h5-font-style)] font-[600] text-center md:text-left">
            art-ua.info
          </h5>

          <h5 className="font-bold text-[#FFFCF5] text-[20px] md:text-[24px] lg:text-[30px] leading-[var(--h5-line-height)] font-h5 text-center tracking-[var(--h5-letter-spacing)] [font-style:var(--h5-font-style)] font-[600]">
            Мистецтво допомоги — найсучасніше з мистецтв
          </h5>
        </header>

        <div className="flex flex-col items-center gap-5 p-4 md:p-[30px] w-full bg-[#FECC39]">
          <h2 className="self-stretch font-bold text-black text-[length:var(--h6-font-size)] leading-[var(--h6-line-height)] font-h6 text-center tracking-[var(--h6-letter-spacing)] [font-style:var(--h6-font-style)]">
            Запрошуємо експертів до співпраці
          </h2>

          <p className="self-stretch font-p1 font-[number:var(--p1-font-weight)] text-black text-[length:var(--p1-font-size)] text-center tracking-[var(--p1-letter-spacing)] leading-[var(--p1-line-height)] [font-style:var(--p1-font-style)]">
            Благодійний фонд ID_Art UA відкритий до співпраці ...
          </p>

          <div className="flex flex-wrap items-start justify-center gap-4 md:gap-[30px]">
            {expertiseItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col w-[200px] gap-3 items-center"
              >
                <div className="w-[60px] h-[60px] flex justify-center items-center gap-2.5 bg-id-5 rounded-[30px] overflow-hidden">
                  <img
                    className="w-[60px] h-[60px] object-cover"
                    alt="Image"
                    src={item.image}
                  />
                </div>

                <p className="self-stretch font-bold text-black text-[length:var(--button-font-size)] leading-[var(--button-line-height)] font-button text-center tracking-[var(--button-letter-spacing)] [font-style:var(--button-font-style)]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          <Button className="w-[300px] h-[60px] bg-[#343434] hover:bg-[#FECC39] text-[#FECC39] hover:text-[#343434] font-button font-bold text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)] rounded-none transition-colors">
            Відправити заявку
          </Button>
        </div>
      </section>

      <section className="flex flex-col md:flex-row items-start gap-1 p-1 w-full bg-white">
        {navigationData.map((column, columnIndex) => (
          <nav
            key={columnIndex}
            className="flex flex-col items-start gap-[30px] p-[30px] flex-1 bg-[#FFFCF5] self-stretch"
          >
            {column.title === "art-ua.info" ? (
              <Link
                href="/"
                className="block font-h6 font-bold text-[#414141] text-[20px] tracking-[var(--h6-letter-spacing)] leading-[var(--h6-line-height)] [font-style:var(--h6-font-style)] transition-colors hover:text-[#FECC39]"
              >
                {column.title}
              </Link>
            ) : (
              <h3 className="block font-h6 font-bold text-[#414141] text-[20px] tracking-[var(--h6-letter-spacing)] leading-[var(--h6-line-height)] [font-style:var(--h6-font-style)] transition-colors hover:text-[#FECC39]">
                {column.title}
              </h3>
            )}

            {column.links.map((link, linkIndex) => {
              const linkMap: Record<string, string> = {
                "Учасники": "/authors",
                "Каталоги": "/catalogs",
              };
              const href = linkMap[link];
              
              return (
                <Button
                  key={linkIndex}
                  variant="link"
                  className="h-auto p-0 font-button font-bold text-[#414141] text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)] hover:no-underline transition-colors hover:text-[#FECC39]"
                  asChild={Boolean(href)}
                >
                  {href ? (
                    <Link href={href}>{link}</Link>
                  ) : (
                    link
                  )}
                </Button>
              );
            })}
          </nav>
        ))}
      </section>

      <section className="flex flex-col items-start gap-3 p-4 md:p-[30px] w-full bg-white">
        <h2 className="font-button font-bold text-black text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)]">
          БЛАГОДІЙНИЙ ФОНД ID_Art UA
        </h2>

        <div className="flex items-start gap-4 md:gap-[30px] flex-wrap">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="font-p2 font-[number:var(--p2-font-weight)] text-black text-[length:var(--p2-font-size)] tracking-[var(--p2-letter-spacing)] leading-[var(--p2-line-height)] [font-style:var(--p2-font-style)]"
            >
              {info.text}
            </div>
          ))}

          {socialLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <img className="w-5 h-5" alt="Social" src={link.icon} />
              <div className="font-link-header font-[number:var(--link-header-font-weight)] text-black text-[length:var(--link-header-font-size)] text-center tracking-[var(--link-header-letter-spacing)] leading-[var(--link-header-line-height)] [font-style:var(--link-header-font-style)]">
                {link.text}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto] bg-[#FFFCF5]">
        <div className="inline-flex items-start gap-[60px] relative flex-[0_0_auto]">
          {socialIcons.map((icon, index) => (
            <img
              key={`social-${index}`}
              className="relative w-5 h-5"
              alt={icon.alt}
              src={icon.src}
            />
          ))}
        </div>

        <div className="inline-flex items-center justify-center gap-0.5 relative flex-[0_0_auto]">
          <img className="relative w-6 h-6" alt="Copy" src="/copy.svg" />

          <div className="relative w-fit mt-[-1.00px] font-p1 font-[number:var(--p1-font-weight)] text-black text-[length:var(--p1-font-size)] text-center tracking-[var(--p1-letter-spacing)] leading-[var(--p1-line-height)] whitespace-nowrap [font-style:var(--p1-font-style)]">
            2026
          </div>
        </div>
      </div>
    </footer>
  );
}