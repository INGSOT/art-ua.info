"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuthorProfile } from "../../AuthorProfileContext";

export default function ProjectDescription() {
  const { projectDescriptionData, id: authorId } = useAuthorProfile();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    setActiveSlide(0);
  }, [authorId]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? projectDescriptionData.slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === projectDescriptionData.slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="w-full bg-[#FFFCF5] py-8 md:py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Left Sidebar - Author Info */}
        <aside className="w-full lg:w-[400px] flex-shrink-0">
          <div className="bg-[#414141] p-6 md:p-8">
            {/* Avatar */}
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

            {/* Name */}
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 whitespace-normal md:whitespace-nowrap">
              {projectDescriptionData.aboutAuthor.name}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-sm mb-6">
              {projectDescriptionData.aboutAuthor.description}
            </p>

            {/* Links */}
            <div className="flex flex-col gap-3 mb-6">
              <a href="#" className="text-white font-bold text-sm hover:text-[#FECC39] transition-colors">
                {projectDescriptionData.aboutAuthor.artUaLink}
              </a>
              <a href="#" className="text-white font-bold text-sm hover:text-[#FECC39] transition-colors">
                {projectDescriptionData.aboutAuthor.saveArtLink}
              </a>
            </div>

            {/* Divider */}
            <div className="w-full h-[2px] bg-[#5a5a5a] mb-6"></div>

            {/* Social Icons - Inside gray background */}
            <div className="flex justify-between w-full">
              {projectDescriptionData.socialLinks.map((social, index) => (
                <a key={index} href="#" className="hover:opacity-80 transition-opacity">
                  <Image
                    src={social.icon}
                    alt={social.alt}
                    width={28}
                    height={28}
                    className="w-6 h-6 md:w-8 md:h-8"
                  />
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Content */}
        <div className="flex-1">
          {/* Date */}
          <p className="text-black text-sm mb-6">{projectDescriptionData.date}</p>

        {/* Title */}
        <h2 className="text-black text-2xl md:text-3xl font-bold mb-6 md:mb-8 whitespace-normal md:whitespace-nowrap">
          {projectDescriptionData.title}
        </h2>

        {/* First Description Block */}
        <div className="text-black mb-6 md:mb-8 space-y-3 md:space-y-4 text-sm md:text-base">
          {projectDescriptionData.descriptionText.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Image Slider */}
        <div className="w-full mb-8">
          {/* Main Image */}
          <div className="relative w-full aspect-video bg-[#d0d0d0] mb-6">
            <Image
              src={projectDescriptionData.slides[activeSlide]}
              alt={`Slide ${activeSlide + 1}`}
              fill
              className="object-cover"
            />
          </div>

          {/* Slider Controls */}
          <div className="flex items-center justify-center gap-4">
            <button onClick={handlePrevSlide}>
              <Image
                src="/black-arrow-left-slider.svg"
                alt="Previous"
                width={32}
                height={32}
              />
            </button>

            <div className="flex gap-2">
              {projectDescriptionData.slides.map((_, index) => (
                <Image
                  key={index}
                  src={
                    activeSlide === index
                      ? "/black-slider-item-active.svg"
                      : "/black-slider-item-non-active.svg"
                  }
                  alt=""
                  width={20}
                  height={20}
                />
              ))}
            </div>

            <button onClick={handleNextSlide}>
              <Image
                src="/black-arrow-right-slider.svg"
                alt="Next"
                width={32}
                height={32}
              />
            </button>
          </div>
        </div>

        {/* Second Description Block */}
        <div className="text-black mb-6 md:mb-8 space-y-3 md:space-y-4 text-sm md:text-base">
          {projectDescriptionData.descriptionText.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

          {/* Tags */}
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
  );
}
