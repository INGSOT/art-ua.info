"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "../../../components/ui/card";

export default function Projects() {
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);

  const projects = [
    { id: 1, image: "/projects/project-photo-1.png", title: "Назва роботи", likes: 17 },
    { id: 2, image: "/projects/project-photo-2.png", title: "Назва роботи", likes: 17 },
    { id: 3, image: "/projects/project-photo-3.png", title: "Назва роботи", likes: 35 },
    { id: 4, image: "/projects/project-photo-4.png", title: "Назва роботи", likes: 17 },
  ];

  const hasProjects = projects.length > 0;

  return (
    <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-20">
      {hasProjects ? (
        <>
          {/* Dark gray filter bar */}
          <div className="w-full bg-[#343434] h-[80px] mb-8">
            <div className="flex items-center h-full px-4 md:px-[30px]">
              <div className="flex items-center gap-8">
                <button
                  className={`flex items-center gap-2 text-sm font-bold transition-colors duration-300 ${
                    hoveredFilter === "all" ? "text-[#FECC39]" : "text-white"
                  }`}
                  onMouseEnter={() => setHoveredFilter("all")}
                  onMouseLeave={() => setHoveredFilter(null)}
                >
                  Усі категорії
                  <Image src="/white_triangle_down.svg" alt="" width={16} height={16} />
                </button>
                <button
                  className={`flex items-center gap-2 text-sm font-bold transition-colors duration-300 ${
                    hoveredFilter === "newest" ? "text-[#FECC39]" : "text-white"
                  }`}
                  onMouseEnter={() => setHoveredFilter("newest")}
                  onMouseLeave={() => setHoveredFilter(null)}
                >
                  Новіші
                  <Image src="/white_triangle_down.svg" alt="" width={16} height={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Projects grid */}
          <div className="px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link key={project.id} href="/author/projects/project" className="block group">
                  <Card className="bg-transparent border-0 outline-none shadow-none rounded-none">
                    <CardContent className="p-0 flex flex-col gap-3">
                      {/* Project image with likes overlay */}
                      <div className="relative w-full aspect-[460/316] bg-cover bg-center">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute right-3 bottom-3 flex items-center gap-2">
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
          <Image src="/megaphone.svg" alt="Megaphone" width={420} height={420} className="w-[200px] h-[200px] md:w-[420px] md:h-[420px]" />
          <p className="mt-6 text-white text-xl md:text-3xl font-bold text-center max-w-[600px]">
            Тут ще нічого немає
          </p>
        </div>
      )}
    </section>
  );
}
