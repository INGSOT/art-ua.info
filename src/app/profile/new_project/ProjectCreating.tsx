"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { newProjectTexts } from "../../../data/newProjectData";
import { useProfileView } from "../ProfileViewContext";
import AddProjectCover from "./AddProjectCover";
import AddWork from "./AddWork";
import SelectArtForm from "./SelectArtForm";
import AddBlock from "./AddBlock";
import AddTitle from "./AddTitle";
import AddParagraph from "./AddParagraph";
import AddLink from "./AddLink";
import AddImageGallery from "./AddImageGallery";
import ImageGallerySlider from "./ImageGallerySlider";
import { getVideoInfo } from "../../../utils/videoUtils";

interface Characteristic {
  id: string;
  name: string;
  description: string;
}

interface TitleBlock {
  id: string;
  titleUa: string;
  titleEn: string;
}

interface ParagraphBlock {
  id: string;
  paragraphUa: string;
  paragraphEn: string;
}

interface ImageBlock {
  id: string;
  imageUrl: string;
}

interface LinkBlock {
  id: string;
  url: string;
}

type ContentBlock = 
  | { type: 'title'; data: TitleBlock }
  | { type: 'paragraph'; data: ParagraphBlock }
  | { type: 'image'; data: ImageBlock }
  | { type: 'link'; data: LinkBlock };

