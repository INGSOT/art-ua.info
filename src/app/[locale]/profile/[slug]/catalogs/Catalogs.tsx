"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { myCatalogsAPI, type MyCatalog } from "../../../../../lib/api/myCatalogs";
import DeleteCatalog from "./DeleteCatalog";
import AddCatalog from "./AddCatalog";
import EmptyState from "../../../../../components/ui/empty-state";

export default function Catalogs() {
  const t = useTranslations("Profile.catalogs");
  const [catalogs, setCatalogs] = useState<MyCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCheckbox, setHoveredCheckbox] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [catalogToDelete, setCatalogToDelete] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<MyCatalog | null>(null);

  useEffect(() => {
    let cancelled = false;
    myCatalogsAPI
      .list()
      .then((data) => {
        if (!cancelled) setCatalogs(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const togglePrimary = async (catalogId: number) => {
    const updated = await myCatalogsAPI.setPrimary(catalogId);
    setCatalogs((prev) =>
      prev.map((catalog) => ({ ...catalog, isPrimary: catalog.id === updated.id }))
    );
  };

  const handleDeleteClick = (catalogId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCatalogToDelete(catalogId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (catalogToDelete !== null) {
      await myCatalogsAPI.remove(catalogToDelete);
      setCatalogs((prev) => prev.filter((catalog) => catalog.id !== catalogToDelete));
      setCatalogToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setCatalogToDelete(null);
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleAddCatalog = async (params: {
    titleUk: string;
    titleEn: string;
    artCategory: string;
    artSubcategory: string | null;
    image: string | null;
    pdfFile: File | null;
  }) => {
    const created = await myCatalogsAPI.create({
      ...params,
      image: params.image as string,
      pdfFile: params.pdfFile as File,
    });
    setCatalogs((prev) => [...prev, created]);
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
  };

  const handleEditClick = (catalog: MyCatalog) => {
    setEditingCatalog(catalog);
  };

  const handleEditCatalog = async (params: {
    titleUk: string;
    titleEn: string;
    artCategory: string;
    artSubcategory: string | null;
    image: string | null;
    pdfFile: File | null;
  }) => {
    if (!editingCatalog) return;
    const updated = await myCatalogsAPI.update(editingCatalog.id, params);
    setCatalogs((prev) => prev.map((catalog) => (catalog.id === updated.id ? updated : catalog)));
  };

  const handleEditCancel = () => {
    setEditingCatalog(null);
  };

  if (loading) {
    return <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px] min-h-[400px]" />;
  }

  if (catalogs.length === 0) {
    return (
      <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px]">
        <EmptyState
          title={t("empty.title")}
          description={t("empty.subtitle")}
          buttonText={t("empty.button")}
          onButtonClick={handleAddClick}
        />

        {/* Add Catalog Modal */}
        <AddCatalog
          isOpen={isAddModalOpen}
          onClose={handleAddCancel}
          onSubmit={handleAddCatalog}
        />
      </section>
    );
  }

  return (
    <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px]">
      {/* Add Catalog Button */}
      <div className="mb-8 flex justify-center">
        <button
          onClick={handleAddClick}
          className="h-[60px] flex items-stretch transition-all duration-300 rounded-none bg-[#FECC39] hover:bg-white w-full md:w-[320px]"
        >
          <span className="flex items-center justify-center flex-1 px-6 font-bold text-black whitespace-nowrap">
            {t("addCatalogButton")}
          </span>
          <div className="flex items-center justify-center w-[60px] flex-shrink-0 border-l border-black">
            <Image src="/plus.svg" alt={t("addCatalogButtonIconAlt")} width={24} height={24} />
          </div>
        </button>
      </div>

      {/* Catalogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalogs.map((catalog) => (
          <div key={catalog.id} className="relative group">
            {/* Catalog Card */}
            <div className="relative w-full aspect-[4/3] bg-cover bg-center">
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={catalog.imageUrl}
                  alt={catalog.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Checkbox in top-left corner */}
              <div className="absolute top-3 left-3 z-[30]">
                <div
                  className="relative bg-[#343434] p-2 cursor-pointer"
                  onMouseEnter={() => setHoveredCheckbox(catalog.id)}
                  onMouseLeave={() => setHoveredCheckbox(null)}
                  onClick={() => togglePrimary(catalog.id)}
                >
                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
                      catalog.isPrimary || hoveredCheckbox === catalog.id
                        ? "border-[#FFD700]"
                        : "border-white"
                    }`}
                  >
                    {catalog.isPrimary && (
                      <div className="w-3 h-3 bg-[#FFD700]"></div>
                    )}
                  </div>

                  {/* Tooltip on hover */}
                  {hoveredCheckbox === catalog.id && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-3 z-[9999]">
                      {/* Tooltip content */}
                      <div
                        className="bg-[#272727] w-[200px] h-[104px] flex items-center justify-center px-4"
                        style={{ transform: "translateX(calc(50% - 6px))" }}
                      >
                        <p className="text-white text-sm text-left leading-tight">
                          {t("tooltip")}
                        </p>
                      </div>
                      {/* Triangle pointer */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                        <Image
                          src="/black_triangle_down.svg"
                          alt=""
                          width={12}
                          height={8}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit/Delete buttons in top-right corner */}
              <div className="absolute top-3 right-3 z-20 flex gap-2">
                <button
                  onClick={() => handleEditClick(catalog)}
                  className="bg-[#343434] p-2 hover:bg-[#272727] transition-colors cursor-pointer"
                >
                  <Image
                    src="/edit_yellow.svg"
                    alt={t("editIconAlt")}
                    width={20}
                    height={20}
                  />
                </button>
                <button
                  onClick={(e) => handleDeleteClick(catalog.id, e)}
                  className="bg-[#343434] p-2 hover:bg-[#272727] transition-colors cursor-pointer"
                >
                  <Image
                    src="/yellow_cross.svg"
                    alt={t("deleteIconAlt")}
                    width={20}
                    height={20}
                  />
                </button>
              </div>

              {/* Likes in bottom-right corner */}
              <div className="absolute right-3 bottom-3 flex items-center gap-2 z-10">
                <span className="font-button font-bold text-white text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)]">
                  {catalog.likesCount}
                </span>
                <Image src="/like.svg" alt={t("likeIconAlt")} width={32} height={32} />
              </div>
            </div>

            {/* Catalog title below image */}
            <h3 className="mt-3 font-h6 font-bold text-white text-[length:var(--h6-font-size)] tracking-[var(--h6-letter-spacing)] leading-[var(--h6-line-height)]">
              {catalog.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      <DeleteCatalog
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onDelete={handleDeleteConfirm}
      />

      {/* Add Catalog Modal */}
      <AddCatalog
        isOpen={isAddModalOpen}
        onClose={handleAddCancel}
        onSubmit={handleAddCatalog}
      />

      {/* Edit Catalog Modal */}
      <AddCatalog
        key={editingCatalog?.id ?? "edit"}
        isOpen={editingCatalog !== null}
        onClose={handleEditCancel}
        onSubmit={handleEditCatalog}
        initialData={
          editingCatalog
            ? {
                titleUk: editingCatalog.titleUk,
                titleEn: editingCatalog.titleEn,
                artCategory: editingCatalog.artCategory ?? "",
                artSubcategory: editingCatalog.artSubcategory,
                categoryLabel: editingCatalog.categoryLabel,
                imageUrl: editingCatalog.imageUrl,
                pdfUrl: editingCatalog.pdfUrl,
              }
            : undefined
        }
      />
    </section>
  );
}
