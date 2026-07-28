"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { newProjectTexts, artCategories } from "../../../../data/newProjectData";
import { getVideoInfo } from "../../../../utils/videoUtils";
import { useProfileView } from "../../ProfileViewContext";
import { projectsAPI, type ArtUaInfoContentBlock, type ArtUaInfoParameterAnswer } from "../../../../lib/api/projects";
import { getApiErrorMessage, getApiFieldErrors } from "../../../../lib/apiError";
import { catalogsAPI, type Parameter } from "../../../../lib/api/catalogs";
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
import SpecificationsSection, { type ParameterAnswers } from "./SpecificationsSection";
import SoldProject from "./SoldProject";
import PublicationPreviewSection from "./PublicationPreviewSection";
import ProjectPublication from "./ProjectPublication";
import type { ProjectWorkMediaItem } from "./projectWorkMedia";

function findArtCategoryIdForSubcategory(subcategoryId: string | undefined): string | undefined {
  if (!subcategoryId) return undefined;
  return artCategories.find((category) =>
    category.subcategories.some((subcategory) => subcategory.id === subcategoryId)
  )?.id;
}

// Бекенд-ключі полів (з 422-відповіді POST /v1/art-ua-info/projects), згруповані по
// вкладці візарда, в якій відповідне поле розташоване — потрібно, щоб після невдалої
// публікації перемкнутись на першу вкладку з помилкою і підсвітити конкретне поле.
const TAB_FIELD_KEYS: Partial<Record<NewProjectTab, string[]>> = {
  owner: ["user_type"],
  name: ["title", "title.uk", "title.en", "art_category"],
  media: ["content_blocks"],
  characteristics: ["parameters"],
};

