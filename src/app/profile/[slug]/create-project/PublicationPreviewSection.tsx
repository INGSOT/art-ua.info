"use client";

import ProjectResultShowcase, {
  type ProjectResultContentBlock,
} from "../../../../components/project/ProjectResultShowcase";
import type { ProjectWorkMediaItem } from "./projectWorkMedia";
import type { AdditionalContentBlock } from "./additionalContentBlock";
import { useProfileView } from "../../ProfileViewContext";
import type { Parameter } from "../../../../lib/api/catalogs";
import type { ParameterAnswers } from "./SpecificationsSection";

function localize(value: string | { uk: string; en?: string } | null | undefined): string {
  if (value == null) return "";
  if (typeof value === "object") return value.uk ?? value.en ?? "";
  return value;
}

function workGalleryItemToSlide(item: ProjectWorkMediaItem): string {
  return item.kind === "image" ? item.src : item.url;
}

// Прев'ю показує лише українську мову — беремо *Uk-поля блоків додаткової інформації.
function additionalBlockToContentBlock(block: AdditionalContentBlock): ProjectResultContentBlock {
  switch (block.type) {
    case "heading":
      return { type: "heading", headingText: block.headingUk };
    case "paragraph":
      return { type: "paragraph", paragraphText: block.paragraphUk };
    case "image":
      return { type: "image", image: block.image };
    case "link":
      return { type: "link", url: block.url };
  }
}

interface PublicationPreviewSectionProps {
  projectNameUa: string;
  selectedArtFieldLabel: string | null;
  workGalleryItems: ProjectWorkMediaItem[];
  descriptionUa: string;
  parameterCatalog: Parameter[];
  parameterAnswers: ParameterAnswers;
  additionalBlocks: AdditionalContentBlock[];
  likesCount?: number;
}

export default function PublicationPreviewSection({
  projectNameUa,
  selectedArtFieldLabel,
  workGalleryItems,
  descriptionUa,
  parameterCatalog,
  parameterAnswers,
  additionalBlocks,
  likesCount = 0,
}: PublicationPreviewSectionProps) {
  const profile = useProfileView();

  const previewTitle = projectNameUa.trim() || "«Назва проєкту»";
  const previewGenre = selectedArtFieldLabel || "Жанр не обрано";
  const slides = workGalleryItems.map(workGalleryItemToSlide);
  const descriptionParagraphs = descriptionUa
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const characteristics = parameterCatalog
    .map((param) => {
      const answer = parameterAnswers[param.id];
      const value =
        param.type === "list"
          ? localize(param.values.find((v) => v.id === answer?.valueId)?.value)
          : answer?.value.uk || answer?.value.en || "";
      return { id: param.id, name: localize(param.name), description: value };
    })
    .filter((item) => item.description.trim());

  const saveArtButton = profile.aboutMe.buttons.find((button) => button.id === "save-art");

  return (
    <ProjectResultShowcase
      title={previewTitle}
      tags={[{ text: previewGenre }]}
      slides={slides}
      likesCount={likesCount}
      author={{
        avatarUrl: profile.aboutMe.avatar,
        name: profile.aboutMe.name,
        description: profile.aboutMe.artistType,
        linkHref: saveArtButton?.href,
        linkLabel: saveArtButton?.label,
      }}
      characteristicsTitle="Характеристики проекту:"
      tableHeaders={{ name: "Назва", description: "Опис" }}
      characteristics={
        characteristics.length > 0 ? characteristics : [{ id: -1, name: "-", description: "-" }]
      }
      descriptionParagraphs={descriptionParagraphs.length > 0 ? descriptionParagraphs : ["Текст опису проекту"]}
      contentBlocks={additionalBlocks.map(additionalBlockToContentBlock)}
    />
  );
}
