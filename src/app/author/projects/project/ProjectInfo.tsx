"use client";

import { useState } from "react";
import Image from "next/image";
import { projectDetails } from "../../../../data/profileData";

export default function ProjectInfo() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [likes, setLikes] = useState(projectDetails.initialLikes);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? projectDetails.slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === projectDetails.slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="w-full bg-[#414141] py-16 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Title */}
        <h1 className="text-white text-2xl md:text-3xl font-bold mb-6 text-center max-w-[600px] whitespace-normal md:whitespace-nowrap">
          {projectDetails.title}
        </h1>

        {/* Tags */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {projectDetails.tags.map((tag, index) => (
            <div key={index} className={`bg-[#343434] px-4 md:px-6 py-3 ${tag.hasIcon ? 'flex items-center gap-2' : ''}`}>
              {tag.hasIcon && <Image src="/coins.svg" alt="Coins" width={24} height={24} />}
              <p className={` text-sm md:text-base ${tag.hasIcon ? 'text-[#FECC39]' : 'text-white'}`}>{tag.text}</p>
            </div>
          ))}
        </div>

        {/* Image Slider */}
        <div className="w-full mb-8">
          {/* Main Image */}
          <div className="relative w-full aspect-video bg-[#2a2a2a] mb-4">
            <Image
              src={projectDetails.slides[activeSlide]}
              alt={`Slide ${activeSlide + 1}`}
              fill
              className="object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 md:gap-4 mb-6 justify-center overflow-x-auto">
            {projectDetails.slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`relative w-16 h-12 md:w-20 md:h-14 flex-shrink-0 overflow-hidden ${
                  activeSlide === index ? "border-2 border-[#FECC39]" : "border-2 border-transparent"
                }`}
              >
                <Image
                  src={slide}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Slider Controls */}
          <div className="flex items-center justify-center gap-4">
            <button onClick={handlePrevSlide}>
              <Image
                src="/white-arrow-left-slider.svg"
                alt="Previous"
                width={32}
                height={32}
              />
            </button>

            <div className="flex gap-2">
              {projectDetails.slides.map((_, index) => (
                <Image
                  key={index}
                  src={
                    activeSlide === index
                      ? "/white-slider-item-active.svg"
                      : "/white-slider-item-non-active.svg"
                  }
                  alt=""
                  width={20}
                  height={20}
                />
              ))}
            </div>

            <button onClick={handleNextSlide}>
              <Image
                src="/white-arrow-right-slider.svg"
                alt="Next"
                width={32}
                height={32}
              />
            </button>
          </div>
        </div>

        {/* Project Links */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-6 items-center">
          <p className="text-white font-bold">
            {projectDetails.links.saveArt}
          </p>
          <p className="text-white font-bold">
            {projectDetails.links.artUa}
          </p>
        </div>

        {/* Likes Section */}
        <div className="bg-[#343434] flex items-stretch justify-center gap-0 mb-8 h-16">
          <div className="flex items-center justify-center w-16">
            <span className="text-[#FECC39] font-bold text-base">{likes}</span>
          </div>
          <div className="w-[2px] bg-black"></div>
          <button className="flex items-center justify-center w-16">
            <Image src="/yellow_like.svg" alt="Like" width={24} height={24} />
          </button>
        </div>

        {/* Project Characteristics */}
        <div className="w-full mb-6">
          <h2 className="text-white font-bold text-xl mb-6">
            {projectDetails.characteristicsTitle}
          </h2>

          {/* Characteristics Table */}
          <div className="flex flex-col gap-3">
            {/* Table Headers */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-white font-bold">{projectDetails.tableHeaders.name}</span>
              </div>
              <div>
                <span className="text-white font-bold">{projectDetails.tableHeaders.description}</span>
              </div>
            </div>

            {/* Table Rows */}
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
  );
}
