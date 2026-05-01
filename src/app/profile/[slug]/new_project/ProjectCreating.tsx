"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { newProjectTexts } from "../../../../data/newProjectData";
import { useProfileView } from "../../ProfileViewContext";
import AddProjectCover from "./AddProjectCover";
import AddWork from "./AddWork";
import SelectArtForm from "./SelectArtForm";
import AddLink from "./AddLink";
import AddImageGallery from "./AddImageGallery";
import NewProjectMenu from "./NewProjectMenu";
import type { NewProjectTab } from "./NewProjectMenu";
import OwnerSelectionSection from "./OwnerSelectionSection";
import NameSection from "./NameSection";
import MediaSection from "./MediaSection";
import DescriptionSection from "./DescriptionSection";
import ParametersSection, {
  type ProjectParameterSelections,
} from "./ParametersSection";
import CharacteristicsSection from "./CharacteristicsSection";
import SoldProject from "./SoldProject";
import PublicationPreviewSection from "./PublicationPreviewSection";
import ProjectPublication from "./ProjectPublication";

interface Characteristic {
  id: string;
  name: string;
  description: string;
}

export default function ProjectCreating() {
  const tabOrder: NewProjectTab[] = [
    "owner",
    "name",
    "media",
    "description",
    "parameters",
    "characteristics",
    "additional",
    "publication",
  ];
  const { aboutMe } = useProfileView();
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  const [hoveredOwner, setHoveredOwner] = useState<string | null>(null);
  const [projectNameUa, setProjectNameUa] = useState("");
  const [projectNameEn, setProjectNameEn] = useState("");
  const [descriptionUa, setDescriptionUa] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
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
  const [activeTab, setActiveTab] = useState<NewProjectTab>("owner");
  const [unlockedTabs, setUnlockedTabs] = useState<NewProjectTab[]>(["owner"]);
  const [selectedArtField, setSelectedArtField] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [parameterSelections, setParameterSelections] =
    useState<ProjectParameterSelections>({});

  // Save project data to localStorage whenever it changes
  useEffect(() => {
    const projectData = {
      selectedOwner,
      projectNameUa,
      projectNameEn,
      descriptionUa,
      descriptionEn,
      tagsUa,
      tagsEn,
      selectedArtField,
      projectCover,
      workImage,
      workVideoUrl,
      galleryImages,
      characteristics,
      parameterSelections,
    };
    localStorage.setItem('projectData', JSON.stringify(projectData));
  }, [selectedOwner, projectNameUa, projectNameEn, descriptionUa, descriptionEn, tagsUa, tagsEn, selectedArtField, projectCover, workImage, workVideoUrl, galleryImages, characteristics, parameterSelections]);

  // Check if projectData was deleted from localStorage (after successful submit) and clear form
  useEffect(() => {
    const checkIfCleared = setInterval(() => {
      const projectData = localStorage.getItem('projectData');
      if (!projectData) {
        // Clear all form fields
        setSelectedOwner(null);
        setProjectNameUa("");
        setProjectNameEn("");
        setDescriptionUa("");
        setDescriptionEn("");
        setTagsUa("");
        setTagsEn("");
        setSelectedArtField(null);
        setProjectCover(null);
        setWorkImage(null);
        setWorkVideoUrl(null);
        setGalleryImages([]);
        setCharacteristics([{ id: "1", name: "", description: "" }]);
        setParameterSelections({});
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

  const handleNextTab = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      const nextTab = tabOrder[currentIndex + 1];
      setUnlockedTabs((prev) => (prev.includes(nextTab) ? prev : [...prev, nextTab]));
      setActiveTab(nextTab);
    }
  };

  const handleTabChange = (tab: NewProjectTab) => {
    if (unlockedTabs.includes(tab)) {
      setActiveTab(tab);
    }
  };

  const owners = [
    {
      id: "author",
      type: "author" as const,
      name: aboutMe.name,
      avatar: aboutMe.avatar,
    },
    {
      id: "legal-entity",
      type: "team" as const,
      name: "Юридична особа",
      avatar: "/legals/legals-photo-1.jpg",
    },
    ...aboutMe.teams.map((team, index) => ({
      id: `team-${index}`,
      type: "team" as const,
      name: team.name,
      avatar: team.icon,
    })),
  ];

  return (
    <div
      className={`flex flex-col items-center gap-8 ${
        activeTab === "publication" ? "px-0 overflow-x-hidden" : "px-4 md:px-10 lg:px-[75px]"
      } bg-[#414141] ${
        activeTab === "publication" ? "pt-10 pb-0" : "py-10"
      } ${
        activeTab === "additional" ||
        activeTab === "name" ||
        activeTab === "owner" ||
        activeTab === "parameters" ||
        activeTab === "publication"
          ? ""
          : "min-h-screen"
      }`}
    >
      <div className="flex flex-col items-center gap-8 w-full min-w-0">
      {/* Title */}
      <h1 className="text-[#A0A0A0] text-[32px] md:text-[40px] font-bold text-center">
        {newProjectTexts.title}
      </h1>

      <NewProjectMenu
        activeTab={activeTab}
        unlockedTabs={unlockedTabs}
        onTabChange={handleTabChange}
      />

      {activeTab === "publication" && (
        <div className="w-full flex flex-col items-center gap-6">
          <div className="w-full max-w-[1440px] flex justify-center">
            <p className="font-wix text-white text-[18px] font-semibold text-center">
              Так буде виглядати ваш проект
            </p>
          </div>
          <div className="w-full max-w-none self-stretch h-[2px] bg-[#343434]" />
        </div>
      )}

      {activeTab === "owner" && (
        <OwnerSelectionSection
          owners={owners}
          selectedOwner={selectedOwner}
          hoveredOwner={hoveredOwner}
          onOwnerSelect={(ownerId) =>
            setSelectedOwner(selectedOwner === ownerId ? null : ownerId)
          }
          onOwnerHover={setHoveredOwner}
        />
      )}

      {activeTab === "name" && (
        <NameSection
          projectNameLabel={newProjectTexts.projectNameLabel}
          projectNamePlaceholder={newProjectTexts.projectNamePlaceholder}
          projectNamePlaceholderEn={newProjectTexts.projectNamePlaceholderEn}
          artFieldButton={newProjectTexts.artFieldButton}
          projectNameUa={projectNameUa}
          projectNameEn={projectNameEn}
          selectedArtField={selectedArtField}
          onProjectNameUaChange={setProjectNameUa}
          onProjectNameEnChange={setProjectNameEn}
          onOpenArtFieldModal={() => setIsArtFormModalOpen(true)}
        />
      )}

      {activeTab === "media" && (
        <MediaSection
          projectCover={projectCover}
          galleryImages={galleryImages}
          workVideoUrl={workVideoUrl}
          workImage={workImage}
          tagsUa={tagsUa}
          tagsEn={tagsEn}
          addCoverText={newProjectTexts.addCoverText}
          addCoverOptional={newProjectTexts.addCoverOptional}
          workUploadText={newProjectTexts.workUploadText}
          tagsLabel={newProjectTexts.tagsLabel}
          tagsPlaceholder={newProjectTexts.tagsPlaceholder}
          tagsPlaceholderEn={newProjectTexts.tagsPlaceholderEn}
          tagsHint={newProjectTexts.tagsHint}
          onOpenCoverModal={() => setIsCoverModalOpen(true)}
          onOpenGalleryModal={() => setIsGalleryModalOpen(true)}
          onClearWorkVideo={() => setWorkVideoUrl(null)}
          onOpenWorkImageModal={() => setIsWorkImageModalOpen(true)}
          onOpenWorkModal={() => setIsWorkModalOpen(true)}
          onTagsUaChange={setTagsUa}
          onTagsEnChange={setTagsEn}
        />
      )}

      {activeTab === "description" && (
        <DescriptionSection
          descriptionUa={descriptionUa}
          descriptionEn={descriptionEn}
          onDescriptionUaChange={setDescriptionUa}
          onDescriptionEnChange={setDescriptionEn}
        />
      )}

      {activeTab === "parameters" && (
        <ParametersSection
          selections={parameterSelections}
          onSelectionChange={(categoryId, optionId) =>
            setParameterSelections((prev) => ({
              ...prev,
              [categoryId]: optionId,
            }))
          }
        />
      )}

      {activeTab === "characteristics" && (
        <CharacteristicsSection
          description={newProjectTexts.characteristicsDescription}
          characteristicNameLabel={newProjectTexts.characteristicNameLabel}
          characteristicDescLabel={newProjectTexts.characteristicDescLabel}
          characteristicNamePlaceholder={newProjectTexts.characteristicNamePlaceholder}
          characteristicNamePlaceholderEn={newProjectTexts.characteristicNamePlaceholderEn}
          characteristicDescPlaceholder={newProjectTexts.characteristicDescPlaceholder}
          characteristicDescPlaceholderEn={newProjectTexts.characteristicDescPlaceholderEn}
          characteristics={characteristics}
          onUpdateCharacteristic={updateCharacteristic}
          onMoveCharacteristic={moveCharacteristic}
          onDeleteCharacteristic={deleteCharacteristic}
          onAddCharacteristic={addCharacteristic}
        />
      )}

      {activeTab === "additional" && <SoldProject />}
      {activeTab === "publication" && (
        <>
          <PublicationPreviewSection
            projectNameUa={projectNameUa}
            selectedArtFieldLabel={selectedArtField?.label || null}
            workImage={workImage}
            workVideoUrl={workVideoUrl}
            galleryImages={galleryImages}
            descriptionUa={descriptionUa}
            characteristics={characteristics}
          />
          <ProjectPublication />
        </>
      )}

      {activeTab !== "publication" && (
        <div className="w-full max-w-[1000px] flex justify-center">
          <button
            type="button"
            onClick={handleNextTab}
            className="group flex items-stretch h-[60px] bg-white hover:bg-[#FECC39] transition-colors rounded-none overflow-hidden w-full md:w-[320px]"
          >
            <span className="flex items-center justify-center flex-1 px-4 sm:px-6 font-button font-bold text-[#343434] text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)] whitespace-nowrap">
              Далі
            </span>
            <div className="flex items-center justify-center w-[60px] border-l border-[#343434]">
              <Image src="/grey_triangle_right.svg" alt="Далі" width={24} height={24} />
            </div>
          </button>
        </div>
      )}


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
      </div>
    </div>
  );
}
