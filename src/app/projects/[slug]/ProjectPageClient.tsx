"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import type { Project } from "../../../data/projectsData";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { projectsAPI, type LikeResponse } from "../../../lib/api/projects";
import ProjectResultShowcase from "../../../components/project/ProjectResultShowcase";

interface ProjectPageClientProps {
  project: Project;
  initialIsLiked?: boolean;
}

export default function ProjectPageClient({ project, initialIsLiked = false }: ProjectPageClientProps) {
  const [likes, setLikes] = useState(project.projectDetails.initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeLoading, setLikeLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  // Сторінка рендериться на сервері без токена користувача (localStorage там
  // недоступний), тож is_liked із SSR-фетчу завжди false. Після визначення
  // авторизації на клієнті довантажуємо актуальний стан лайка.
  useEffect(() => {
    if (authLoading || !user) return;

    let cancelled = false;
    projectsAPI
      .show(project.slug)
      .then((detail) => {
        if (cancelled) return;
        setIsLiked(detail.isLiked);
        setLikes(detail.likesCount);
      })
      .catch(() => {
        // Не вдалось перевірити стан лайка — залишаємо те, що вже є (з SSR).
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, project.slug]);

  const { projectDetails, projectDescriptionData } = project;

  // Редагувати можна лише проєкти, створені через майстер art-ua-info (окремий флоу
  // без бюджету/етапів/бонусів) — save-art проєкти редагуються на save-art.in.ua.
  const canEdit = user?.id === project.authorId && project.source === "art_ua_info";

  const authorLinkHref = projectDescriptionData.aboutAuthor.artUaLink
    ? `https://${projectDescriptionData.aboutAuthor.artUaLink}`
    : undefined;

  const handleLikeClick = async () => {
    if (likeLoading) return;

    if (!user) {
      showToast("Щоб поставити лайк, потрібно увійти в систему", "red", "Помилка");
      return;
    }

    setLikeLoading(true);
    try {
      const response = isLiked
        ? await projectsAPI.unlike(project.slug)
        : await projectsAPI.like(project.slug);
      setIsLiked(response.is_liked);
      setLikes(response.likes_count);
    } catch (error) {
      if (isAxiosError<LikeResponse>(error) && error.response?.status === 422) {
        // Стан розсинхронізувався з сервером (наприклад, після оновлення сторінки
        // is_liked прийшов невірним) — синхронізуємо за даними з відповіді, як у save-art.
        const data = error.response.data;
        if (typeof data?.is_liked === "boolean") setIsLiked(data.is_liked);
        if (typeof data?.likes_count === "number") setLikes(data.likes_count);
        showToast(data?.message || "Не вдалося оновити лайк", "red", "Помилка");
      } else if (isAxiosError(error) && error.response?.status === 401) {
        showToast("Щоб поставити лайк, потрібно увійти в систему", "red", "Помилка");
      } else {
        showToast("Не вдалося оновити лайк, спробуйте пізніше", "red", "Помилка");
      }
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <section className="w-full bg-[#414141] py-16 px-4">
      <ProjectResultShowcase
        title={projectDetails.title}
        tags={projectDetails.tags.map((tag) => ({
          text: tag.text,
          icon: tag.hasIcon ? "/coins.svg" : undefined,
        }))}
        slides={projectDetails.slides}
        likesCount={likes}
        isLiked={isLiked}
        onLikeClick={handleLikeClick}
        likeDisabled={likeLoading}
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