export default function ProjectCreating() {
  const tabOrder: NewProjectTab[] = [
    "owner",
    "name",
    "media",
    "description",
    "characteristics",
    "additional",
    "publication",
  ];
  const { aboutMe } = useProfileView();
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  const [hoveredOwner, setHoveredOwner] = useState<string | null>(null);
  const [ownerError, setOwnerError] = useState(false);
  const [projectNameUa, setProjectNameUa] = useState("");
  const [projectNameEn, setProjectNameEn] = useState("");
  const [descriptionUa, setDescriptionUa] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [tagsUa, setTagsUa] = useState("");
  const [tagsEn, setTagsEn] = useState("");
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [projectCover, setProjectCover] = useState<string | null>(null);
  const [workGalleryItems, setWorkGalleryItems] = useState<ProjectWorkMediaItem[]>([]);
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [isWorkLinkModalOpen, setIsWorkLinkModalOpen] = useState(false);
  const [isWorkImageModalOpen, setIsWorkImageModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isArtFormModalOpen, setIsArtFormModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NewProjectTab>("owner");
  const [unlockedTabs, setUnlockedTabs] = useState<NewProjectTab[]>(["owner"]);
  const [selectedArtField, setSelectedArtField] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [parameterCatalog, setParameterCatalog] = useState<Parameter[]>([]);
  const [isLoadingParameters, setIsLoadingParameters] = useState(false);
  const [parameterAnswers, setParameterAnswers] = useState<ParameterAnswers>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const clearFieldErrors = (keys: string[]) => {
    setFieldErrors((prev) => {
      if (!keys.some((key) => key in prev)) return prev;
      const next = { ...prev };
      keys.forEach((key) => delete next[key]);
      return next;
    });
  };

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
      workGalleryItems,
      parameterAnswers,
    };
    try {
      localStorage.setItem('projectData', JSON.stringify(projectData));
    } catch {
      // Обкладинка/робота зберігаються як base64 і можуть перевищити квоту localStorage
      // (~5-10MB) — у такому разі зберігаємо чернетку без важких медіа-полів, аби текстові
      // поля не губились при перезавантаженні сторінки.
      try {
        localStorage.setItem(
          'projectData',
          JSON.stringify({ ...projectData, projectCover: null, workGalleryItems: [] })
        );
      } catch {
        // Квота вичерпана навіть без медіа — пропускаємо збереження цього знімку.
      }
    }
  }, [selectedOwner, projectNameUa, projectNameEn, descriptionUa, descriptionEn, tagsUa, tagsEn, selectedArtField, projectCover, workGalleryItems, parameterAnswers]);

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
        setWorkGalleryItems([]);
        setParameterAnswers({});
        clearInterval(checkIfCleared);
      }
    }, 500);
    
    return () => clearInterval(checkIfCleared);
  }, []);

  const handleProjectNameUaChange = (value: string) => {
    clearFieldErrors(["title", "title.uk"]);
    setProjectNameUa(value);
  };

  const handleProjectNameEnChange = (value: string) => {
    clearFieldErrors(["title.en"]);
    setProjectNameEn(value);
  };

  const handleSelectArtField = (id: string, label: string) => {
    clearFieldErrors(["art_category"]);
    setSelectedArtField({ id, label });
  };

  const artCategorySlug = findArtCategoryIdForSubcategory(selectedArtField?.id);

  // Каталог характеристик залежить від обраної галузі мистецтва (як на save-art) —
  // перезавантажуємо його щоразу, коли змінюється категорія/підкатегорія.
  useEffect(() => {
    if (!artCategorySlug) {
      setParameterCatalog([]);
      return;
    }
    let cancelled = false;
    setIsLoadingParameters(true);
    catalogsAPI
      .parameters({ art_category: artCategorySlug, art_subcategory: selectedArtField?.id })
      .then((data) => {
        if (!cancelled) setParameterCatalog(data);
      })
      .catch(() => {
        if (!cancelled) setParameterCatalog([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingParameters(false);
      });
    return () => {
      cancelled = true;
    };
  }, [artCategorySlug, selectedArtField?.id]);

  const handleParameterSelectChange = (parameterId: number, valueId: number | null) => {
    clearFieldErrors(["parameters", `param_${parameterId}_value`]);
    setParameterAnswers((prev) => ({
      ...prev,
      [parameterId]: { valueId, value: prev[parameterId]?.value ?? { uk: "", en: "" } },
    }));
  };

  const handleParameterCustomChange = (parameterId: number, field: "uk" | "en", value: string) => {
    clearFieldErrors(["parameters", `param_${parameterId}_${field}`]);
    setParameterAnswers((prev) => ({
      ...prev,
      [parameterId]: {
        valueId: prev[parameterId]?.valueId ?? null,
        value: { ...(prev[parameterId]?.value ?? { uk: "", en: "" }), [field]: value },
      },
    }));
  };

  const updateWorkGalleryItems = (
    items: ProjectWorkMediaItem[] | ((prev: ProjectWorkMediaItem[]) => ProjectWorkMediaItem[])
  ) => {
    clearFieldErrors(["content_blocks"]);
    setWorkGalleryItems(items);
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

  const handleAddWorkVideo = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed || !getVideoInfo(trimmed)) return;
    updateWorkGalleryItems((prev) =>
      prev.length >= 10 ? prev : [...prev, { kind: "video", url: trimmed }]
    );
    setIsGalleryModalOpen(true);
  };

  const getParameterErrors = (): Record<string, string[]> => {
    const errors: Record<string, string[]> = {};
    parameterCatalog.forEach((param) => {
      const answer = parameterAnswers[param.id];
      if (param.type === "list") {
        if (answer?.valueId == null) {
          errors[`param_${param.id}_value`] = ["Оберіть значення."];
        }
      } else {
        if (!answer?.value.uk?.trim()) {
          errors[`param_${param.id}_uk`] = ["Заповніть характеристику українською."];
        }
        if (!answer?.value.en?.trim()) {
          errors[`param_${param.id}_en`] = ["Заповніть характеристику англійською."];
        }
      }
    });
    return errors;
  };

  const buildParametersPayload = (): ArtUaInfoParameterAnswer[] =>
    parameterCatalog.map((param) => {
      const answer = parameterAnswers[param.id];
      return param.type === "list"
        ? { parameter_id: param.id, parameter_value_id: answer?.valueId ?? null }
        : {
            parameter_id: param.id,
            custom_value: { uk: answer?.value.uk || undefined, en: answer?.value.en || undefined },
          };
    });

  const handleNextTab = () => {
    if (activeTab === "owner" && !selectedOwner) {
      setOwnerError(true);
      return;
    }

    if (activeTab === "name") {
      const errors: Record<string, string[]> = {};
      if (!projectNameUa.trim()) errors["title.uk"] = ["Введіть назву проєкту українською."];
      if (!projectNameEn.trim()) errors["title.en"] = ["Введіть назву проєкту англійською."];
      if (!selectedArtField) errors.art_category = ["Оберіть галузь мистецтва."];
      if (Object.keys(errors).length > 0) {
        setFieldErrors((prev) => ({ ...prev, ...errors }));
        return;
      }
    }

    if (activeTab === "media" && workGalleryItems.length === 0) {
      setFieldErrors((prev) => ({ ...prev, content_blocks: ["Додайте роботу."] }));
      return;
    }

    if (activeTab === "characteristics") {
      const errors = getParameterErrors();
      if (Object.keys(errors).length > 0) {
        setFieldErrors((prev) => ({ ...prev, ...errors }));
        return;
      }
    }

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

  const handlePublish = async (): Promise<{ type: "success" | "error"; text: string }> => {
    const contentBlocks: ArtUaInfoContentBlock[] = workGalleryItems.map((item) =>
      item.kind === "image"
        ? { type: "image", image: item.src }
        : { type: "link", url: item.url }
    );

    try {
      await projectsAPI.createArtUaInfoProject({
        status: "moderation",
        user_type: selectedOwner === "legal-entity" ? "legal" : "personal",
        title: {
          uk: projectNameUa.trim(),
          en: projectNameEn.trim(),
        },
        art_category: findArtCategoryIdForSubcategory(selectedArtField?.id),
        art_subcategory: selectedArtField?.id,
        cover: projectCover || undefined,
        content_blocks: contentBlocks.length ? contentBlocks : undefined,
        parameters: parameterCatalog.length ? buildParametersPayload() : undefined,
        tags: {
          uk: tagsUa?.trim() || undefined,
          en: tagsEn?.trim() || undefined,
        },
      });

      localStorage.removeItem("projectData");
      setSelectedOwner(null);
      setProjectNameUa("");
      setProjectNameEn("");
      setDescriptionUa("");
      setDescriptionEn("");
      setTagsUa("");
      setTagsEn("");
      setSelectedArtField(null);
      setProjectCover(null);
      setWorkGalleryItems([]);
      setParameterAnswers({});
      setFieldErrors({});

      return { type: "success", text: "Проект відправлено на модерацію" };
    } catch (error) {
      const errors = getApiFieldErrors(error);
      if (errors) {
        setFieldErrors(errors);
        const firstErrorTab = tabOrder.find((tab) =>
          (TAB_FIELD_KEYS[tab] ?? []).some((key) => key in errors)
        );
        if (firstErrorTab) {
          setUnlockedTabs((prev) =>
            prev.includes(firstErrorTab) ? prev : [...prev, firstErrorTab]
          );
          setActiveTab(firstErrorTab);
        }
      }

      return { type: "error", text: getApiErrorMessage(error, "Помилка при надісланні проекту") };
    }
  };

  const owners = [
    {
      id: "author",
      type: "author" as const,
      name: aboutMe.name,
      avatar: aboutMe.avatar,
    },
    ...(aboutMe.legalEntity
      ? [
          {
            id: "legal-entity",
            type: "team" as const,
            name: aboutMe.legalEntity.name,
            avatar: aboutMe.legalEntity.avatar,
          },
        ]
      : []),
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
          showError={(ownerError && !selectedOwner) || Boolean(fieldErrors.user_type)}
          errorMessage={fieldErrors.user_type?.[0]}
          onOwnerSelect={(ownerId) => {
            setOwnerError(false);
            clearFieldErrors(["user_type"]);
            setSelectedOwner(selectedOwner === ownerId ? null : ownerId);
          }}
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
          errorUa={fieldErrors["title.uk"]?.[0] || fieldErrors.title?.[0]}
          errorEn={fieldErrors["title.en"]?.[0]}
          artFieldError={fieldErrors.art_category?.[0]}
          onProjectNameUaChange={handleProjectNameUaChange}
          onProjectNameEnChange={handleProjectNameEnChange}
          onOpenArtFieldModal={() => setIsArtFormModalOpen(true)}
        />
      )}

      {activeTab === "media" && (
        <MediaSection
          projectCover={projectCover}
          workGalleryItems={workGalleryItems}
          tagsUa={tagsUa}
          tagsEn={tagsEn}
          addCoverText={newProjectTexts.addCoverText}
          addCoverOptional={newProjectTexts.addCoverOptional}
          workUploadText={newProjectTexts.workUploadText}
          tagsLabel={newProjectTexts.tagsLabel}
          tagsPlaceholder={newProjectTexts.tagsPlaceholder}
          tagsPlaceholderEn={newProjectTexts.tagsPlaceholderEn}
          tagsHint={newProjectTexts.tagsHint}
          workError={fieldErrors.content_blocks?.[0]}
          onOpenCoverModal={() => setIsCoverModalOpen(true)}
          onOpenGalleryModal={() => setIsGalleryModalOpen(true)}
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

      {activeTab === "characteristics" && (
        <SpecificationsSection
          artCategory={artCategorySlug}
          isLoadingCatalog={isLoadingParameters}
          catalog={parameterCatalog}
          answers={parameterAnswers}
          errors={Object.fromEntries(
            Object.entries(fieldErrors)
              .filter(([key]) => key.startsWith("param_"))
              .map(([key, messages]) => [key, messages[0]])
          )}
          onSelectChange={handleParameterSelectChange}
          onCustomChange={handleParameterCustomChange}
        />
      )}

      {activeTab === "additional" && <SoldProject />}
      {activeTab === "publication" && (
        <>
          <PublicationPreviewSection
            projectNameUa={projectNameUa}
            selectedArtFieldLabel={selectedArtField?.label || null}
            workGalleryItems={workGalleryItems}
            descriptionUa={descriptionUa}
            parameterCatalog={parameterCatalog}
            parameterAnswers={parameterAnswers}
          />
          <ProjectPublication onPublish={handlePublish} />
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
          updateWorkGalleryItems([{ kind: "image", src: imageUrl }]);
          setIsWorkImageModalOpen(false);
        }}
        onImageRemove={() => updateWorkGalleryItems([])}
        currentImage={
          workGalleryItems.length === 1 && workGalleryItems[0]?.kind === "image"
            ? workGalleryItems[0].src
            : null
        }
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
        onSelect={handleSelectArtField}
        selectedSubcategory={selectedArtField?.id || null}
      />

      {/* Add Image Gallery Modal */}
      <AddImageGallery
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        onItemsSelect={(items) => {
          updateWorkGalleryItems(items);
          setIsGalleryModalOpen(false);
        }}
        onItemsUpdate={(items) => updateWorkGalleryItems(items)}
        currentItems={workGalleryItems}
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
        onAdd={handleAddWorkVideo}
      />
      </div>
    </div>
  );
}
