"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { Card, CardContent } from "../../../../../components/ui/card";
import EmptyState from "../../../../../components/ui/empty-state";
import { projectsAPI, type MyProjectListItem } from "../../../../../lib/api/projects";
import { useProfileView } from "../../ProfileViewContext";
import { withProfileId } from "../../../../../lib/authorQuery";

// Усі статуси art-ua-info-проєктів, крім завершених/проданих (ті показуються
// на вкладці "Проєкти" — Projects.tsx через GET /v1/my/projects/completed).
const DRAFT_STATUSES = "new,draft,moderation,rejected";

export default function Drafts() {
  const t = useTranslations("Profile.drafts");
  const { slug } = useProfileView();
  const [drafts, setDrafts] = useState<MyProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    projectsAPI
      .myList({ source: "art_ua_info", status: DRAFT_STATUSES })
      .then((projects) => {
        if (!cancelled) setDrafts(projects);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const hasDrafts = drafts.length > 0;

  if (loading) {
    return (
      <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px] min-h-[400px]" />
    );
  }

  return (
    <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px]">
      {hasDrafts ? (
        <>
          <div className="mb-8 flex justify-center">
            <Link
              href={withProfileId("/profile/create-project", slug)}
              className="h-[60px] flex items-stretch transition-all duration-300 rounded-none bg-[#FECC39] hover:bg-white w-full md:w-[320px]"
            >
              <span className="flex items-center justify-center flex-1 px-6 font-bold text-black whitespace-nowrap">
                {t("createButton")}
              </span>
              <div className="flex items-center justify-center w-[60px] flex-shrink-0 border-l border-black">
                <Image src="/plus.svg" alt="Plus" width={24} height={24} />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drafts.map((draft) => (
              <Link
                key={draft.id}
                href={withProfileId(`/profile/edit-project?edit=${draft.slug}`, slug)}
                className="block group"
              >
                <Card className="bg-transparent border-0 outline-none shadow-none rounded-none">
                  <CardContent className="p-0 flex flex-col gap-3">
                    <div className="relative w-full aspect-[460/316] bg-[#2A2A2A] overflow-hidden">
                      {draft.coverUrl && (
                        <Image
                          src={draft.coverUrl}
                          alt={draft.title}
                          fill
                          className="object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <Image src="/arrow-chevron-right-white.svg" alt={t("editAlt")} width={48} height={48} />
                      </div>
                      <div className="absolute left-3 top-3 z-10 bg-[#343434] px-3 py-1.5">
                        <span className="text-[#FECC39] text-sm font-bold">{draft.statusLabel}</span>
                      </div>
                    </div>
                    <h3 className="font-h6 font-bold text-white text-[length:var(--h6-font-size)] tracking-[var(--h6-letter-spacing)] leading-[var(--h6-line-height)]">
                      {draft.title || t("untitled")}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title={t("empty.title")}
          description={t("empty.subtitle")}
          buttonText={t("empty.button")}
          buttonHref={withProfileId("/profile/create-project", slug)}
        />
      )}
    </section>
  );
}
