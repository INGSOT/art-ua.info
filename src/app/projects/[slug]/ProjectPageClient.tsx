"use client";

import { useState } from "react";
import type { Project } from "../../../data/projectsData";
import { useAuth } from "../../../context/AuthContext";
import ProjectResultShowcase from "../../../components/project/ProjectResultShowcase";

interface ProjectPageClientProps {
  project: Project;
}

export default function ProjectPageClient({ project }: ProjectPageClientProps) {
  const [likes] = useState(project.projectDetails.initialLikes);
  const { user } = useAuth();

  const { projectDetails, projectDescriptionData } = project;

  // Редагувати можна лише проєкти, створені через майстер art-ua-info (окремий флоу
  // без бюджету/етапів/бонусів) — save-art проєкти редагуються на save-art.in.ua.
  const canEdit = user?.id === project.authorId && project.source === "art_ua_info";

  const authorLinkHref = projectDescriptionData.aboutAuthor.artUaLink
    ? `https://${projectDescriptionData.aboutAuthor.artUaLink}`
    : undefined;

  return (
    <section className="w-full bg-[#414141] py-16 px-4">
      <ProjectResultShowcase
        title={projectDetails.title}
        tags={projectDetails.tags.map((tag) => ({
          text: tag.text,
          icon: tag.hasIcon ? "/coins.svg" : undefined,
        }))}
        slides={projectDetails.slides}
        saveArtLinkText={projectDetails.links.saveArt || undefined}
        artUaLinkText={projectDetails.links.artUa || undefined}
        likesCount={likes}
        editHref={canEdit ? `/profile/${user!.slug}/edit-project?edit=${project.slug}` : undefined}
        author={{
          avatarUrl: projectDescriptionData.aboutAuthor.avatar,
          name: projectDescriptionData.aboutAuthor.name,
          description: projectDescriptionData.aboutAuthor.description,
          linkHref: authorLinkHref,
          linkLabel: projectDescriptionData.aboutAuthor.artUaLink,
        }}
        socialLinks={projectDescriptionData.socialLinks}
        dateValue={projectDescriptionData.date}
        characteristicsTitle={projectDetails.characteristicsTitle}
        tableHeaders={projectDetails.tableHeaders}
        characteristics={projectDetails.characteristics.map((item, index) => ({
          id: index,
          name: item.name,
          description: item.description,
        }))}
        descriptionParagraphs={projectDescriptionData.descriptionText}
        contentBlocks={projectDescriptionData.contentBlocks}
      />
    </section>
  );
}
