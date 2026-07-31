"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { newProjectTexts, artCategories } from "../../../../data/newProjectData";
import { getVideoInfo } from "../../../../utils/videoUtils";
import { useProfileView } from "../../ProfileViewContext";
import {
  projectsAPI,
  toApiRelativePath,
  type ArtUaInfoContentBlock,
  type ArtUaInfoFinalResultItem,
  type ArtUaInfoParameterAnswer,
  type MyProjectContentBlock,
} from "../../../../lib/api/projects";
import { getApiErrorMessage, getApiFieldErrors } from "../../../../lib/apiError";
import { withProfileId } from "../../../../lib/authorQuery";
import { catalogsAPI, type Parameter } from "../../../../lib/api/catalogs";
import type { ProjectWorkMediaItem } from "./projectWorkMedia";
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
import ContentBlocksSection from "./ContentBlocksSection";
import type { AdditionalContentBlock } from "./additionalContentBlock";
import PublicationPreviewSection from "./PublicationPreviewSection";
import ProjectPublication from "./ProjectPublication";

function findArtCategoryIdForSubcategory(subcategoryId: string | undefined): string | undefined {
  if (!subcategoryId) return undefined;
  return artCategories.find((category) =>
    category.subcategories.some((subcategory) => subcategory.id === subcategoryId)
  )?.id;
}

function findSubcategoryLabel(subcategoryId: string | null | undefined): string | undefined {
  if (!subcategoryId) return undefined;
  for (const category of artCategories) {
    const subcategory = category.subcategories.find((item) => item.id === subcategoryId);
    if (subcategory) return subcategory.label;
  }
  return undefined;
}

// final_result з бекенду (image/link) -> елементи галереї роботи візарда.
function finalResultToGalleryItems(
  items: { type: string; image?: string | null; url?: string | null }[]
): ProjectWorkMediaItem[] {
  const gallery: ProjectWorkMediaItem[] = [];
  for (const item of items) {
    if (item.type === "image" && item.image) {
      gallery.push({ kind: "image", src: item.image });
    } else if (item.type === "link" && item.url) {
      gallery.push({ kind: "video", url: item.url });
    }
  }
  return gallery;
}

// content_blocks з бекенду (заголовок/текст/зображення/посилання) -> блоки редактора
// додаткової інформації.
function contentBlocksToAdditionalBlocks(
  blocks: MyProjectContentBlock[]
): AdditionalContentBlock[] {
  const result: AdditionalContentBlock[] = [];
  blocks.forEach((block, index) => {
    if (block.type === "heading") {
      result.push({
        id: index,
        type: "heading",
        headingUk: block.heading_text?.uk ?? "",
        headingEn: block.heading_text?.en ?? "",
      });
    } else if (block.type === "paragraph") {
      result.push({
        id: index,
        type: "paragraph",
        paragraphUk: block.paragraph_text?.uk ?? "",
        paragraphEn: block.paragraph_text?.en ?? "",
      });
    } else if (block.type === "image" && block.image) {
      result.push({ id: index, type: "image", image: block.image });
    } else if (block.type === "link" && block.url) {
      result.push({ id: index, type: "link", url: block.url });
    }
  });
  return result;
}

