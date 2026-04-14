"use client";

import { useState } from "react";
import Image from "next/image";
import type { Project } from "../../../data/projectsData";

interface ProjectPageClientProps {
  project: Project;
}

export default function ProjectPageClient({ project }: ProjectPageClientProps) {
  const [activeMainSlide, setActiveMainSlide] = useState(0);
  const [activeDescriptionSlide, setActiveDescriptionSlide] = useState(0);
  const [likes] = useState(project.projectDetails.initialLikes);

  const { projectDetails, projectDescriptionData } = project;

  const handlePrevMainSlide = () => {
    setActiveMainSlide((prev) => (prev === 0 ? projectDetails.slides.length - 1 : prev - 1));
  };

  const handleNextMainSlide = () => {
    setActiveMainSlide((prev) => (prev === projectDetails.slides.length - 1 ? 0 : prev + 1));
  };

  const handlePrevDescriptionSlide = () => {
    setActiveDescriptionSlide((prev) => (prev === 0 ? projectDescriptionData.slides.length - 1 : prev - 1));
  };

  const handleNextDescriptionSlide = () => {
    setActiveDescriptionSlide((prev) => (prev === projectDescriptionData.slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <section className="w-full bg-[#414141] py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-white text-2xl md:text-3xl font-bold mb-6 text-center max-w-[600px] whitespace-normal md:whitespace-nowrap">
            {projectDetails.title}
          </h1>

          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            {projectDetails.tags.map((tag, index) => (
              <div key={index} className={`bg-[#343434] px-4 md:px-6 py-3 ${tag.hasIcon ? "flex items-center gap-2" : ""}`}>
                {tag.hasIcon && <Image src="/coins.svg" alt="Coins" width={24} height={24} />}
                <p className={`text-sm md:text-base ${tag.hasIcon ? "text-[#FECC39]" : "text-white"}`}>{tag.text}</p>
              </div>
            ))}
          </div>

          <div className="w-full mb-8">
            <div className="relative w-full aspect-video bg-[#2a2a2a] mb-4">
              <Image src={projectDetails.slides[activeMainSlide]} alt={`Slide ${activeMainSlide + 1}`} fill className="object-cover" />
            </div>

            <div className="flex gap-2 md:gap-4 mb-6 justify-center overflow-x-auto">
              {projectDetails.slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => setActiveMainSlide(index)}
                  className={`relative w-16 h-12 md:w-20 md:h-14 flex-shrink-0 overflow-hidden ${
                    activeMainSlide === index ? "border-2 border-[#FECC39]" : "border-2 border-transparent"
                  }`}
                >
                  <Image src={slide} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4">
              <button onClick={handlePrevMainSlide}>
                <Image src="/white-arrow-left-slider.svg" alt="Previous" width={32} height={32} />
              </button>

              <div className="flex gap-2">
                {projectDetails.slides.map((_, index) => (
                  <Image
                    key={index}
                    src={activeMainSlide === index ? "/white-slider-item-active.svg" : "/white-slider-item-non-active.svg"}
                    alt=""
                    width={20}
                    height={20}
                  />
                ))}
              </div>

              <button onClick={handleNextMainSlide}>
                <Image src="/white-arrow-right-slider.svg" alt="Next" width={32} height={32} />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-6 items-center">
            <p className="text-white font-bold">{projectDetails.links.saveArt}</p>
            <p className="text-white font-bold">{projectDetails.links.artUa}</p>
          </div>

          <div className="bg-[#343434] flex items-stretch justify-center gap-0 mb-8 h-16">
            <div className="flex items-center justify-center w-16">
              <span className="text-[#FECC39] font-bold text-base">{likes}</span>
            </div>
            <div className="w-[2px] bg-black"></div>
            <button className="flex items-center justify-center w-16">
              <Image src="/yellow_like.svg" alt="Like" width={24} height={24} />
            </button>
          </div>

          <div className="w-full mb-6">
            <h2 className="text-white font-bold text-xl mb-6">{projectDetails.characteristicsTitle}</h2>

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-white font-bold">{projectDetails.tableHeaders.name}</span>
                </div>
                <div>
                  <span className="text-white font-bold">{projectDetails.tableHeaders.description}</span>
                </div>
              </div>

              {projectDetails.characteristics.map((item, index) => (
                <div key={index} className="grid grid-cols-2 gap-2 md:gap-4">
                  <div className="bg-[#343434] px-3 md:px-6 py-3 md:py-4">
                    <span className="text-white font-bold text-sm md:text-base">{item.name}</span>
                  </div>
                  <div className="bg-[#343434] px-3 md:px-6 py-3 md:py-4">
                    <span className="text-white text-sm md:text-base">{item.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#FFFCF5] py-8 md:py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8">
          <aside className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-[#414141] p-6 md:p-8">
              <div className="mb-6">
                <div className="w-[60px] h-[60px] rounded-full overflow-hidden border-4 border-yellow-500">
                  <Image
                    src={projectDescriptionData.aboutAuthor.avatar}
                    alt="Author Avatar"
                    width={60}
                    height={60}
                    className="object-cover"
                  />
                </div>
              </div>

              <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 whitespace-normal md:whitespace-nowrap">
                {projectDescriptionData.aboutAuthor.name}
              </h3>

              <p className="text-gray-400 text-sm mb-6">{projectDescriptionData.aboutAuthor.description}</p>

              <div className="flex flex-col gap-3 mb-6">
                <a href="#" className="text-white font-bold text-sm hover:text-[#FECC39] transition-colors">
                  {projectDescriptionData.aboutAuthor.artUaLink}
                </a>
                <a href="#" className="text-white font-bold text-sm hover:text-[#FECC39] transition-colors">
                  {projectDescriptionData.aboutAuthor.saveArtLink}
                </a>
              </div>

              <div className="w-full h-[2px] bg-[#5a5a5a] mb-6"></div>

              <div className="flex justify-between w-full">
                {projectDescriptionData.socialLinks.map((social, index) => (
                  <a key={index} href="#" className="hover:opacity-80 transition-opacity">
                    <Image src={social.icon} alt={social.alt} width={28} height={28} className="w-6 h-6 md:w-8 md:h-8" />
                  </a>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <p className="text-black text-sm mb-6">{projectDescriptionData.date}</p>

            <h2 className="text-black text-2xl md:text-3xl font-bold mb-6 md:mb-8 whitespace-normal md:whitespace-nowrap">
              {projectDescriptionData.title}
            </h2>

            <div className="text-black mb-6 md:mb-8 space-y-3 md:space-y-4 text-sm md:text-base">
              {projectDescriptionData.descriptionText.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="w-full mb-8">
              <div className="relative w-full aspect-video bg-[#d0d0d0] mb-6">
                <Image
                  src={projectDescriptionData.slides[activeDescriptionSlide]}
                  alt={`Slide ${activeDescriptionSlide + 1}`}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex items-center justify-center gap-4">
                <button onClick={handlePrevDescriptionSlide}>
                  <Image src="/black-arrow-left-slider.svg" alt="Previous" width={32} height={32} />
                </button>

                <div className="flex gap-2">
                  {projectDescriptionData.slides.map((_, index) => (
                    <Image
                      key={index}
                      src={activeDescriptionSlide === index ? "/black-slider-item-active.svg" : "/black-slider-item-non-active.svg"}
                      alt=""
                      width={20}
                      height={20}
                    />
                  ))}
                </div>

                <button onClick={handleNextDescriptionSlide}>
                  <Image src="/black-arrow-right-slider.svg" alt="Next" width={32} height={32} />
                </button>
              </div>
            </div>

            <div className="text-black mb-6 md:mb-8 space-y-3 md:space-y-4 text-sm md:text-base">
              {projectDescriptionData.descriptionText.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3">
              {projectDescriptionData.tags.map((tag, index) => (
                <div key={index} className="bg-white border border-gray-300 px-4 md:px-6 py-2 md:py-3">
                  <span className="text-black font-bold text-sm md:text-base">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
