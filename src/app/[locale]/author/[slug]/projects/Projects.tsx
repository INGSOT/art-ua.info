"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { Card, CardContent } from "../../../../../components/ui/card";
import { artistsAPI, type PublicArtistProject } from "../../../../../lib/api/artists";
import { organizationsAPI } from "../../../../../lib/api/organizations";
import { useAuthorProfile } from "../../AuthorProfileContext";
import { localeToApiLanguage, type Locale } from "../../../../../i18n/routing";

const FALLBACK_COVER = "/artists/artist-photo-5.png";

export default function Projects() {
  const t = useTranslations("Authors.profile");
  const locale = useLocale() as Locale;
  const projectFilterButtons = [
    { id: "all", text: t("filters.all") },
    { id: "newest", text: t("filters.newest") },
  ];
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const { slug, kind, loading: profileLoading, notFound } = useAuthorProfile();
  const [myProjects, setMyProjects] = useState<PublicArtistProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileLoading || !kind) return;
    let ignore = false;

    (async () => {
      setLoading(true);
      try {
        const api = kind === "artist" ? artistsAPI : organizationsAPI;
        const result = await api.projects(slug, localeToApiLanguage(locale), { per_page: 50 });
        if (!ignore) setMyProjects(result);
      } catch (error) {
        if (!ignore) {
          console.error(`Failed to load projects for "${slug}":`, error);
          setMyProjects([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [slug, kind, profileLoading, locale]);

  if (notFound) {
    return null;
  }

  if (profileLoading || loading) {
    return (
      <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px] min-h-[300px] flex items-center justify-center">
        <p className="text-white text-lg">{t("loading")}</p>
      </section>
    );
  }

  const hasProjects = myProjects.length > 0;

  return (
    <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px]">
      {hasProjects ? (
        <>
          {/* Dark gray filter bar */}
          <div className="w-full bg-[#343434] h-[80px] mb-8">
            <div className="flex items-center h-full px-4 md:px-[30px]">
              <div className="flex items-center gap-8">
                {projectFilterButtons.map((filter) => (
                  <button
                    key={filter.id}
                    className={`flex items-center gap-2 text-sm font-bold transition-colors duration-300 ${
                      hoveredFilter === filter.id ? "text-[#FECC39]" : "text-white"
                    }`}
                    onMouseEnter={() => setHoveredFilter(filter.id)}
                    onMouseLeave={() => setHoveredFilter(null)}
                  >
                    {filter.text}
                    <Image src="/white_triangle_down.svg" alt="" width={16} height={16} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Projects grid */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="block group"
                >
                  <Card className="bg-transparent border-0 outline-none shadow-none rounded-none">
                    <CardContent className="p-0 flex flex-col gap-3">
                      {/* Project image with likes overlay */}
                      <div className="relative w-full aspect-[460/316] bg-cover bg-center overflow-hidden">
                        <Image
                          src={project.coverUrl ?? FALLBACK_COVER}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                        {/* Darkening overlay on hover */}
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>

                        {/* Centered arrow on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          <Image src="/arrow-chevron-right-white.svg" alt={t("viewAlt")} width={48} height={48} />
                        </div>

                        <div className="absolute right-3 bottom-3 flex items-center gap-2 z-10">
                          <span className="font-button font-bold text-white text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)]">
                            {project.likesCount}
                          </span>
                          <Image src="/like.svg" alt={t("likeAlt")} width={32} height={32} />
                        </div>
                      </div>
                      {/* Project title */}
                      <h3 className="font-h6 font-bold text-white text-[length:var(--h6-font-size)] tracking-[var(--h6-letter-spacing)] leading-[var(--h6-line-height)]">
                        {project.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] py-16 px-4">
          <Image
            src="/megaphone.svg"
            alt="Megaphone"
            width={420}
            height={420}
            className="w-[200px] h-[200px] md:w-[420px] md:h-[420px]"
          />
          <h2 className="mt-8 text-white text-xl md:text-3xl font-bold text-center max-w-[600px]">
            {t("empty.title")}
          </h2>
        </div>
      )}
    </section>
  );
}