// Бекенд-ключі полів (з 422-відповіді POST /v1/art-ua-info/projects), згруповані по
// вкладці візарда, в якій відповідне поле розташоване — потрібно, щоб після невдалої
// публікації перемкнутись на першу вкладку з помилкою і підсвітити конкретне поле.
const TAB_FIELD_KEYS: Partial<Record<NewProjectTab, string[]>> = {
  owner: ["user_type"],
  name: ["title", "title.uk", "title.en", "art_category"],
  media: ["final_result"],
  description: ["short_description", "short_description.uk", "short_description.en"],
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
  const { aboutMe, slug: profileSlug } = useProfileView();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("edit");
  const tabParam = searchParams.get("tab") as NewProjectTab | null;
  const initialTab: NewProjectTab =
    tabParam && tabOrder.includes(tabParam) ? tabParam : "owner";
  const [isLoadingEditData, setIsLoadingEditData] = useState(Boolean(editSlug));
  const [editLoadError, setEditLoadError] = useState<string | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  const [hoveredOwner, setHoveredOwner] = useState<string | null>(null);
  const [ownerError, setOwnerError] = useState(false);
  const [projectNameUa, setProjectNameUa] = useState("");
  const [projectNameEn, setProjectNameEn] = useState("");
  const [descriptionUa, setDescriptionUa] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [tagsUa, setTagsUa] = useState<string[]>([]);
  const [tagsEn, setTagsEn] = useState<string[]>([]);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [projectCover, setProjectCover] = useState<string | null>(null);
  const [workGalleryItems, setWorkGalleryItems] = useState<ProjectWorkMediaItem[]>([]);
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [isWorkLinkModalOpen, setIsWorkLinkModalOpen] = useState(false);
  const [isWorkImageModalOpen, setIsWorkImageModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isArtFormModalOpen, setIsArtFormModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NewProjectTab>(initialTab);
  const [unlockedTabs, setUnlockedTabs] = useState<NewProjectTab[]>(["owner"]);
  const [selectedArtField, setSelectedArtField] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [parameterCatalog, setParameterCatalog] = useState<Parameter[]>([]);
  const [isLoadingParameters, setIsLoadingParameters] = useState(false);
  const [parameterAnswers, setParameterAnswers] = useState<ParameterAnswers>({});
  const [additionalBlocks, setAdditionalBlocks] = useState<AdditionalContentBlock[]>([]);
  const [isSoldExternally, setIsSoldExternally] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [likesCount, setLikesCount] = useState(0);
  const [projectStatus, setProjectStatus] = useState<string | null>(null);
  const [projectStatusLabel, setProjectStatusLabel] = useState<string | null>(null);

  const clearFieldErrors = (keys: string[]) => {
    setFieldErrors((prev) => {
      if (!keys.some((key) => key in prev)) return prev;
      const next = { ...prev };
      keys.forEach((key) => delete next[key]);
      return next;
    });
  };

  // Режим редагування (?edit=slug): підтягуємо дані вже опублікованого проєкту
  // і заповнюємо ними форму замість порожнього створення.
  useEffect(() => {
    if (!editSlug) return;
    let cancelled = false;

    projectsAPI
      .myShow(editSlug)
      .then((project) => {
        if (cancelled) return;
        if (project.authorType === "legal") {
          setSelectedOwner("legal-entity");
        } else if (project.authorType === "team") {
          const teamIndex = aboutMe.teams.findIndex((team) => team.slug === project.authorSlug);
          setSelectedOwner(teamIndex >= 0 ? `team-${teamIndex}` : "author");
        } else {
          setSelectedOwner("author");
        }
        setProjectNameUa(project.title.uk ?? "");
        setProjectNameEn(project.title.en ?? "");
        setDescriptionUa(project.shortDescription.uk ?? "");
        setDescriptionEn(project.shortDescription.en ?? "");
        setTagsUa(project.tags.uk ?? []);
        setTagsEn(project.tags.en ?? []);
        setProjectCover(project.coverUrl);
        setWorkGalleryItems(finalResultToGalleryItems(project.finalResult));
        setAdditionalBlocks(contentBlocksToAdditionalBlocks(project.contentBlocks));
        setIsSoldExternally(project.soldExternally);
        setLikesCount(project.likesCount);
        setProjectStatus(project.status);
        setProjectStatusLabel(project.statusLabel);
        if (project.artSubcategory) {
          const label = findSubcategoryLabel(project.artSubcategory);
          if (label) setSelectedArtField({ id: project.artSubcategory, label });
        }
        setParameterAnswers(
          project.parameters.reduce<ParameterAnswers>((acc, param) => {
            acc[param.parameter_id] = {
              valueId: param.value_id,
              value: { uk: param.value?.uk ?? "", en: param.value?.en ?? "" },
            };
            return acc;
          }, {})
        );
        setUnlockedTabs(tabOrder);
      })
      .catch(() => {
        if (!cancelled) setEditLoadError("Не вдалося завантажити проєкт для редагування.");
      })
      .finally(() => {
        if (!cancelled) setIsLoadingEditData(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editSlug]);

  // Save project data to localStorage whenever it changes
  useEffect(() => {
    if (editSlug) return;
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
      additionalBlocks,
      isSoldExternally,
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
          JSON.stringify({ ...projectData, projectCover: null, workGalleryItems: [], additionalBlocks: [] })
        );
      } catch {
        // Квота вичерпана навіть без медіа — пропускаємо збереження цього знімку.
      }
    }
  }, [editSlug, selectedOwner, projectNameUa, projectNameEn, descriptionUa, descriptionEn, tagsUa, tagsEn, selectedArtField, projectCover, workGalleryItems, additionalBlocks, isSoldExternally, parameterAnswers]);

  // Check if projectData was deleted from localStorage (after successful submit) and clear form
  useEffect(() => {
    if (editSlug) return;
    const checkIfCleared = setInterval(() => {
      const projectData = localStorage.getItem('projectData');
      if (!projectData) {
        // Clear all form fields
        setSelectedOwner(null);
        setProjectNameUa("");
        setProjectNameEn("");
        setDescriptionUa("");
        setDescriptionEn("");
        setTagsUa([]);
        setTagsEn([]);
        setSelectedArtField(null);
        setProjectCover(null);
        setWorkGalleryItems([]);
        setAdditionalBlocks([]);
        setIsSoldExternally(false);
        setParameterAnswers({});
        clearInterval(checkIfCleared);
      }
    }, 500);
    
    return () => clearInterval(checkIfCleared);
  }, [editSlug]);

  const handleProjectNameUaChange = (value: string) => {
    clearFieldErrors(["title", "title.uk"]);
    setProjectNameUa(value);
  };

  const handleProjectNameEnChange = (value: string) => {
    clearFieldErrors(["title.en"]);
    setProjectNameEn(value);
  };

  const handleDescriptionUaChange = (value: string) => {
    clearFieldErrors(["short_description", "short_description.uk"]);
    setDescriptionUa(value);
  };

  const handleDescriptionEnChange = (value: string) => {
    clearFieldErrors(["short_description", "short_description.en"]);
    setDescriptionEn(value);
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
    clearFieldErrors(["final_result"]);
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
      setFieldErrors((prev) => ({ ...prev, final_result: ["Додайте роботу."] }));
      return;
    }

    if (activeTab === "description") {
      const errors: Record<string, string[]> = {};
      if (!descriptionUa.trim()) {
        errors["short_description.uk"] = ["Введіть опис проєкту українською."];
      }
      if (!descriptionEn.trim()) {
        errors["short_description.en"] = ["Введіть опис проєкту англійською."];
      }
      if (Object.keys(errors).length > 0) {
        setFieldErrors((prev) => ({ ...prev, ...errors }));
        return;
      }
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
      goToTab(nextTab);
    }
  };

  // Синхронізує активну вкладку з ?tab= в URL (як save-art ?tab=description/publication),
  // щоб посилання на конкретну вкладку можна було відкрити напряму або поділитись ним.
  const goToTab = (tab: NewProjectTab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleTabChange = (tab: NewProjectTab) => {
    if (unlockedTabs.includes(tab)) {
      goToTab(tab);
    }
  };

  // toApiRelativePath: якщо це вже завантажене (не base64) зображення з бекенду,
  // повертаємо відносний шлях назад — інакше бекенд збереже абсолютний URL "як є"
  // і задвоїть домен при наступному завантаженні цього ж проєкту.
  const buildCommonPayload = () => {
    const finalResult: ArtUaInfoFinalResultItem[] = workGalleryItems.map((item) =>
      item.kind === "image"
        ? { type: "image", image: toApiRelativePath(item.src) }
        : { type: "link", url: item.url }
    );

    const contentBlocks: ArtUaInfoContentBlock[] = additionalBlocks.map((block) => {
      if (block.type === "heading") {
        return {
          type: "heading",
          heading_level: "h2",
          heading_text: { uk: block.headingUk, en: block.headingEn || undefined },
        };
      }
      if (block.type === "paragraph") {
        return {
          type: "paragraph",
          paragraph_text: { uk: block.paragraphUk, en: block.paragraphEn || undefined },
        };
      }
      if (block.type === "image") {
        return { type: "image", image: toApiRelativePath(block.image) };
      }
      return { type: "link", url: block.url };
    });

    const selectedTeamIndex = selectedOwner?.startsWith("team-")
      ? Number(selectedOwner.slice("team-".length))
      : -1;
    const selectedTeam = aboutMe.teams[selectedTeamIndex];

    return {
      user_type: (selectedOwner === "legal-entity"
        ? "legal"
        : selectedTeam
          ? "team"
          : "personal") as "legal" | "personal" | "team",
      team_id: selectedTeam?.id,
      title: {
        uk: projectNameUa.trim(),
        en: projectNameEn.trim(),
      },
      short_description: {
        uk: descriptionUa.trim() || undefined,
        en: descriptionEn.trim() || undefined,
      },
      art_category: findArtCategoryIdForSubcategory(selectedArtField?.id),
      art_subcategory: selectedArtField?.id,
      cover: toApiRelativePath(projectCover || undefined),
      final_result: finalResult.length ? finalResult : undefined,
      content_blocks: contentBlocks.length ? contentBlocks : undefined,
      parameters: parameterCatalog.length ? buildParametersPayload() : undefined,
      tags: {
        uk: tagsUa.length ? tagsUa : undefined,
        en: tagsEn.length ? tagsEn : undefined,
      },
      sold_externally: isSoldExternally,
    };
  };

  const resetFormState = () => {
    localStorage.removeItem("projectData");
    setSelectedOwner(null);
    setProjectNameUa("");
    setProjectNameEn("");
    setDescriptionUa("");
    setDescriptionEn("");
    setTagsUa([]);
    setTagsEn([]);
    setSelectedArtField(null);
    setProjectCover(null);
    setWorkGalleryItems([]);
    setAdditionalBlocks([]);
    setIsSoldExternally(false);
    setParameterAnswers({});
    setFieldErrors({});
  };

  const handlePublish = async (): Promise<{ type: "success" | "error"; text: string }> => {
    const commonPayload = buildCommonPayload();

    try {
      if (editSlug) {
        // Якщо проєкт зараз чернетка (напр. щойно знятий з публікації) — публікація
        // так само проводить його через status "moderation" (=> Completed на бекенді),
        // як і при першому створенні. Для вже опублікованого проєкту status
        // не передаємо, щоб не чіпати completed/announced зайвий раз.
        const isDraft = projectStatus === "draft" || projectStatus === "new";
        const updated = await projectsAPI.updateArtUaInfoProject(
          editSlug,
          isDraft ? { ...commonPayload, status: "moderation" } : commonPayload
        );
        router.push(`/projects/${updated.slug}`);
        return { type: "success", text: "Проект оновлено" };
      }

      await projectsAPI.createArtUaInfoProject({ ...commonPayload, status: "moderation" });
      resetFormState();

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

  // Зберегти чернетку: для нового проєкту — POST зі status "draft". Для вже
  // збереженого (editSlug) — PUT зі status "draft", що знімає опублікований
  // проєкт з публічної сторінки й повертає його в чернетку (бекенд дозволяє
  // через цей ендпоінт лише цей один статус-перехід).
  const handleSaveDraft = async (): Promise<{ type: "success" | "error"; text: string }> => {
    const commonPayload = buildCommonPayload();
    const wasPublished = projectStatus !== null && projectStatus !== "draft" && projectStatus !== "new";

    try {
      if (editSlug) {
        await projectsAPI.updateArtUaInfoProject(editSlug, { ...commonPayload, status: "draft" });
        setProjectStatus("draft");
        setProjectStatusLabel("Чернетка");
        return {
          type: "success",
          text: wasPublished ? "Проєкт знято з публікації та збережено як чернетку" : "Чернетку збережено",
        };
      }

      await projectsAPI.createArtUaInfoProject({ ...commonPayload, status: "draft" });
      resetFormState();

      return { type: "success", text: "Чернетку збережено" };
    } catch (error) {
      const errors = getApiFieldErrors(error);
      if (errors) setFieldErrors(errors);
      return { type: "error", text: getApiErrorMessage(error, "Не вдалося зберегти чернетку") };
    }
  };

  // Видалення проєкту: якщо проєкт ще не збережений на сервері (немає editSlug) —
  // просто очищаємо локальну форму, інакше видаляємо через спільний ендпоінт
  // DELETE /v1/my/projects/{slug} (той самий Project, що й у save-art).
  const handleDelete = async (): Promise<{ type: "success" | "error"; text: string }> => {
    if (!editSlug) {
      resetFormState();
      return { type: "success", text: "Форму очищено" };
    }

    try {
      await projectsAPI.myDelete(editSlug);
      router.push(withProfileId("/profile/projects", profileSlug));
      return { type: "success", text: "Проєкт видалено" };
    } catch (error) {
      return { type: "error", text: getApiErrorMessage(error, "Не вдалося видалити проєкт") };
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

  if (isLoadingEditData) {
    return <div className="min-h-screen bg-[#414141]" />;
  }

  if (editLoadError) {
    return (
      <div className="min-h-screen bg-[#414141] flex items-center justify-center">
        <p className="text-white">{editLoadError}</p>
      </div>
    );
  }

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
        {editSlug ? "Редагування проєкту" : newProjectTexts.title}
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
          workError={fieldErrors.final_result?.[0]}
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
          onDescriptionUaChange={handleDescriptionUaChange}
          onDescriptionEnChange={handleDescriptionEnChange}
          errorUa={fieldErrors["short_description.uk"]?.[0] || fieldErrors.short_description?.[0]}
          errorEn={fieldErrors["short_description.en"]?.[0]}
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

      {activeTab === "additional" && (
        <div className="w-full flex flex-col items-center gap-8">
          <ContentBlocksSection blocks={additionalBlocks} onBlocksChange={setAdditionalBlocks} />
          <SoldProject isSold={isSoldExternally} onToggle={setIsSoldExternally} />
        </div>
      )}
      {activeTab === "publication" && (
        <>
          <PublicationPreviewSection
            projectNameUa={projectNameUa}
            selectedArtFieldLabel={selectedArtField?.label || null}
            workGalleryItems={workGalleryItems}
            descriptionUa={descriptionUa}
            parameterCatalog={parameterCatalog}
            parameterAnswers={parameterAnswers}
            additionalBlocks={additionalBlocks}
            likesCount={likesCount}
            statusLabel={projectStatusLabel || "Чернетка"}
          />
          <ProjectPublication
            onPublish={handlePublish}
            onSaveDraft={handleSaveDraft}
            onDelete={handleDelete}
          />
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
