"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { Card, CardContent } from "../../../../../components/ui/card";
import { teamsAPI } from "../../../../../lib/api/teams";
import type { PublicArtistProject } from "../../../../../lib/api/authorProfiles";
import { localeToApiLanguage, type Locale } from "../../../../../i18n/routing";

const FALLBACK_COVER = "/artists/artist-photo-5.png";

export default function Projects() {
  const t = useTranslations("Team.projects");
  const locale = useLocale() as Locale;
  const language = localeToApiLanguage(locale);
  const params = useParams<{ slug?: string }>();
  const slug = params?.slug ?? "";
  const [projects, setProjects] = useState<PublicArtistProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let ignore = false;

    (async () => {
      setLoading(true);
      try {
        const result = await teamsAPI.projects(slug, language, { per_page: 50 });
        if (!ignore) setProjects(result);
      } catch (error) {
        if (!ignore) {
          console.error(`Failed to load projects for team "${slug}":`, error);
          setProjects([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [slug, language]);

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const project of projects) {
      if (project.artCategory && !seen.has(project.artCategory)) {
        seen.set(project.artCategory, project.artCategoryLabel || project.artCategory);
      }
    }
    return [...seen.entries()].map(([slugValue, name]) => ({ slug: slugValue, name }));
  }, [projects]);

  const sortOptions = [
    { id: "newest" as const, label: t("filters.new") },
    { id: "popular" as const, label: t("filters.popular") },
  ];

  const visibleProjects = useMemo(() => {
    const filtered = selectedCategory
      ? projects.filter((project) => project.artCategory === selectedCategory)
      : projects;
    const sorted = [...filtered];
    if (sortBy === "popular") {
      sorted.sort((a, b) => b.likesCount - a.likesCount);
    } else {
      sorted.sort((a, b) => {
        const aTime = a.announcedAt ? new Date(a.announcedAt).getTime() : 0;
        const bTime = b.announcedAt ? new Date(b.announcedAt).getTime() : 0;
        if (aTime !== bTime) return bTime - aTime;
        return b.id - a.id;
      });
    }
    return sorted;
  }, [projects, selectedCategory, sortBy]);

  if (loading) {
    return (
      <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px] min-h-[300px] flex items-center justify-center">
        <p className="text-white text-lg">{t("loading")}</p>
      </section>
    );
  }

  const hasProjects = projects.length > 0;
  const selectedCategoryLabel = categories.find((c) => c.slug === selectedCategory)?.name;
  const activeSortOption = sortOptions.find((option) => option.id === sortBy);

  return (
    <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px]">
      {hasProjects ? (
        <>
          <div className="w-full bg-[#343434] mb-8">
            <div className="flex items-center flex-wrap gap-4 min-h-[80px] px-4 md:px-[30px] py-4 md:py-0">
              <div className="flex items-center gap-8">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCategoryOpen((prev) => !prev);
                      setIsSortOpen(false);
                    }}
                    className={`flex items-center gap-2 text-sm font-bold transition-colors duration-300 ${
                      isCategoryOpen || selectedCategory ? "text-[#FECC39]" : "text-white"
                    }`}
                  >
                    {selectedCategoryLabel ?? t("filters.all")}
                    <Image
                      src="/white_triangle_down.svg"
                      alt=""
                      width={16}
                      height={16}
                      className={`transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isCategoryOpen && (
                    <div className="absolute top-full left-0 z-50 mt-2 min-w-[220px] flex flex-col gap-px">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory(null);
                          setIsCategoryOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors bg-[#272727] ${
                          !selectedCategory ? "text-[#FECC39]" : "text-white hover:text-[#FECC39]"
                        }`}
                      >
                        {t("filters.all")}
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category.slug}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(category.slug);
                            setIsCategoryOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors bg-[#272727] ${
                            selectedCategory === category.slug
                              ? "text-[#FECC39]"
                              : "text-white hover:text-[#FECC39]"
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSortOpen((prev) => !prev);
                      setIsCategoryOpen(false);
                    }}
                    className={`flex items-center gap-2 text-sm font-bold transition-colors duration-300 ${
                      isSortOpen ? "text-[#FECC39]" : "text-white"
                    }`}
                  >
                    {activeSortOption?.label}
                    <Image
                      src="/white_triangle_down.svg"
                      alt=""
                      width={16}
                      height={16}
                      className={`transition-transform ${isSortOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isSortOpen && (
                    <div className="absolute top-full left-0 z-50 mt-2 min-w-[220px] flex flex-col gap-px">
                      {sortOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            setSortBy(option.id);
                            setIsSortOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors bg-[#272727] ${
                            sortBy === option.id ? "text-[#FECC39]" : "text-white hover:text-[#FECC39]"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProjects.map((project) => (
                <div key={project.id} className="relative group">
                  <Link href={`/works/${project.slug}`} className="block">
                    <Card className="bg-transparent border-0 outline-none shadow-none rounded-none">
                      <CardContent className="p-0 flex flex-col gap-3">
                        <div className="relative w-full aspect-[460/316] bg-cover bg-center overflow-hidden">
                          <Image
                            src={project.coverUrl ?? FALLBACK_COVER}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                            <Image
                              src="/arrow-chevron-right-white.svg"
                              alt="View"
                              width={48}
                              height={48}
                            />
                          </div>
                          <div className="absolute right-3 bottom-3 flex items-center gap-2 z-10">
                            <span className="font-button font-bold text-white text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)]">
                              {project.likesCount}
                            </span>
                            <Image src="/like.svg" alt="Like" width={32} height={32} />
                          </div>
                        </div>
                        <h3 className="font-h6 font-bold text-white text-[length:var(--h6-font-size)] tracking-[var(--h6-letter-spacing)] leading-[var(--h6-line-height)]">
                          {project.title}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
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
            {t("empty")}
          </h2>
        </div>
      )}
    </section>
  );
}
