"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.2;
// На вузьких екранах сторінку підганяємо під ширину контейнера, а не висоту екрана.
const MOBILE_BREAKPOINT = 640;
const VIEWPORT_BOTTOM_GAP = 24;

export default function PdfViewer({ url }: { url: string }) {
  const t = useTranslations("Catalogs.pdf");
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [fitHeight, setFitHeight] = useState(0);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [failed, setFailed] = useState(false);

  const proxiedUrl = `/api/pdf-proxy?url=${encodeURIComponent(url)}`;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setContainerWidth(width - 32);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateFitHeight = () => {
      const el = containerRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      setFitHeight(Math.max(400, window.innerHeight - top - VIEWPORT_BOTTOM_GAP));
    };

    updateFitHeight();
    window.addEventListener("resize", updateFitHeight);
    return () => window.removeEventListener("resize", updateFitHeight);
  }, []);

  const handleLoadSuccess = useCallback(({ numPages: total }: { numPages: number }) => {
    setNumPages(total);
    setPageNumber(1);
  }, []);

  const goToPrev = () => setPageNumber((page) => Math.max(1, page - 1));
  const goToNext = () => setPageNumber((page) => Math.min(numPages ?? page, page + 1));
  const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(1)));
  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(1)));

  // На мобілці підганяємо під ширину контейнера (щоб не вилазило горизонтально),
  // на десктопі — під висоту екрана (щоб сторінка займала майже весь екран, як книга).
  const fitByWidth = containerWidth > 0 && containerWidth < MOBILE_BREAKPOINT;
  const pageWidth = fitByWidth ? containerWidth * zoom : undefined;
  const pageHeight = !fitByWidth && fitHeight > 0 ? fitHeight * zoom : undefined;

  if (failed) {
    return (
      <div className="w-full aspect-[1/1.4142] flex flex-col items-center justify-center gap-3 bg-white px-4">
        <p className="text-[#343434] text-sm font-bold text-center">
          {t("viewError")}
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#343434] text-sm font-bold underline"
        >
          {t("openSeparately")}
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            className="w-8 h-8 flex items-center justify-center text-white font-bold text-lg bg-[#414141] hover:bg-[#4d4d4d] disabled:opacity-30 transition-colors"
          >
            −
          </button>
          <span className="text-white text-xs font-bold w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            className="w-8 h-8 flex items-center justify-center text-white font-bold text-lg bg-[#414141] hover:bg-[#4d4d4d] disabled:opacity-30 transition-colors"
          >
            +
          </button>
        </div>

        {numPages !== null && numPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goToPrev}
              disabled={pageNumber <= 1}
              className="w-8 h-8 flex items-center justify-center bg-[#414141] hover:bg-[#4d4d4d] disabled:opacity-30 transition-colors"
            >
              <Image src="/arrow-chevron-left-yellow.svg" alt={t("prevPage")} width={14} height={14} />
            </button>
            <span className="text-white text-xs font-bold whitespace-nowrap">
              {t("pageOf", { current: pageNumber, total: numPages })}
            </span>
            <button
              type="button"
              onClick={goToNext}
              disabled={pageNumber >= numPages}
              className="w-8 h-8 flex items-center justify-center bg-[#414141] hover:bg-[#4d4d4d] disabled:opacity-30 transition-colors"
            >
              <Image src="/arrow-chevron-right-yellow.svg" alt={t("nextPage")} width={14} height={14} />
            </button>
          </div>
        )}
      </div>

      <div ref={containerRef} className="w-full overflow-auto flex justify-center bg-[#2a2a2a] py-4">
        <Document
          file={proxiedUrl}
          onLoadSuccess={handleLoadSuccess}
          onLoadError={() => setFailed(true)}
          loading={<p className="text-white text-sm py-20">{t("loading")}</p>}
          error={<p className="text-white text-sm py-20">{t("loadError")}</p>}
        >
          {(pageWidth || pageHeight) && (
            <div key={pageNumber} className="animate-page-flip shadow-2xl">
              <Page
                pageNumber={pageNumber}
                width={pageWidth}
                height={pageHeight}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={<p className="text-white text-sm py-20">{t("pageLoading")}</p>}
              />
            </div>
          )}
        </Document>
      </div>
    </div>
  );
}
