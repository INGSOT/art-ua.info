"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

function PdfLoadingFallback() {
  const t = useTranslations("Catalogs.pdf");
  return <p className="text-white text-sm py-20 text-center">{t("loading")}</p>;
}

// pdfjs-dist чіпає браузерні глобали (DOMMatrix) уже під час завантаження модуля,
// тож серверний рендер клієнтського PdfViewer падає з "DOMMatrix is not defined".
// ssr:false можна викликати лише всередині "use client"-компонента — тому обгортка.
const PdfViewer = dynamic(() => import("./PdfViewer"), {
  ssr: false,
  loading: PdfLoadingFallback,
});

export default PdfViewer;
