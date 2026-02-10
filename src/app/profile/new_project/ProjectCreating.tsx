"use client";

import { useState } from "react";
import Image from "next/image";
import { newProjectTexts } from "../../../data/newProjectData";
import { aboutMeData } from "../../../data/profileData";

interface Characteristic {
  id: string;
  name: string;
  description: string;
}

export default function ProjectCreating() {
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  const [hoveredOwner, setHoveredOwner] = useState<string | null>(null);
  const [projectNameUa, setProjectNameUa] = useState("");
  const [projectNameEn, setProjectNameEn] = useState("");
  const [tagsUa, setTagsUa] = useState("");
  const [tagsEn, setTagsEn] = useState("");
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([
    { id: "1", name: "", description: "" },
  ]);

  const addCharacteristic = () => {
    const newId = (characteristics.length + 1).toString();
    setCharacteristics([
      ...characteristics,
      { id: newId, name: "", description: "" },
    ]);
  };

  const updateCharacteristic = (
    id: string,
    field: "name" | "description",
    value: string
  ) => {
    setCharacteristics(
      characteristics.map((char) =>
        char.id === id ? { ...char, [field]: value } : char
      )
    );
  };

  const deleteCharacteristic = (id: string) => {
    if (characteristics.length > 1) {
      setCharacteristics(characteristics.filter((char) => char.id !== id));
    }
  };

  const moveCharacteristic = (id: string, direction: "up" | "down") => {
    const index = characteristics.findIndex((char) => char.id === id);
    if (
      (direction === "up" && index > 0) ||
      (direction === "down" && index < characteristics.length - 1)
    ) {
      const newCharacteristics = [...characteristics];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      [newCharacteristics[index], newCharacteristics[targetIndex]] = [
        newCharacteristics[targetIndex],
        newCharacteristics[index],
      ];
      setCharacteristics(newCharacteristics);
    }
  };

  const owners = [
    {
      id: "author",
      type: "author" as const,
      name: aboutMeData.name,
      avatar: aboutMeData.avatar,
    },
    ...aboutMeData.teams.map((team, index) => ({
      id: `team-${index}`,
      type: "team" as const,
      name: team.name,
      avatar: team.icon,
    })),
  ];

  return (
    <form className="flex flex-col items-center gap-8 px-4 py-10 md:px-10 lg:px-20 bg-[#414141] min-h-screen">
      {/* Title */}
      <h1 className="text-[#A0A0A0] text-[32px] md:text-[40px] font-bold text-center">
        {newProjectTexts.title}
      </h1>

      {/* Owner Selection */}
      <div className="w-full max-w-[1000px] flex flex-col gap-4">
        <h2 className="text-white text-[20px] font-semibold text-center">
          {newProjectTexts.ownerQuestion}
        </h2>
        <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
          {owners.map((owner) => (
            <button
              key={owner.id}
              type="button"
              onClick={() => setSelectedOwner(selectedOwner === owner.id ? null : owner.id)}
              onMouseEnter={() => setHoveredOwner(owner.id)}
              onMouseLeave={() => setHoveredOwner(null)}
              className="flex items-center gap-3 px-4 py-3 bg-[#343434] relative whitespace-nowrap h-[60px] w-full md:w-auto"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={owner.avatar}
                  alt={owner.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name */}
              <span className="text-white flex-1">{owner.name}</span>

              {/* Checkmark */}
              <div
                className={`w-5 h-5 flex items-center justify-center transition-colors ${
                  selectedOwner === owner.id ? "bg-[#FFD700]" : "bg-[#414141]"
                }`}
              >
                <Image
                  src={
                    hoveredOwner === owner.id && selectedOwner !== owner.id
                      ? "/yellow_check.svg"
                      : "/grey_check.svg"
                  }
                  alt="check"
                  width={12}
                  height={12}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Project Name Input */}
      <div className="w-full max-w-[1000px] flex flex-col gap-2">
        <label className="text-white text-sm">Назва проекту</label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Image src="/ua.svg" alt="UA" width={24} height={24} />
          </div>
          <input
            type="text"
            value={projectNameUa}
            onChange={(e) => setProjectNameUa(e.target.value)}
            placeholder={newProjectTexts.projectNamePlaceholder}
            className="w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
          />
        </div>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Image src="/en.svg" alt="EN" width={24} height={24} />
          </div>
          <input
            type="text"
            value={projectNameEn}
            onChange={(e) => setProjectNameEn(e.target.value)}
            placeholder={newProjectTexts.projectNamePlaceholderEn}
            className="w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
          />
        </div>
      </div>

      {/* Art Field Button */}
      <div className="w-full max-w-[1000px] flex justify-center">
        <button
          type="button"
          className="flex items-center justify-between gap-4 px-6 py-4 bg-[#343434] text-white"
        >
          <span>{newProjectTexts.artFieldButton}</span>
          <Image
            src="/white_triangle_left.svg"
            alt="arrow"
            width={20}
            height={20}
          />
        </button>
      </div>

      {/* Cover Upload */}
      <div className="w-full max-w-[1000px] flex justify-center">
        <div className="flex flex-col items-center justify-center gap-4 w-[400px] h-[300px] bg-[#343434] cursor-pointer hover:bg-[#3a3a3a] transition-colors">
          <Image src="/upload.svg" alt="upload" width={48} height={48} />
          <div className="text-white text-center">
            <p>Додайте обкладинку</p>
            <p>(Необов'язково)</p>
          </div>
        </div>
      </div>

      {/* Work Upload */}
      <div className="w-full max-w-[1000px] flex justify-center">
        <div className="flex flex-col items-center justify-center gap-4 w-[400px] h-[300px] bg-[#343434] cursor-pointer hover:bg-[#3a3a3a] transition-colors">
          <Image src="/upload.svg" alt="upload" width={48} height={48} />
          <p className="text-white text-center">
            {newProjectTexts.workUploadText}
          </p>
        </div>
      </div>

      {/* Tags Input */}
      <div className="w-full max-w-[1000px] flex flex-col gap-2">
        <label className="text-white text-sm">{newProjectTexts.tagsLabel}</label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Image src="/ua.svg" alt="UA" width={24} height={24} />
          </div>
          <input
            type="text"
            value={tagsUa}
            onChange={(e) => setTagsUa(e.target.value)}
            placeholder={newProjectTexts.tagsPlaceholder}
            className="w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
          />
        </div>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Image src="/en.svg" alt="EN" width={24} height={24} />
          </div>
          <input
            type="text"
            value={tagsEn}
            onChange={(e) => setTagsEn(e.target.value)}
            placeholder={newProjectTexts.tagsPlaceholderEn}
            className="w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
          />
        </div>
        <p className="text-white text-sm text-right">
          {newProjectTexts.tagsHint}
        </p>
      </div>

      {/* Project Characteristics */}
      <div className="w-full max-w-[1000px] flex flex-col gap-6">
        <h2 className="text-white text-[24px] font-bold">
          {newProjectTexts.characteristicsTitle}
        </h2>
        <p className="text-white whitespace-pre-line">
          {newProjectTexts.characteristicsDescription}
        </p>

        {/* Labels - shown only once */}
        {characteristics.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-white text-sm">
                  {newProjectTexts.characteristicNameLabel}
                </label>
              </div>
              <div className="flex-1">
                <label className="text-white text-sm">
                  {newProjectTexts.characteristicDescLabel}
                </label>
              </div>
              {characteristics.length > 1 && <div className="w-[160px]" />}
            </div>
          </div>
        )}

        {/* Characteristics Inputs */}
        {characteristics.map((char, index) => (
          <div key={char.id} className="flex gap-4">
            {/* Input fields container */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Ukrainian inputs */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Image src="/ua.svg" alt="UA" width={24} height={24} />
                  </div>
                  <input
                    type="text"
                    value={char.name}
                    onChange={(e) =>
                      updateCharacteristic(char.id, "name", e.target.value)
                    }
                    placeholder={newProjectTexts.characteristicNamePlaceholder}
                    className="w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
                  />
                </div>
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Image src="/ua.svg" alt="UA" width={24} height={24} />
                  </div>
                  <input
                    type="text"
                    value={char.description}
                    onChange={(e) =>
                      updateCharacteristic(char.id, "description", e.target.value)
                    }
                    placeholder={newProjectTexts.characteristicDescPlaceholder}
                    className="w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
                  />
                </div>
              </div>
              {/* English inputs */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Image src="/en.svg" alt="EN" width={24} height={24} />
                  </div>
                  <input
                    type="text"
                    placeholder={newProjectTexts.characteristicNamePlaceholderEn}
                    className="w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
                  />
                </div>
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Image src="/en.svg" alt="EN" width={24} height={24} />
                  </div>
                  <input
                    type="text"
                    placeholder={newProjectTexts.characteristicDescPlaceholderEn}
                    className="w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
                  />
                </div>
              </div>
            </div>
            {/* Control buttons - vertical layout */}
            {characteristics.length > 1 && (
              <div className="flex flex-col gap-2 bg-[#343434] px-2 py-1">
                <button
                  type="button"
                  onClick={() => moveCharacteristic(char.id, "up")}
                  disabled={index === 0}
                  className="w-[40px] h-[40px] flex items-center justify-center hover:bg-[#414141] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Image
                    src="/yellow_triangle_up.svg"
                    alt="Move up"
                    width={20}
                    height={20}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => moveCharacteristic(char.id, "down")}
                  disabled={index === characteristics.length - 1}
                  className="w-[40px] h-[40px] flex items-center justify-center hover:bg-[#414141] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Image
                    src="/yellow_triangle_down.svg"
                    alt="Move down"
                    width={20}
                    height={20}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => deleteCharacteristic(char.id)}
                  className="w-[40px] h-[40px] flex items-center justify-center hover:bg-[#414141] transition-colors"
                >
                  <Image
                    src="/yellow_cross.svg"
                    alt="Delete"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add Characteristic Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addCharacteristic}
            className="w-[60px] h-[60px] bg-[#FECC39] flex items-center justify-center hover:bg-[#ffd557] transition-colors"
          >
            <Image src="/plus.svg" alt="add" width={24} height={24} />
          </button>
        </div>
      </div>

      {/* Add Block Button */}
      <div className="w-full max-w-[1000px] flex justify-center">
        <button
          type="button"
          className="h-[60px] flex items-stretch transition-all duration-300 bg-white hover:bg-gray-100 w-full md:w-[320px]"
        >
          <span className="flex items-center justify-center flex-1 px-6 font-bold text-black whitespace-nowrap">
            {newProjectTexts.addBlockButton}
          </span>
          <div className="flex items-center justify-center w-[60px] flex-shrink-0 border-l border-black">
            <Image
              src="/plus.svg"
              alt="Plus"
              width={24}
              height={24}
            />
          </div>
        </button>
      </div>
    </form>
  );
}
