
import Link from "next/link";
import { Button } from "./ui/button";

const navigationItems = [
  { label: "Учасники", href: "/authors" },
  { label: "Роботи", href: "/projects" },
  { label: "Послуги" },
  { label: "Каталоги", href: "/catalogs" },
  { label: "Новини та події", href: "/news_events" },
];

const socialIcons = [
  { src: "/socials/instagram_white.svg", alt: "Instagram" },
  { src: "/socials/facebook_white.svg", alt: "Facebook" },
  { src: "/socials/youtube_white.svg", alt: "Youtube" },
];

const languageOptions = [
  { code: "UA", active: true },
  { code: "EN", active: false },
];

interface HeaderProps {
  isHomePage?: boolean;
}

export default function Header({ isHomePage = false }: HeaderProps) {
    return (
    <header className={`flex items-center gap-4 md:gap-[30px] p-4 md:p-[30px] flex-wrap lg:flex-nowrap ${isHomePage ? 'bg-transparent' : 'bg-[#414141]'}`}>
        <Link href="/" className="inline-flex items-center gap-2 flex-[0_0_auto] group">
          <img className="w-11 h-11" alt="Logos" src="/logos.svg" />

          <div className="inline-flex items-start">
            <div className="w-fit font-bold text-white text-[14px] font-[family-name:var(--font-unbounded)] whitespace-nowrap transition-colors duration-200 group-hover:text-[#FECC39]">
              art-ua.info
            </div>
          </div>

          <div className="w-6 h-6 flex items-center justify-center">
            <img className="w-6 h-6" alt="Ui" src="/white_triangle_down.svg" />
          </div>
        </Link>

        <div className="hidden lg:flex h-10 items-center gap-[30px] flex-1">
          <nav className="flex items-center gap-[30px] flex-1">
            {navigationItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="group inline-flex items-start p-0 h-auto hover:bg-transparent"
                asChild={Boolean(item.href)}
              >
                {item.href ? (
                  <Link href={item.href} className="inline-flex">
                    <div className="w-fit font-bold text-white text-[14px] font-[family-name:var(--font-unbounded)] whitespace-nowrap transition-colors duration-200 group-hover:text-[#FECC39]">
                      {item.label}
                    </div>
                  </Link>
                ) : (
                  <div className="w-fit font-bold text-white text-[14px] font-[family-name:var(--font-unbounded)] whitespace-nowrap transition-colors duration-200 group-hover:text-[#FECC39]">
                    {item.label}
                  </div>
                )}
              </Button>
            ))}
          </nav>

          <div className="inline-flex items-center justify-end gap-[30px]">
            {socialIcons.map((icon, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className="w-5 h-5 p-0 hover:bg-transparent"
              >
                <img className="w-5 h-5" alt={icon.alt} src={icon.src} />
              </Button>
            ))}
          </div>
        </div>

        <div className="hidden md:inline-flex items-center gap-2">
          {languageOptions.map((lang, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`inline-flex items-start p-0 h-auto hover:bg-transparent ${
                !lang.active ? "opacity-30" : ""
              }`}
            >
              <div className="w-fit font-bold text-white text-[14px] font-[family-name:var(--font-unbounded)] whitespace-nowrap">
                {lang.code}
              </div>
            </Button>
          ))}
        </div>

        <div className="flex md:hidden flex-1 justify-end items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-11 h-11 hover:bg-transparent"
          >
            <img className="w-6 h-6" alt="Login" src="/login.svg" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-11 h-11 hover:bg-transparent"
          >
            <img className="w-6 h-6" alt="Search" src="/search.svg" />
          </Button>
        </div>

        <div className="hidden md:flex lg:hidden flex-1 justify-end items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-11 h-11 hover:bg-transparent"
          >
            <img className="w-6 h-6" alt="Login" src="/login.svg" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-11 h-11 hover:bg-transparent"
          >
            <img className="w-6 h-6" alt="Search" src="/search.svg" />
          </Button>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-11 h-11 hover:bg-transparent"
          >
            <img className="w-6 h-6" alt="Login" src="/login.svg" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-11 h-11 hover:bg-transparent"
          >
            <img className="w-6 h-6" alt="Search" src="/search.svg" />
          </Button>
        </div>
      </header>
    )
}