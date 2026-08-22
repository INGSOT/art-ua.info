import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Header from "../../../../components/Header";
import { projectsAPI, type PublicProjectDetail } from "../../../../lib/api/projects";
import type { Project, SalesStatus } from "../../../../data/projectsData";
import ProjectPageClient from "./ProjectPageClient";
import { saveArtProfileLabel, siteProfileLabel } from "../../../../lib/siteDomains";
import { localeToApiLanguage, type Locale } from "../../../../i18n/routing";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
    locale: Locale;
  }>;
}

const FALLBACK_IMAGE = "/gallery/ship.png";

type ProjectDetailTranslations = Awaited<ReturnType<typeof getTranslations>>;

// Той самий набір і порядок іконок "Поділитися", що й на project-картці в
// save-art (CollectionProjectCardPublish): посилання, Facebook, X, Pinterest, LinkedIn.
function getDefaultSocialLinks(t: ProjectDetailTranslations) {
  return [
    { icon: "/socials/link_yellow.svg", alt: t("shareLinkAlt") },
    { icon: "/socials/facebook_yellow.svg", alt: "Facebook" },
    { icon: "/socials/x_yellow.svg", alt: "X" },
    { icon: "/socials/pinterest_yellow.svg", alt: "Pinterest" },
    { icon: "/socials/linked_in_yellow.svg", alt: "LinkedIn" },
  ];
}

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
function mapToProject(raw: PublicProjectDetail, t: ProjectDetailTranslations): Project {
  // Слайди можуть бути як зображеннями, так і посиланнями на відео (YouTube/Vimeo) —
  // ProjectPageClient сам розрізняє їх через getVideoInfo() і рендерить або <Image>, або плеєр.
  // "link" — застарілий тип (до розділення на youtube/vimeo/issuu), лишений заради
  // сумісності зі старими записами.
  const VIDEO_TYPES = ["link", "youtube", "vimeo"];
  const slides = [
    raw.coverUrl,
    ...raw.finalResult
      .filter((item) => (item.type === "image" && item.image) || (VIDEO_TYPES.includes(item.type) && item.url))
      .map((item) => (item.type === "image" ? item.image : item.url) as string),
  ].filter((src): src is string => !!src);

  const finalSlides = slides.length > 0 ? slides : [FALLBACK_IMAGE];

  const characteristics = raw.parameters.length
    ? raw.parameters.map((param) => ({
        name: param.parameter || t("characteristicDefault"),
        description: param.value ?? "—",
      }))
    : [
        { name: t("direction"), description: raw.artCategoryLabel ?? "—" },
        { name: t("genreMarkers"), description: raw.artSubcategoryLabel ?? raw.artCategoryLabel ?? "—" },
        { name: t("conceptAuthor"), description: raw.author.name },
        { name: t("status"), description: raw.statusLabel },
      ];

  // Короткий опис (short_description) показуємо окремо від content_blocks — самі
  // content_blocks (заголовки/текст/зображення/посилання) рендеряться нижче один в
  // один як на save-art, тож тут беремо лише короткий опис, щоб не дублювати абзаци.
  const descriptionText = [raw.shortDescription, raw.additionalInfo].filter(Boolean);

  const authorSlug = raw.author.slug ?? "";

  return {
    id: raw.id,
    authorId: raw.author.id,
    image: raw.coverUrl ?? FALLBACK_IMAGE,
    title: raw.title,
    slug: raw.slug,
    source: raw.source,
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
        { text: raw.statusLabel, hasIcon: true },
      ],
      links: {
        saveArt: authorSlug ? t("projectOnSaveArt", { label: saveArtProfileLabel(authorSlug) }) : "",
        artUa: authorSlug ? t("projectOnArtUa", { label: siteProfileLabel(authorSlug) }) : "",
      },
      slides: finalSlides,
      initialLikes: raw.likesCount,
      characteristicsTitle: t("characteristicsTitle"),
      tableHeaders: { name: t("tableHeaderName"), description: t("tableHeaderDescription") },
      characteristics,
    },
    projectDescriptionData: {
      slides: finalSlides,
      tags: raw.tags.length ? raw.tags : [raw.artCategoryLabel ?? "", raw.title].filter(Boolean),
      date: formatDate(raw.announcedAt ?? raw.createdAt),
      title: t("notesTitle", { title: raw.title }),
      aboutAuthor: {
        avatar: raw.author.avatarUrl ?? "",
        name: raw.author.name,
        description: raw.author.profession || raw.shortDescription || "",
        artUaLink: authorSlug ? siteProfileLabel(authorSlug) : "",
        saveArtLink: authorSlug ? saveArtProfileLabel(authorSlug) : "",
      },
      socialLinks: getDefaultSocialLinks(t),
      descriptionText,
      contentBlocks: raw.contentBlocks,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug, locale } = await params;
  const t = await getTranslations("Projects.detail");

  let raw: PublicProjectDetail | null = null;
  try {
    raw = await projectsAPI.show(slug, localeToApiLanguage(locale));
  } catch (error) {
    console.error(`Failed to load project "${slug}":`, error);
  }

  if (!raw) {
    notFound();
  }

  const project = mapToProject(raw, t);

  return (
    <>
      <Header isHomePage={false} />
      <ProjectPageClient project={project} initialIsLiked={raw.isLiked} />
    </>
  );
}
