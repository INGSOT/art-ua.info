import Image from "next/image";
import Link from "next/link";
import type { PublicCatalog } from "../../../lib/api/publicCatalogs";
import { withAuthorId } from "../../../lib/authorQuery";
import { siteProfileLabel } from "../../../lib/siteDomains";
import PdfViewer from "./PdfViewerClient";
import CatalogLikeButton from "./CatalogLikeButton";

function formatDate(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}`;
}

export default function CatalogViewer({ catalog }: { catalog: PublicCatalog }) {
  const publishedDate = formatDate(catalog.publishedAt);
  const authorProfileLabel = catalog.authorSlug ? siteProfileLabel(catalog.authorSlug) : null;

  return (
    <section className="w-full bg-[#414141] py-8 px-4 sm:px-6 md:px-10 lg:px-20">
      <Link
        href="/catalogs"
        className="inline-flex items-center gap-2 text-[#FECC39] text-sm font-bold mb-4 hover:text-white transition-colors"
      >
        <Image src="/arrow-chevron-left-yellow.svg" alt="" width={16} height={16} />
        Всі каталоги
      </Link>

      <h1
        className="text-white font-bold text-2xl sm:text-3xl md:text-[40px] leading-tight mb-6 md:mb-8"
        style={{ fontWeight: 600 }}
      >
        {catalog.title}
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
        <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-5">
          <div className="bg-[#343434]">
            <div className="flex flex-col items-start gap-3 p-3 border-b border-[#414141]">
              <Image
                src={catalog.authorAvatar}
                alt={catalog.authorName}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover border border-[#272727]"
              />
              <Link href={withAuthorId("/author/catalogs", catalog.authorSlug ?? "")} className="text-white font-bold text-lg hover:text-[#FECC39] transition-colors">
                {catalog.authorName}
              </Link>
              {catalog.authorProfession && <p className="text-white text-sm">{catalog.authorProfession}</p>}
              {authorProfileLabel && (
                <a
                  href={`https://${authorProfileLabel}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-sm text-white hover:text-[#FECC39] transition-colors"
                >
                  {authorProfileLabel}
                </a>
              )}
            </div>
          </div>

          <div className="bg-[#343434] p-4 flex flex-col gap-3">
            {catalog.rootCategoryName && (
              <div className="flex items-center justify-between gap-2">
                <span className="font-wix text-white/60 text-xs">Напрям</span>
                <span className="font-wix text-white text-sm font-bold text-right">
                  {catalog.rootCategoryName}
                </span>
              </div>
            )}
            {catalog.artCategoryName && catalog.artCategoryName !== catalog.rootCategoryName && (
              <div className="flex items-center justify-between gap-2">
                <span className="font-wix text-white/60 text-xs">Категорія</span>
                <span className="font-wix text-white text-sm font-bold text-right">
                  {catalog.artCategoryName}
                </span>
              </div>
            )}
            {publishedDate && (
              <div className="flex items-center justify-between gap-2">
                <span className="font-wix text-white/60 text-xs">Опубліковано</span>
                <span className="font-wix text-white text-sm font-bold">{publishedDate}</span>
              </div>
            )}
          </div>

          <CatalogLikeButton
            catalogId={catalog.id}
            initialLikes={catalog.likes}
            initialIsLiked={catalog.isLiked}
            className="self-center"
          />

          {catalog.pdfUrl && (
            <div className="flex flex-col gap-px">
              <a
                href={catalog.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center px-4 py-3 bg-[#FECC39] text-[#343434] font-bold text-sm hover:bg-white transition-colors"
              >
                Відкрити в новій вкладці
              </a>
              <a
                href={catalog.pdfUrl}
                download
                className="w-full text-center px-4 py-3 border border-[#FECC39] text-[#FECC39] font-bold text-sm hover:bg-[#FECC39] hover:text-[#343434] transition-colors"
              >
                Завантажити PDF
              </a>
            </div>
          )}
        </div>

        <div className="w-full lg:flex-1 min-w-0 bg-[#343434] p-2 md:p-3">
          {catalog.pdfUrl ? (
            <PdfViewer url={catalog.pdfUrl} />
          ) : (
            <div className="relative w-full aspect-[1/1.4142] bg-cover bg-center overflow-hidden">
              <Image src={catalog.image} alt={catalog.title} fill className="object-cover" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
