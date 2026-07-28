import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import { projectsAPI, type PublicProjectDetail } from "../../../lib/api/projects";
import type { Project, SalesStatus } from "../../../data/projectsData";
import ProjectPageClient from "./ProjectPageClient";
import { saveArtProfileLabel, siteProfileLabel } from "../../../lib/siteDomains";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const FALLBACK_IMAGE = "/gallery/ship.png";

const DEFAULT_SOCIAL_LINKS = [
  { icon: "/socials/deviantart_yellow.svg", alt: "DeviantArt" },
  { icon: "/socials/facebook_yellow.svg", alt: "Facebook" },
  { icon: "/socials/x_yellow.svg", alt: "X" },
  { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest" },
  { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn" },
];

function formatDate(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}`;
}

function resolveSalesStatus(status: string): SalesStatus {
  if (status === "completed" || status === "sold") return "sold";
  if (status === "in_progress" || status === "paused") return "reserved";
  return "for-sale";
}

/**
 * Мапить відповідь `GET /v1/projects/{slug}` у формат мок-типу `Project`,
 * щоб зберегти без змін верстку `ProjectPageClient`.
 */
function mapToProject(raw: PublicProjectDetail): Project {
  const slides = [
    raw.coverUrl,
    ...raw.contentBlocks.filter((block) => block.type === "image" && block.image).map((block) => block.image as string),
  ].filter((src): src is string => !!src);

  const finalSlides = slides.length > 0 ? slides : [FALLBACK_IMAGE];

  const characteristics = raw.parameters.length
    ? raw.parameters.map((param) => ({
        name: param.parameter || "Характеристика",
        description: param.value ?? "—",
      }))
    : [
        { name: "Напрям", description: raw.artCategoryLabel ?? "—" },
        { name: "Жанрові маркери", description: raw.artSubcategoryLabel ?? raw.artCategoryLabel ?? "—" },
        { name: "Автор концепції", description: raw.author.name },
        { name: "Статус", description: raw.statusLabel },
      ];

  const descriptionText = raw.contentBlocks
    .filter((block) => block.type === "paragraph" && block.paragraphText)
    .map((block) => block.paragraphText as string);

  const fallbackDescriptionText = [raw.shortDescription, raw.additionalInfo].filter(Boolean);

  const authorSlug = raw.author.slug ?? "";

  return {
    id: raw.id,
    authorId: raw.author.id,
    image: raw.coverUrl ?? FALLBACK_IMAGE,
    title: raw.title,
    slug: raw.slug,
    date: formatDate(raw.announcedAt ?? raw.createdAt),
    artSubCategory: raw.artSubcategory ?? raw.artCategory ?? "",
    likes: raw.likesCount,
    salesStatus: resolveSalesStatus(raw.status),
    authorAvatar: raw.author.avatarUrl ?? "",
    authorName: raw.author.name,
    projectDetails: {
      title: raw.title,
      tags: [
        { text: raw.artCategoryLabel ?? raw.artCategory ?? "", hasIcon: false },
        { text: raw.artSubcategoryLabel ?? "Авторський проєкт", hasIcon: true },
      ],
      links: {
        saveArt: authorSlug ? `Проєкт на ${saveArtProfileLabel(authorSlug)}` : "",
        artUa: authorSlug ? `Проєкт на ${siteProfileLabel(authorSlug)}` : "",
      },
      slides: finalSlides,
      initialLikes: raw.likesCount,
      characteristicsTitle: "Характеристики проєкту:",
      tableHeaders: { name: "Назва", description: "Опис" },
      characteristics,
    },
    projectDescriptionData: {
      slides: finalSlides,
      tags: raw.tags.length ? raw.tags : [raw.artCategoryLabel ?? "", raw.title].filter(Boolean),
      date: formatDate(raw.announcedAt ?? raw.createdAt),
      title: `Нотатки до проєкту «${raw.title}»`,
      aboutAuthor: {
        avatar: raw.author.avatarUrl ?? "",
        name: raw.author.name,
        description: raw.author.profession || raw.shortDescription || "",
        artUaLink: authorSlug ? siteProfileLabel(authorSlug) : "",
        saveArtLink: authorSlug ? saveArtProfileLabel(authorSlug) : "",
      },
      socialLinks: DEFAULT_SOCIAL_LINKS,
      descriptionText: descriptionText.length ? descriptionText : fallbackDescriptionText,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  let raw: PublicProjectDetail | null = null;
  try {
    raw = await projectsAPI.show(slug);
  } catch (error) {
    console.error(`Failed to load project "${slug}":`, error);
  }

  if (!raw) {
    notFound();
  }

  const project = mapToProject(raw);

  return (
    <>
      <Header isHomePage={false} />
      <ProjectPageClient project={project} />
    </>
  );
}
