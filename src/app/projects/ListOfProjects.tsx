"use client";

import Image from "next/image";
import { Card, CardContent } from "../../components/ui/card";
import { projectsData } from "../../data/projectsData";

interface ListOfProjectsProps {
  currentPage: number;
  itemsPerPage: number;
}

export default function ListOfProjects({ currentPage, itemsPerPage }: ListOfProjectsProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = projectsData.slice(startIndex, endIndex);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {currentProjects.map((project) => (
        <Card
          key={project.id}
          className="bg-transparent border-0 outline-none shadow-none rounded-none group cursor-pointer"
        >
          <CardContent className="p-0 flex flex-col gap-2 md:gap-3">
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
              
              <div className="absolute right-2 bottom-2 md:right-3 md:bottom-3 flex items-center gap-1 md:gap-2 z-10">
                <span className="font-button font-bold text-white text-sm md:text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)]">
                  {project.likes}
                </span>
                <Image src="/like.svg" alt="Like" width={24} height={24} className="md:w-8 md:h-8" />
              </div>
            </div>
            {/* Project title */}
            <h3 className="font-h6 font-bold text-white text-base md:text-lg lg:text-[length:var(--h6-font-size)] tracking-[var(--h6-letter-spacing)] leading-[var(--h6-line-height)]">
              {project.title}
            </h3>
            {/* Author info */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden border-2 border-yellow-500">
                <Image
                  src={project.authorAvatar}
                  alt={project.authorName}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <span className="font-wix text-white text-xs md:text-sm font-bold">{project.authorName}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
