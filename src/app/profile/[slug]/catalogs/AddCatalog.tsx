"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { addCatalogTexts } from "../../../../data/profileData";
import { catalogsAPI, type ArtCategory } from "../../../../lib/api/catalogs";
import { getApiFieldErrors, getApiErrorMessage } from "../../../../lib/apiError";
import SelectCatalogCategoryForm from "./SelectCatalogCategoryForm";

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
const MAX_PDF_SIZE_BYTES = 20 * 1024 * 1024;

interface AddCatalogInitialData {
  titleUk: string;
  titleEn: string;
  artCategory: string;
  artSubcategory: string | null;
  categoryLabel: string | null;
  imageUrl: string;
  pdfUrl: string | null;
}

interface AddCatalogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: AddCatalogInitialData;
  onSubmit: (params: {
    titleUk: string;
    titleEn: string;
    artCategory: string;
    artSubcategory: string | null;
    image: string | null;
    pdfFile: File | null;
  }) => Promise<void>;
}

function pdfNameFromUrl(url: string | null): string | null {
  if (!url) return null;
  const fileName = url.split("/").pop();
  return fileName ? decodeURIComponent(fileName) : null;
}

export default function AddCatalog({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: AddCatalogProps) {
  const isEditMode = Boolean(initialData);
  const [selectedImage, setSelectedImage] = useState<string | null>(initialData?.imageUrl ?? null);
  const [catalogFile, setCatalogFile] = useState<File | null>(null);
  const [existingPdfName, setExistingPdfName] = useState<string | null>(
    pdfNameFromUrl(initialData?.pdfUrl ?? null)
  );
  const [isHoveringCatalogButton, setIsHoveringCatalogButton] = useState(false);
  const [titleUk, setTitleUk] = useState(initialData?.titleUk ?? "");
  const [titleEn, setTitleEn] = useState(initialData?.titleEn ?? "");
  const [artCategory, setArtCategory] = useState(initialData?.artCategory ?? "");
  const [artSubcategory, setArtSubcategory] = useState<string | null>(initialData?.artSubcategory ?? null);
  const [categoryLabel, setCategoryLabel] = useState<string | null>(initialData?.categoryLabel ?? null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<ArtCategory[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [imageError, setImageError] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const catalogInputRef = useRef<HTMLInputElement>(null);
  const titleUkRef = useRef<HTMLInputElement>(null);
  const titleEnRef = useRef<HTMLInputElement>(null);
  const categoryButtonRef = useRef<HTMLButtonElement>(null);

  const errorUk = fieldErrors["title.uk"]?.[0] || fieldErrors.title?.[0];
  const errorEn = fieldErrors["title.en"]?.[0];
  const errorCategory = fieldErrors.art_category?.[0];

  useEffect(() => {
    if (!isOpen) return;
    catalogsAPI.categories().then(setCategories);
  }, [isOpen]);

  useEffect(() => {
    if (errorUk) {
      titleUkRef.current?.focus();
    } else if (errorEn) {
      titleEnRef.current?.focus();
    } else if (errorCategory) {
      categoryButtonRef.current?.focus();
    }
  }, [errorUk, errorEn, errorCategory]);

  const handleSelectCategory = (categorySlug: string, subcategorySlug: string | null, label: string) => {
    setArtCategory(categorySlug);
    setArtSubcategory(subcategorySlug);
    setCategoryLabel(label);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImageError(`Обкладинка занадто велика (максимум ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024} МБ)`);
      e.target.value = "";
      return;
    }

    setImageError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCatalogChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") return;

    if (file.size > MAX_PDF_SIZE_BYTES) {
      setPdfError(`Файл занадто великий (максимум ${MAX_PDF_SIZE_BYTES / 1024 / 1024} МБ)`);
      e.target.value = "";
      return;
    }

    setPdfError(null);
    setCatalogFile(file);
  };

  const handleImageUploadClick = () => {
    imageInputRef.current?.click();
  };

  const handleCatalogUploadClick = () => {
    catalogInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleRemoveCatalog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCatalogFile(null);
    setExistingPdfName(null);
    if (catalogInputRef.current) {
      catalogInputRef.current.value = "";
    }
  };

  const resetState = () => {
    setSelectedImage(null);
    setCatalogFile(null);
    setExistingPdfName(null);
    setTitleUk("");
    setTitleEn("");
    setArtCategory("");
    setArtSubcategory(null);
    setCategoryLabel(null);
    setFieldErrors({});
    setImageError(null);
    setPdfError(null);
    setSubmitError(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (catalogInputRef.current) catalogInputRef.current.value = "";
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleAdd = async () => {
    if (!selectedImage || (!catalogFile && !existingPdfName) || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const imageChanged = !initialData || selectedImage !== initialData.imageUrl;

    try {
      await onSubmit({
        titleUk,
        titleEn,
        artCategory,
        artSubcategory,
        image: imageChanged ? selectedImage : null,
        pdfFile: catalogFile,
      });
      resetState();
      onClose();
    } catch (error) {
      const errors = getApiFieldErrors(error);
      setFieldErrors(errors ?? {});
      setSubmitError(getApiErrorMessage(error, "Не вдалося зберегти каталог"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={handleClose}
      />

      {/* Slide-in Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-[#414141] z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <h2 className="text-white text-[18px] font-bold">
            {isEditMode ? addCatalogTexts.editTitle : addCatalogTexts.title}
          </h2>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#343434] transition-colors"
          >
            <Image
              src="/yellow_cross.svg"
              alt={addCatalogTexts.closeAlt}
              width={24}
              height={24}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Title (UK) */}
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm">
              {addCatalogTexts.titleUkLabel} <span className="text-red-500">*</span>
            </label>
            <div className={`relative ${errorUk ? "border-2 border-red-500" : ""}`}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src="/ua.svg" alt="UA" width={24} height={24} />
              </div>
              <input
                ref={titleUkRef}
                type="text"
                value={titleUk}
                onChange={(e) => setTitleUk(e.target.value)}
                placeholder={addCatalogTexts.titleUkPlaceholder}
                className="w-full pl-14 pr-4 py-3 bg-[#343434] text-white placeholder-[#A0A0A0]"
              />
            </div>
            {errorUk && <p className="text-red-500 text-sm">{errorUk}</p>}
          </div>

          {/* Title (EN) */}
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm">
              {addCatalogTexts.titleEnLabel} <span className="text-red-500">*</span>
            </label>
            <div className={`relative ${errorEn ? "border-2 border-red-500" : ""}`}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src="/en.svg" alt="EN" width={24} height={24} />
              </div>
              <input
                ref={titleEnRef}
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder={addCatalogTexts.titleEnPlaceholder}
                className="w-full pl-14 pr-4 py-3 bg-[#343434] text-white placeholder-[#A0A0A0]"
              />
            </div>
            {errorEn && <p className="text-red-500 text-sm">{errorEn}</p>}
          </div>

          {/* Art category */}
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm">
              {addCatalogTexts.categoryLabel} <span className="text-red-500">*</span>
            </label>
            <button
              ref={categoryButtonRef}
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className={`w-full flex items-center justify-between gap-4 px-6 py-4 bg-[#343434] text-white hover:bg-[#3a3a3a] transition-colors ${
                errorCategory ? "border-2 border-red-500" : ""
              }`}
            >
              <span>{categoryLabel || addCatalogTexts.categoryPlaceholder}</span>
              <Image src="/white_triangle_left.svg" alt="arrow" width={20} height={20} />
            </button>
            {errorCategory && <p className="text-red-500 text-sm">{errorCategory}</p>}
          </div>

          {/* Image Upload Area */}
          <div
            onClick={handleImageUploadClick}
            className={`relative w-full h-[280px] bg-[#343434] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-[#3a3a3a] transition-colors ${
              imageError ? "border-red-500" : "border-black"
            }`}
          >
            {selectedImage ? (
              <>
                <Image
                  src={selectedImage}
                  alt="Selected cover"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="absolute top-4 right-4 w-12 h-12 bg-[#343434] flex items-center justify-center hover:bg-[#414141] transition-colors z-10"
                >
                  <Image
                    src="/yellow_cross.svg"
                    alt={addCatalogTexts.imageRemoveAlt}
                    width={24}
                    height={24}
                  />
                </button>
              </>
            ) : (
              <>
                <Image
                  src="/upload.svg"
                  alt={addCatalogTexts.uploadIconAlt}
                  width={48}
                  height={48}
                  className="mb-4"
                />
                <p className="text-white text-center px-4 whitespace-pre-line">
                  {addCatalogTexts.imageUploadText}
                </p>
              </>
            )}
          </div>
          {imageError && <p className="text-red-500 text-sm">{imageError}</p>}

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Catalog Upload Button/Display */}
          {!catalogFile && !existingPdfName ? (
            <button
              onClick={handleCatalogUploadClick}
              className={`w-full h-[160px] bg-[#343434] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-[#3a3a3a] transition-colors ${
                pdfError ? "border-red-500" : "border-black"
              }`}
            >
              <Image
                src="/upload.svg"
                alt={addCatalogTexts.uploadIconAlt}
                width={48}
                height={48}
                className="mb-4"
              />
              <p className="text-white text-center px-4">
                {addCatalogTexts.catalogUploadText}
              </p>
            </button>
          ) : (
            <div
              onMouseEnter={() => setIsHoveringCatalogButton(true)}
              onMouseLeave={() => setIsHoveringCatalogButton(false)}
              className={`w-full h-[60px] flex items-stretch transition-all duration-300 cursor-pointer ${
                isHoveringCatalogButton
                  ? "bg-[#FECC39] text-[#343434]"
                  : "bg-[#343434] text-[#FECC39]"
              }`}
            >
              <div className="flex-1 min-w-0 flex items-center justify-center px-6">
                <span dir="rtl" className="font-bold text-[18px] truncate block w-full text-left">
                  {catalogFile?.name ?? existingPdfName}
                </span>
              </div>
              <div
                className={`w-[1px] ${
                  isHoveringCatalogButton ? "bg-[#343434]" : "bg-[#FECC39]"
                }`}
              />
              <button
                onClick={handleRemoveCatalog}
                className="w-[60px] flex items-center justify-center flex-shrink-0"
              >
                <Image
                  src={isHoveringCatalogButton ? "/black_cross.svg" : "/yellow_cross.svg"}
                  alt={addCatalogTexts.catalogRemoveAlt}
                  width={24}
                  height={24}
                />
              </button>
            </div>
          )}
          {pdfError && <p className="text-red-500 text-sm">{pdfError}</p>}

          <input
            ref={catalogInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleCatalogChange}
            className="hidden"
          />
        </div>

        {/* Footer Button */}
        <div className="p-6 flex flex-col items-center gap-3">
          {submitError && <p className="text-red-500 text-sm text-center">{submitError}</p>}
          <button
            onClick={handleAdd}
            disabled={!selectedImage || (!catalogFile && !existingPdfName) || isSubmitting}
            className="w-full md:w-[320px] h-[60px] bg-[#FECC39] text-[#343434] font-bold text-[18px] hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditMode ? addCatalogTexts.saveButton : addCatalogTexts.addButton}
          </button>
        </div>
      </div>

      {/* Category Selection Panel */}
      <SelectCatalogCategoryForm
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        selectedValue={artSubcategory || artCategory || null}
        onSelect={handleSelectCategory}
      />
    </>
  );
}
