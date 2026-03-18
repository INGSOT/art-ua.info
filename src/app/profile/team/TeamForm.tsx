"use client";

import { useState } from "react";
import Image from "next/image";
import AddProjectCover from "../new_project/AddProjectCover";
import SearchSection from "../../../components/SearchSection";

interface TeamFormProps {
  mode?: "create" | "edit";
}

export default function TeamForm({ mode = "create" }: TeamFormProps) {
  const isEditMode = mode === "edit";

  const [teamCover, setTeamCover] = useState<string | null>(null);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);

  const [nameUa, setNameUa] = useState("");
  const [nameEn, setNameEn] = useState("");

  const [countryUa, setCountryUa] = useState("");
  const [countryEn, setCountryEn] = useState("");

  const [cityUa, setCityUa] = useState("");
  const [cityEn, setCityEn] = useState("");

  const [regionUa, setRegionUa] = useState("");
  const [regionEn, setRegionEn] = useState("");

  const [zipUa, setZipUa] = useState("");
  const [zipEn, setZipEn] = useState("");

  const [specializationUa, setSpecializationUa] = useState("");
  const [specializationEn, setSpecializationEn] = useState("");
  const [aboutUa, setAboutUa] = useState("");
  const [aboutEn, setAboutEn] = useState("");

  const [membersQuery, setMembersQuery] = useState("");

  const [isPrimaryHovered, setIsPrimaryHovered] = useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);

  const handlePrimary = () => {
    // TODO: implement create/save logic
    console.log(isEditMode ? "Saving team..." : "Creating team...");
  };

  const handleDelete = () => {
    // TODO: implement delete logic
    console.log("Deleting team...");
  };

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-10 md:px-10 lg:px-20 bg-[#414141] min-h-screen">
      <form className="flex flex-col items-center gap-8 w-full max-w-[1000px]">
        {/* Cover Upload */}
        <div className="w-full flex justify-center">
          <div
            onClick={() => !teamCover && setIsCoverModalOpen(true)}
            className={`relative flex flex-col items-center justify-center gap-4 w-[400px] h-[400px] bg-[#343434] transition-colors ${
              !teamCover ? "cursor-pointer hover:bg-[#3a3a3a]" : ""
            }`}
          >
            {teamCover ? (
              <>
                <Image
                  src={teamCover}
                  alt="Team cover"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCoverModalOpen(true);
                  }}
                  className="absolute top-4 right-4 w-12 h-12 bg-[#343434] flex items-center justify-center hover:bg-[#414141] transition-colors z-10"
                >
                  <Image
                    src="/yellow_cross.svg"
                    alt="Edit"
                    width={24}
                    height={24}
                  />
                </button>
              </>
            ) : (
              <>
                <Image src="/upload.svg" alt="upload" width={48} height={48} />
                <p className="text-white text-center">
                  Додайте обкладинку<br />(обов&apos;язково)
                </p>
              </>
            )}
          </div>
        </div>

        {/* Team Name */}
        <div className="w-full flex flex-col gap-2">
          <label className="font-wix text-white text-sm">Назва команди</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Image src="/ua.svg" alt="UA" width={24} height={24} />
            </div>
            <input
              type="text"
              value={nameUa}
              onChange={(e) => setNameUa(e.target.value)}
              placeholder="Вкажіть назву команди"
              className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
            />
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Image src="/en.svg" alt="EN" width={24} height={24} />
            </div>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="Please specify the team name"
              className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
            />
          </div>
        </div>

        {/* Country + City */}
        <div className="w-full flex flex-col md:flex-row gap-3">
          <div className="w-full md:flex-1 md:max-w-[494px] flex flex-col gap-2">
            <label className="font-wix text-white text-sm">Країна</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src="/ua.svg" alt="UA" width={24} height={24} />
              </div>
              <input
                type="text"
                value={countryUa}
                onChange={(e) => setCountryUa(e.target.value)}
                placeholder="Вкажіть країну"
                className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
              />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src="/en.svg" alt="EN" width={24} height={24} />
              </div>
              <input
                type="text"
                value={countryEn}
                onChange={(e) => setCountryEn(e.target.value)}
                placeholder="Please specify the country"
                className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
              />
            </div>
          </div>

          <div className="w-full md:flex-1 md:max-w-[494px] flex flex-col gap-2">
            <label className="font-wix text-white text-sm">Населений пункт</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src="/ua.svg" alt="UA" width={24} height={24} />
              </div>
              <input
                type="text"
                value={cityUa}
                onChange={(e) => setCityUa(e.target.value)}
                placeholder="Вкажіть назву"
                className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
              />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src="/en.svg" alt="EN" width={24} height={24} />
              </div>
              <input
                type="text"
                value={cityEn}
                onChange={(e) => setCityEn(e.target.value)}
                placeholder="Please specify the city"
                className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
              />
            </div>
          </div>
        </div>

        {/* Region + Zip */}
        <div className="w-full flex flex-col md:flex-row gap-3">
          <div className="w-full md:flex-1 md:max-w-[494px] flex flex-col gap-2">
            <label className="font-wix text-white text-sm">Область, регіон</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src="/ua.svg" alt="UA" width={24} height={24} />
              </div>
              <input
                type="text"
                value={regionUa}
                onChange={(e) => setRegionUa(e.target.value)}
                placeholder="Вкажіть область"
                className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
              />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src="/en.svg" alt="EN" width={24} height={24} />
              </div>
              <input
                type="text"
                value={regionEn}
                onChange={(e) => setRegionEn(e.target.value)}
                placeholder="Please specify the region"
                className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
              />
            </div>
          </div>

          <div className="w-full md:flex-1 md:max-w-[494px] flex flex-col gap-2">
            <label className="font-wix text-white text-sm">Поштовий індекс</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src="/ua.svg" alt="UA" width={24} height={24} />
              </div>
              <input
                type="text"
                value={zipUa}
                onChange={(e) => setZipUa(e.target.value)}
                placeholder="Вкажіть індекс"
                className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
              />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src="/en.svg" alt="EN" width={24} height={24} />
              </div>
              <input
                type="text"
                value={zipEn}
                onChange={(e) => setZipEn(e.target.value)}
                placeholder="Please specify the postal code"
                className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
              />
            </div>
          </div>
        </div>

        {/* Specialization */}
        <div className="w-full flex flex-col gap-2">
          <label className="font-wix text-white text-sm">Спеціалізація команди</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Image src="/ua.svg" alt="UA" width={24} height={24} />
            </div>
            <input
              type="text"
              value={specializationUa}
              onChange={(e) => setSpecializationUa(e.target.value)}
              placeholder="Наприклад: відеозйомка"
              className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
            />
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Image src="/en.svg" alt="EN" width={24} height={24} />
            </div>
            <input
              type="text"
              value={specializationEn}
              onChange={(e) => setSpecializationEn(e.target.value)}
              placeholder="For example: video shooting"
              className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
            />
          </div>
        </div>

        {/* About */}
        <div className="w-full flex flex-col gap-2">
          <label className="font-wix text-white text-sm">Інформація про команду</label>
          <div className="relative">
            <div className="absolute left-4 top-4">
              <Image src="/ua.svg" alt="UA" width={24} height={24} />
            </div>
            <textarea
              value={aboutUa}
              onChange={(e) => setAboutUa(e.target.value)}
              placeholder="Розкажіть про діяльність команди"
              className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0] resize-none"
              style={{ height: "180px" }}
            />
          </div>
          <div className="relative">
            <div className="absolute left-4 top-4">
              <Image src="/en.svg" alt="EN" width={24} height={24} />
            </div>
            <textarea
              value={aboutEn}
              onChange={(e) => setAboutEn(e.target.value)}
              placeholder="Tell us about the team's activity"
              className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0] resize-none"
              style={{ height: "180px" }}
            />
          </div>
        </div>

        {/* Members */}
        <div className="w-full flex flex-col gap-4">
          <div
            className="text-white"
            style={{
              fontWeight: 600,
              fontSize: "18px",
              lineHeight: "24px",
              maxWidth: "600px",
            }}
          >
            Учасники
          </div>

          <SearchSection
            value={membersQuery}
            onChange={setMembersQuery}
            placeholder="Вкажіть ім’я або назву компанії"
            maxWidthPx={1000}
          />
        </div>

        {/* Primary Button */}
        <button
          type="button"
          onClick={handlePrimary}
          onMouseEnter={() => setIsPrimaryHovered(true)}
          onMouseLeave={() => setIsPrimaryHovered(false)}
          className={`w-[300px] h-[60px] flex items-stretch transition-all duration-300 ${
            isPrimaryHovered ? "bg-white" : "bg-[#FECC39]"
          }`}
        >
          <span className="flex items-center justify-center flex-1 px-6 font-bold text-[#343434]">
            {isEditMode ? "Зберегти" : "Створити"}
          </span>
          <div className="flex items-center justify-center w-[60px] border-l border-[#343434]">
            <Image src="/grey_check.svg" alt="Primary" width={20} height={20} />
          </div>
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={handleDelete}
          onMouseEnter={() => setIsDeleteHovered(true)}
          onMouseLeave={() => setIsDeleteHovered(false)}
          className={`w-[300px] h-[60px] flex items-stretch transition-all duration-300 ${
            isDeleteHovered ? "bg-[#FECC39]" : "bg-[#343434]"
          }`}
        >
          <span
            className={`flex items-center justify-center flex-1 px-6 font-bold transition-colors ${
              isDeleteHovered ? "text-[#343434]" : "text-[#FECC39]"
            }`}
          >
            Видалити
          </span>
          <div
            className={`flex items-center justify-center w-[60px] border-l transition-colors ${
              isDeleteHovered ? "border-[#343434]" : "border-[#FECC39]"
            }`}
          >
            <Image
              src={isDeleteHovered ? "/black_cross.svg" : "/yellow_cross.svg"}
              alt="Delete"
              width={24}
              height={24}
            />
          </div>
        </button>
      </form>

      <AddProjectCover
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        onImageSelect={(imageUrl) => setTeamCover(imageUrl)}
        onImageRemove={() => setTeamCover(null)}
        currentImage={teamCover}
        customTitle="Додайте обкладинку"
      />
    </div>
  );
}

