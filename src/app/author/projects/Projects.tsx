"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "../../../components/ui/card";
import { projectFilterButtons, projectEmptyState } from "../../../data/profileData";
import { getMyProjectsByAuthorId } from "../../../data/projectsData";
import { useAuthorProfile } from "../AuthorProfileContext";
import { withAuthorId } from "../../../lib/authorQuery";

export default function Projects() {
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const { id: authorId, slug } = useAuthorProfile();
  const myProjects = getMyProjectsByAuthorId(authorId);

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
                  href={withAuthorId("/author/projects/project", slug)}
                  className="block group"
                >
                  <Card className="bg-transparent border-0 outline-none shadow-none rounded-none">
                    <CardContent className="p-0 flex flex-col gap-3">
                      {/* Project image with likes overlay */}
                      <div className="relative w-full aspect-[460/316] bg-cover bg-center overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                        {/* Darkening overlay on hover */}
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                        
                        {/* Centered arrow on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          <Image src="/arrow-chevron-right-white.svg" alt="View" width={48} height={48} />
                        </div>
                        
                        <div className="absolute right-3 bottom-3 flex items-center gap-2 z-10">
                          <span className="font-button font-bold text-white text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)]">
                            {project.likes}
                          </span>
                          <Image src="/like.svg" alt="Like" width={32} height={32} />
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
            {projectEmptyState.message}
          </h2>
        </div>
      )}
    </section>
  );
}
