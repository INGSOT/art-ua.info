"use client";

import Image from "next/image";

export default function InformationSection() {
  return (
    <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-20">
      {/* Website section */}
      <div className="w-full bg-[#343434] h-auto md:h-[80px] mb-4 py-4 md:py-0">
        <div className="flex flex-col md:flex-row md:items-center justify-start h-full px-4 md:px-[30px] gap-4 md:gap-6">
          <div className="flex items-center gap-4">
            <Image src="/planet.svg" alt="Website" width={24} height={24} />
            <span className="text-white text-sm font-bold">website.com</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
            <Image src="/socials/deviantart_yellow.svg" alt="DeviantArt" width={24} height={24} />
            <Image src="/socials/pinterest_yellow.svg" alt="Pinterest" width={24} height={24} />
            <Image src="/socials/youtube_yellow.svg" alt="YouTube" width={24} height={24} />
            <Image src="/socials/instagram_yellow.svg" alt="Instagram" width={24} height={24} />
            <Image src="/socials/facebook_yellow.svg" alt="Facebook" width={24} height={24} />
            <Image src="/socials/linked_in_yellow.svg" alt="LinkedIn" width={24} height={24} />
            <Image src="/socials/x_yellow.svg" alt="X" width={24} height={24} />
          </div>
        </div>
      </div>

      {/* Location section */}
      <div className="w-full max-w-[960px] bg-[#343434] h-[80px] mb-6 mx-auto">
        <div className="flex items-center h-full px-4 md:px-[30px] gap-4">
          <Image src="/earth.svg" alt="Location" width={24} height={24} />
          <span className="text-white text-sm font-bold">Україна</span>
          <span className="text-white text-sm font-bold">Кривий ріг</span>
        </div>
      </div>

      {/* Description text */}
      <div className="w-full max-w-[960px] px-4 md:px-[30px] mx-auto">
        <div className="text-white space-y-4">
          <p>Текст опису про себе.</p>
          <p>
            Культурна спадщина України в контексті нових історичних подій набула
            особливої актуальності та нових змістів.
          </p>
          <p>
            Сьогодні образотворче мистецтво у фарбах на холсті відображає не просто
            сюжети чи метафори, а небувалий у сучасній історії злам епох. Художники
            фіксують не тільки події, а ще й глибину емоційно-почуттєвого фону, який
            неможливо передати на словах та в стрічці новин. Це - новітнє мистецтво,
            сучасне, переосмислене, глибинне, на віки.
          </p>
          <p>
            Саме зараз настає його час - аби уберегти наступні покоління від руїн,
            транслюючи біль крізь художні образи.
          </p>
        </div>
      </div>
    </section>
  );
}