export default function ProjectCreating() {
  const { aboutMe } = useProfileView();
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  const [hoveredOwner, setHoveredOwner] = useState<string | null>(null);
  const [projectNameUa, setProjectNameUa] = useState("");
  const [projectNameEn, setProjectNameEn] = useState("");
  const [tagsUa, setTagsUa] = useState("");
  const [tagsEn, setTagsEn] = useState("");
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([
    { id: "1", name: "", description: "" },
  ]);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [projectCover, setProjectCover] = useState<string | null>(null);
  const [workImage, setWorkImage] = useState<string | null>(null);
  const [workVideoUrl, setWorkVideoUrl] = useState<string | null>(null);
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [isWorkLinkModalOpen, setIsWorkLinkModalOpen] = useState(false);
  const [isWorkImageModalOpen, setIsWorkImageModalOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isArtFormModalOpen, setIsArtFormModalOpen] = useState(false);
  const [selectedArtField, setSelectedArtField] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [isParagraphModalOpen, setIsParagraphModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [currentImageBlockId, setCurrentImageBlockId] = useState<string | null>(null);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [blockModalNoAnimation, setBlockModalNoAnimation] = useState(false);

  // Save project data to localStorage whenever it changes
  useEffect(() => {
    const projectData = {
      selectedOwner,
      projectNameUa,
      projectNameEn,
      tagsUa,
      tagsEn,
      selectedArtField,
      projectCover,
      workImage,
      workVideoUrl,
      galleryImages,
      contentBlocks,
      characteristics,
    };
    localStorage.setItem('projectData', JSON.stringify(projectData));
  }, [selectedOwner, projectNameUa, projectNameEn, tagsUa, tagsEn, selectedArtField, projectCover, workImage, workVideoUrl, galleryImages, contentBlocks, characteristics]);

  // Check if projectData was deleted from localStorage (after successful submit) and clear form
  useEffect(() => {
    const checkIfCleared = setInterval(() => {
      const projectData = localStorage.getItem('projectData');
      if (!projectData) {
        // Clear all form fields
        setSelectedOwner(null);
        setProjectNameUa("");
        setProjectNameEn("");
        setTagsUa("");
        setTagsEn("");
        setSelectedArtField(null);
        setProjectCover(null);
        setWorkImage(null);
        setWorkVideoUrl(null);
        setGalleryImages([]);
        setContentBlocks([]);
        setCharacteristics([{ id: "1", name: "", description: "" }]);
        clearInterval(checkIfCleared);
      }
    }, 500);
    
    return () => clearInterval(checkIfCleared);
  }, []);

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

  const addTitleBlock = (titleUa: string, titleEn: string) => {
    const newId = (contentBlocks.length + 1).toString();
    const newBlock: ContentBlock = {
      type: 'title',
      data: { id: newId, titleUa, titleEn }
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const addParagraphBlock = (paragraphUa: string, paragraphEn: string) => {
    const newId = (contentBlocks.length + 1).toString();
    const newBlock: ContentBlock = {
      type: 'paragraph',
      data: { id: newId, paragraphUa, paragraphEn }
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const addImageBlock = (imageUrl: string) => {
    const newId = (contentBlocks.length + 1).toString();
    const newBlock: ContentBlock = {
      type: 'image',
      data: { id: newId, imageUrl }
    };
    setContentBlocks([...contentBlocks, newBlock]);
    setCurrentImageBlockId(newId);
  };

  const addLinkBlock = (url: string) => {
    const newId = (contentBlocks.length + 1).toString();
    const newBlock: ContentBlock = {
      type: 'link',
      data: { id: newId, url }
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const deleteContentBlock = (id: string) => {
    // If deleting the current image block, clear the modal state
    if (currentImageBlockId === id) {
      setCurrentImageBlockId(null);
    }
    setContentBlocks(contentBlocks.filter((block) => block.data.id !== id));
  };

  const moveContentBlock = (id: string, direction: "up" | "down") => {
    const index = contentBlocks.findIndex((block) => block.data.id === id);
    if (
      (direction === "up" && index > 0) ||
      (direction === "down" && index < contentBlocks.length - 1)
    ) {
      const newBlocks = [...contentBlocks];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      [newBlocks[index], newBlocks[targetIndex]] = [
        newBlocks[targetIndex],
        newBlocks[index],
      ];
      setContentBlocks(newBlocks);
    }
  };

  const handleTitleClick = () => {
    setIsBlockModalOpen(false);
    setIsTitleModalOpen(true);
  };

  const handleParagraphClick = () => {
    setIsBlockModalOpen(false);
    setIsParagraphModalOpen(true);
  };

  const handleImageClick = () => {
    setIsBlockModalOpen(false);
    setIsImageModalOpen(true);
  };

  const handleLinkClick = () => {
    setIsBlockModalOpen(false);
    setIsLinkModalOpen(true);
  };

  const handleTitleBack = () => {
    setIsTitleModalOpen(false);
    setBlockModalNoAnimation(true);
    setIsBlockModalOpen(true);
  };

  const handleParagraphBack = () => {
    setIsParagraphModalOpen(false);
    setBlockModalNoAnimation(true);
    setIsBlockModalOpen(true);
  };

  const handleImageBack = () => {
    setIsImageModalOpen(false);
    setBlockModalNoAnimation(true);
    setIsBlockModalOpen(true);
  };

  const handleLinkBack = () => {
    setIsLinkModalOpen(false);
    setBlockModalNoAnimation(true);
    setIsBlockModalOpen(true);
  };

  const handleWorkImageClick = () => {
    setIsWorkModalOpen(false);
    setIsWorkImageModalOpen(true);
  };

  const handleWorkGalleryClick = () => {
    setIsWorkModalOpen(false);
    setIsGalleryModalOpen(true);
  };

  const handleWorkLinkClick = () => {
    setIsWorkModalOpen(false);
    setIsWorkLinkModalOpen(true);
  };

  const handleWorkLinkBack = () => {
    setIsWorkLinkModalOpen(false);
    setIsWorkModalOpen(true);
  };

  const handleAddWorkLink = (url: string) => {
    setWorkVideoUrl(url);
    setWorkImage(null);
    setGalleryImages([]);
  };

  const handleBlockModalClose = () => {
    setIsBlockModalOpen(false);
    setBlockModalNoAnimation(false);
  };

  const owners = [
    {
      id: "author",
      type: "author" as const,
      name: aboutMe.name,
      avatar: aboutMe.avatar,
    },
    ...aboutMe.teams.map((team, index) => ({
      id: `team-${index}`,
      type: "team" as const,
      name: team.name,
      avatar: team.icon,
    })),
  ];

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-10 md:px-10 lg:px-[75px] bg-[#414141] min-h-screen">
      <form className="flex flex-col items-center gap-8 w-full">
      {/* Title */}
      <h1 className="text-[#A0A0A0] text-[32px] md:text-[40px] font-bold text-center">
        {newProjectTexts.title}
      </h1>

      {/* Owner Selection */}
      <div className="w-full max-w-[1000px] flex flex-col gap-4">
        <p className="font-wix text-white text-[18px] font-semibold text-center">
          {newProjectTexts.ownerQuestion}
        </p>
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
              <span className="font-wix text-white flex-1">{owner.name}</span>

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
        <label className="font-wix text-white text-sm">{newProjectTexts.projectNameLabel}</label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Image src="/ua.svg" alt="UA" width={24} height={24} />
          </div>
          <input
            type="text"
            value={projectNameUa}
            onChange={(e) => setProjectNameUa(e.target.value)}
            placeholder={newProjectTexts.projectNamePlaceholder}
            className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
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
            className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
          />
        </div>
      </div>

      {/* Art Field Button */}
      <div className="w-full max-w-[1000px] flex justify-center">
        <button
          type="button"
          onClick={() => setIsArtFormModalOpen(true)}
          className="font-wix flex items-center justify-between gap-4 px-6 py-4 bg-[#343434] text-white hover:bg-[#3a3a3a] transition-colors"
        >
          <span>
            {selectedArtField ? selectedArtField.label : newProjectTexts.artFieldButton}
          </span>
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
        <div
          onClick={() => !projectCover && setIsCoverModalOpen(true)}
          className={`relative flex flex-col items-center justify-center gap-4 w-[400px] h-[300px] bg-[#343434] transition-colors ${!projectCover ? 'cursor-pointer hover:bg-[#3a3a3a]' : ''}`}
        >
          {projectCover ? (
            <>
              <Image
                src={projectCover}
                alt="Project cover"
                fill
                className="object-cover"
              />
              <button
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
              <div className="text-white text-center">
                <p>{newProjectTexts.addCoverText}</p>
                <p>{newProjectTexts.addCoverOptional}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Work Upload */}
      <div className="w-full max-w-[1000px] flex justify-center">
        {galleryImages.length > 0 ? (
          <ImageGallerySlider
            images={galleryImages}
            onEditClick={() => setIsGalleryModalOpen(true)}
          />
        ) : workVideoUrl ? (
          (() => {
            const videoInfo = getVideoInfo(workVideoUrl);
            return videoInfo ? (
              <div className="relative w-full aspect-[4/3] bg-[#343434]">
                <iframe
                  src={`https://www.youtube.com/embed/${videoInfo.videoId}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
                {/* Delete Button */}
                <button
                  onClick={() => setWorkVideoUrl(null)}
                  className="absolute top-2 right-2 w-10 h-10 bg-[#343434] hover:bg-[#FECC39] flex items-center justify-center transition-colors group z-10"
                >
                  <Image
                    src="/yellow_cross.svg"
                    alt="Remove"
                    width={24}
                    height={24}
                    className="group-hover:brightness-0 group-hover:saturate-100 group-hover:invert-[0.2] transition-all"
                  />
                </button>
              </div>
            ) : null;
          })()
        ) : workImage ? (
          <div className="relative w-full aspect-[4/3] bg-[#343434]">
            <Image
              src={workImage}
              alt="Work image"
              fill
              className="object-cover"
            />
            {/* Delete Button */}
            <button
              onClick={() => setIsWorkImageModalOpen(true)}
              className="absolute top-2 right-2 w-10 h-10 bg-[#343434] hover:bg-[#FECC39] flex items-center justify-center transition-colors group z-10"
            >
              <Image
                src="/yellow_cross.svg"
                alt="Remove"
                width={24}
                height={24}
                className="group-hover:brightness-0 group-hover:saturate-100 group-hover:invert-[0.2] transition-all"
              />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => setIsWorkModalOpen(true)}
            className="flex flex-col items-center justify-center gap-4 w-[400px] h-[300px] bg-[#343434] cursor-pointer hover:bg-[#3a3a3a] transition-colors"
          >
            <Image src="/upload.svg" alt="upload" width={48} height={48} />
            <p className="text-white text-center">
              {newProjectTexts.workUploadText}
            </p>
          </div>
        )}
      </div>

      {/* Tags Input */}
      <div className="w-full max-w-[1000px] flex flex-col gap-2">
        <label className="font-wix text-white text-sm">{newProjectTexts.tagsLabel}</label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Image src="/ua.svg" alt="UA" width={24} height={24} />
          </div>
          <input
            type="text"
            value={tagsUa}
            onChange={(e) => setTagsUa(e.target.value)}
            placeholder={newProjectTexts.tagsPlaceholder}
            className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
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
            className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
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
                <label className="font-wix text-white text-sm">
                  {newProjectTexts.characteristicNameLabel}
                </label>
              </div>
              <div className="flex-1">
                <label className="font-wix text-white text-sm">
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
                    className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
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
                    className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
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
                    className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
                  />
                </div>
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Image src="/en.svg" alt="EN" width={24} height={24} />
                  </div>
                  <input
                    type="text"
                    placeholder={newProjectTexts.characteristicDescPlaceholderEn}
                    className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
                  />
                </div>
              </div>
            </div>
            {/* Control buttons - vertical layout */}
            {characteristics.length > 1 && (
              <div className="flex flex-col justify-center gap-1 bg-[#343434] px-2 h-full">
                <button
                  type="button"
                  onClick={() => moveCharacteristic(char.id, "up")}
                  disabled={index === 0}
                  className="w-[40px] h-[36px] flex items-center justify-center hover:bg-[#414141] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
                  className="w-[40px] h-[36px] flex items-center justify-center hover:bg-[#414141] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
                  className="w-[40px] h-[36px] flex items-center justify-center hover:bg-[#414141] transition-colors"
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

      {/* Content Blocks */}
      {contentBlocks.map((block, index) => (
        <div key={block.data.id} className="w-full max-w-[1000px] flex gap-4">
          {/* Content Fields */}
          <div className="flex-1 flex flex-col gap-4">
            {block.type === 'title' ? (
              <>
                {/* Ukrainian Title */}
                <div className="flex items-center gap-4 px-6 py-4 bg-[#343434]">
                  <Image src="/ua.svg" alt="UA" width={24} height={24} />
                  <span className="text-white flex-1">{block.data.titleUa}</span>
                </div>
                {/* English Title */}
                <div className="flex items-center gap-4 px-6 py-4 bg-[#343434]">
                  <Image src="/en.svg" alt="EN" width={24} height={24} />
                  <span className="text-white flex-1">{block.data.titleEn}</span>
                </div>
              </>
            ) : block.type === 'paragraph' ? (
              <>
                {/* Ukrainian Paragraph */}
                <div className="flex items-center gap-4 px-6 py-4 bg-[#343434]">
                  <Image src="/ua.svg" alt="UA" width={24} height={24} />
                  <span className="text-white flex-1">{block.data.paragraphUa}</span>
                </div>
                {/* English Paragraph */}
                <div className="flex items-center gap-4 px-6 py-4 bg-[#343434]">
                  <Image src="/en.svg" alt="EN" width={24} height={24} />
                  <span className="text-white flex-1">{block.data.paragraphEn}</span>
                </div>
              </>
            ) : block.type === 'image' ? (
              <>
                {/* Image Block */}
                <div className="relative w-full aspect-[4/3] bg-[#343434]">
                  <Image
                    src={block.data.imageUrl}
                    alt="Content image"
                    fill
                    className="object-cover"
                  />
                </div>
              </>
            ) : (
              <>
                {/* Link Block - Display as YouTube player if YouTube */}
                {(() => {
                  const videoInfo = getVideoInfo(block.data.url);
                  return videoInfo ? (
                    <div className="relative w-full aspect-[4/3] bg-[#343434]">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoInfo.videoId}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center px-6 py-7 bg-[#343434] min-h-[130px]">
                      <a 
                        href={block.data.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#FECC39] hover:underline break-all"
                      >
                        {block.data.url}
                      </a>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
          {/* Control buttons - vertical layout */}
          <div className={`flex flex-col justify-center gap-1 bg-[#343434] px-2 ${block.type === 'paragraph' ? 'h-[120px]' : block.type === 'link' ? 'h-full' : block.type === 'image' ? 'h-[120px]' : 'h-full'}`}>
            <button
              type="button"
              onClick={() => moveContentBlock(block.data.id, "up")}
              disabled={index === 0}
              className="w-[40px] h-[36px] flex items-center justify-center hover:bg-[#414141] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
              onClick={() => moveContentBlock(block.data.id, "down")}
              disabled={index === contentBlocks.length - 1}
              className="w-[40px] h-[36px] flex items-center justify-center hover:bg-[#414141] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
              onClick={() => deleteContentBlock(block.data.id)}
              className="w-[40px] h-[36px] flex items-center justify-center hover:bg-[#414141] transition-colors"
            >
              <Image
                src="/yellow_cross.svg"
                alt="Delete"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>
      ))}

      {/* Add Block Button */}
      <div className="w-full max-w-[1000px] flex justify-center">
        <button
          type="button"
          onClick={() => setIsBlockModalOpen(true)}
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

      {/* Add Project Cover Modal */}
      <AddProjectCover
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        onImageSelect={(imageUrl) => setProjectCover(imageUrl)}
        onImageRemove={() => setProjectCover(null)}
        currentImage={projectCover}
      />

      {/* Add Work Modal */}
      <AddWork
        isOpen={isWorkModalOpen}
        onClose={() => setIsWorkModalOpen(false)}
        onImageClick={handleWorkImageClick}
        onGalleryClick={handleWorkGalleryClick}
        onLinkClick={handleWorkLinkClick}
      />

      {/* Add Work Image Modal */}
      <AddProjectCover
        isOpen={isWorkImageModalOpen}
        onClose={() => setIsWorkImageModalOpen(false)}
        onImageSelect={(imageUrl) => {
          setWorkImage(imageUrl);
          setIsWorkImageModalOpen(false);
        }}
        onImageRemove={() => setWorkImage(null)}
        currentImage={workImage}
        customTitle={newProjectTexts.addImageModalTitle}
        noAnimation={true}
        onBack={() => {
          setIsWorkImageModalOpen(false);
          setIsWorkModalOpen(true);
        }}
      />

      {/* Select Art Form Modal */}
      <SelectArtForm
        isOpen={isArtFormModalOpen}
        onClose={() => setIsArtFormModalOpen(false)}
        onSelect={(id, label) => setSelectedArtField({ id, label })}
        selectedSubcategory={selectedArtField?.id || null}
      />

      {/* Add Block Modal */}
      <AddBlock
        isOpen={isBlockModalOpen}
        onClose={handleBlockModalClose}
        onTitleClick={handleTitleClick}
        onParagraphClick={handleParagraphClick}
        onImageClick={handleImageClick}
        onLinkClick={handleLinkClick}
        noAnimation={blockModalNoAnimation}
      />

      {/* Add Title Modal */}
      <AddTitle
        isOpen={isTitleModalOpen}
        onClose={() => setIsTitleModalOpen(false)}
        onBack={handleTitleBack}
        onAdd={addTitleBlock}
      />

      {/* Add Paragraph Modal */}
      <AddParagraph
        isOpen={isParagraphModalOpen}
        onClose={() => setIsParagraphModalOpen(false)}
        onBack={handleParagraphBack}
        onAdd={addParagraphBlock}
      />

      {/* Add Image Modal */}
      <AddProjectCover
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onImageSelect={(imageUrl) => {
          addImageBlock(imageUrl);
          setIsImageModalOpen(false);
        }}
        onImageRemove={() => {
          if (currentImageBlockId) {
            deleteContentBlock(currentImageBlockId);
          }
        }}
        currentImage={
          currentImageBlockId
            ? contentBlocks.find(
                (block) => block.type === 'image' && block.data.id === currentImageBlockId
              )?.type === 'image'
              ? (contentBlocks.find(
                  (block) => block.type === 'image' && block.data.id === currentImageBlockId
                ) as { type: 'image'; data: ImageBlock })?.data.imageUrl
              : null
            : null
        }
        customTitle={newProjectTexts.addImageModalTitle}
        noAnimation={true}
        onBack={handleImageBack}
      />

      {/* Add Link Modal */}
      <AddLink
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onBack={handleLinkBack}
        onAdd={addLinkBlock}
      />

      {/* Add Image Gallery Modal */}
      <AddImageGallery
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        onImagesSelect={(images) => {
          setGalleryImages(images);
          setIsGalleryModalOpen(false);
        }}
        onImagesUpdate={(images) => {
          setGalleryImages(images);
        }}
        currentImages={galleryImages}
        noAnimation={true}
        onBack={() => {
          setIsGalleryModalOpen(false);
          setIsWorkModalOpen(true);
        }}
      />

      {/* Add Work Link Modal */}
      <AddLink
        isOpen={isWorkLinkModalOpen}
        onClose={() => setIsWorkLinkModalOpen(false)}
        onBack={handleWorkLinkBack}
        onAdd={handleAddWorkLink}
      />
      </form>
    </div>
  );
}
