"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import AddProjectCover from "../create-project/AddProjectCover";
import { myServicesAPI } from "../../../../lib/api/myServices";
import { withProfileId } from "../../../../lib/authorQuery";
import { useProfileView } from "../../ProfileViewContext";
import { getApiErrorMessage, getApiFieldErrors } from "../../../../lib/apiError";

interface ServiceFormProps {
  mode?: "create" | "edit";
}

interface Option {
  id: string;
  nameUa: string;
  nameEn: string;
}

type CurrencyId = "hryvnia" | "dollar" | "euro";

const CURRENCY_TO_CODE: Record<CurrencyId, "UAH" | "USD" | "EUR"> = {
  hryvnia: "UAH",
  dollar: "USD",
  euro: "EUR",
};

const CODE_TO_CURRENCY: Record<string, CurrencyId> = {
  UAH: "hryvnia",
  USD: "dollar",
  EUR: "euro",
};

export default function ServiceForm({ mode = "create" }: ServiceFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("slug");
  const { slug: profileSlug } = useProfileView();

  const [serviceCover, setServiceCover] = useState<string | null>(null);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [serviceNameUa, setServiceNameUa] = useState("");
  const [serviceNameEn, setServiceNameEn] = useState("");
  const [priceFrom, setPriceFrom] = useState(false);
  const [priceNegotiable, setPriceNegotiable] = useState(false);
  const [priceAmount, setPriceAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyId | null>(null);
  const [descriptionUa, setDescriptionUa] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [options, setOptions] = useState<Option[]>([
    { id: "1", nameUa: "", nameEn: "" },
  ]);
  const [isFromHovered, setIsFromHovered] = useState(false);
  const [isNegotiableHovered, setIsNegotiableHovered] = useState(false);
  const [isPublishHovered, setIsPublishHovered] = useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const isEditMode = mode === "edit" && !!editSlug;
  const isMissingEditTarget = mode === "edit" && !editSlug;

  useEffect(() => {
    if (!isEditMode || !editSlug) return;
    myServicesAPI
      .show(editSlug)
      .then((service) => {
        setServiceCover(service.imageUrl);
        setServiceNameUa(service.titleUk);
        setServiceNameEn(service.titleEn);
        setPriceNegotiable(service.price === null);
        setPriceAmount(service.price !== null ? String(service.price) : "");
        setSelectedCurrency(service.currency ? CODE_TO_CURRENCY[service.currency] ?? null : null);
        setDescriptionUa(service.descriptionUk);
        setDescriptionEn(service.descriptionEn);
        if (service.options.length > 0) {
          setOptions(
            service.options.map((option, index) => ({
              id: String(index + 1),
              nameUa: option.nameUk,
              nameEn: option.nameEn,
            }))
          );
        }
      })
      .catch(() => setError("Не вдалося завантажити послугу"));
  }, [isEditMode, editSlug]);

  const currencies: { id: CurrencyId; icon: string }[] = [
    { id: 'hryvnia', icon: '/hryvnia.svg' },
    { id: 'dollar', icon: '/dollar.svg' },
    { id: 'euro', icon: '/euro.svg' },
  ];

  const clearFieldErrors = (keys: string[]) => {
    setFieldErrors((prev) => {
      if (!keys.some((key) => key in prev)) return prev;
      const next = { ...prev };
      keys.forEach((key) => delete next[key]);
      return next;
    });
  };

  const addOption = () => {
    const newId = (options.length + 1).toString();
    setOptions([...options, { id: newId, nameUa: "", nameEn: "" }]);
  };

  const updateOption = (id: string, field: "nameUa" | "nameEn", value: string) => {
    setOptions(options.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt)));
    setFieldErrors((prev) => {
      const keys = Object.keys(prev).filter((key) => key.startsWith("options."));
      if (keys.length === 0) return prev;
      const next = { ...prev };
      keys.forEach((key) => delete next[key]);
      return next;
    });
  };

  const deleteOption = (id: string) => {
    if (options.length > 1) {
      setOptions(options.filter((opt) => opt.id !== id));
    }
  };

  const moveOption = (id: string, direction: "up" | "down") => {
    const index = options.findIndex((opt) => opt.id === id);
    if (
      (direction === "up" && index > 0) ||
      (direction === "down" && index < options.length - 1)
    ) {
      const newOptions = [...options];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      [newOptions[index], newOptions[targetIndex]] = [
        newOptions[targetIndex],
        newOptions[index],
      ];
      setOptions(newOptions);
    }
  };

  const handlePublish = async () => {
    setError(null);
    setFieldErrors({});
    if (!serviceNameUa.trim()) {
      setFieldErrors({ "title.uk": ["Вкажіть назву послуги"] });
      return;
    }

    const payload = {
      titleUk: serviceNameUa.trim(),
      titleEn: serviceNameEn.trim() || undefined,
      descriptionUk: descriptionUa.trim() || undefined,
      descriptionEn: descriptionEn.trim() || undefined,
      image: serviceCover,
      price: priceNegotiable ? null : priceAmount ? Number(priceAmount) : null,
      currency: selectedCurrency ? CURRENCY_TO_CODE[selectedCurrency] : null,
      options: options.map((opt) => ({ nameUk: opt.nameUa, nameEn: opt.nameEn || undefined })),
    };

    try {
      if (isEditMode && editSlug) {
        await myServicesAPI.update(editSlug, payload);
      } else {
        await myServicesAPI.create(payload);
      }
      router.push(withProfileId("/profile/services", profileSlug));
    } catch (err) {
      const errors = getApiFieldErrors(err);
      if (errors) setFieldErrors(errors);
      setError(getApiErrorMessage(err, "Не вдалося зберегти послугу"));
    }
  };

  const handleDelete = async () => {
    if (!isEditMode || !editSlug) return;
    try {
      await myServicesAPI.remove(editSlug);
      router.push(withProfileId("/profile/services", profileSlug));
    } catch {
      setError("Не вдалося видалити послугу");
    }
  };

  const imageError = fieldErrors.image?.[0];
  const titleUaError = fieldErrors["title.uk"]?.[0] || fieldErrors.title?.[0];
  const titleEnError = fieldErrors["title.en"]?.[0];
  const priceError = fieldErrors.price?.[0];
  const currencyError = fieldErrors.currency?.[0];
  const descriptionUaError = fieldErrors["description.uk"]?.[0];
  const descriptionEnError = fieldErrors["description.en"]?.[0];
  const optionsError = Object.entries(fieldErrors).find(([key]) => key.startsWith("options."))?.[1]?.[0];

  if (isMissingEditTarget) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-10 bg-[#414141] min-h-screen">
        <p className="text-white">Послугу не знайдено</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-10 md:px-10 lg:px-[75px] bg-[#414141] min-h-screen">
      {error && (
        <div className="w-full max-w-[1000px] bg-red-900/40 border border-red-500 text-white px-4 py-3">
          {error}
        </div>
      )}
      <form className="flex flex-col items-center gap-8 w-full max-w-[1000px]">
        {/* Cover Upload */}
        <div className="w-full flex flex-col items-center gap-2">
          <div
            onClick={() => !serviceCover && setIsCoverModalOpen(true)}
            className={`relative flex flex-col items-center justify-center gap-4 w-[400px] h-[400px] bg-[#343434] transition-colors ${
              !serviceCover ? "cursor-pointer hover:bg-[#3a3a3a]" : ""
            } ${imageError ? "border-2 border-red-500" : ""}`}
          >
            {serviceCover ? (
              <>
                <Image
                  src={serviceCover}
                  alt="Service cover"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCoverModalOpen(true);
                  }}
                  className="absolute top-4 right-4 w-12 h-12 bg-[#343434] flex items-center justify-center hover:bg-[#414141] transition-colors z-10"
                >
                  <Image
                    src="/yellow_cross.svg"
                    alt="Edit"
                    width={24}
                    height={24}
                  />
                </button>
              </>
            ) : (
              <>
                <Image src="/upload.svg" alt="upload" width={48} height={48} />
                <p className="text-white text-center">
                  Додайте обкладинку<br />(обов&apos;язково)
                </p>
              </>
            )}
          </div>
          {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
        </div>

        {/* Service Name */}
        <div className="w-full flex flex-col gap-2">
          <label className="font-wix text-white text-sm">Назва послуги</label>
          <div className={`relative ${titleUaError ? "border-2 border-red-500" : ""}`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Image src="/ua.svg" alt="UA" width={24} height={24} />
            </div>
            <input
              type="text"
              value={serviceNameUa}
              onChange={(e) => {
                setServiceNameUa(e.target.value);
                clearFieldErrors(["title.uk", "title"]);
              }}
              placeholder="Вкажіть повну назву послуги"
              className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
            />
          </div>
          {titleUaError && <p className="text-red-500 text-sm">{titleUaError}</p>}
          <div className={`relative ${titleEnError ? "border-2 border-red-500" : ""}`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Image src="/en.svg" alt="EN" width={24} height={24} />
            </div>
            <input
              type="text"
              value={serviceNameEn}
              onChange={(e) => {
                setServiceNameEn(e.target.value);
                clearFieldErrors(["title.en"]);
              }}
              placeholder="Please specify the full name of the service"
              className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
            />
          </div>
          {titleEnError && <p className="text-red-500 text-sm">{titleEnError}</p>}
        </div>

        {/* Cost Section */}
        <div className="w-full flex flex-col gap-4">
          <h2 className="text-white text-[20px] font-bold">Вартість</h2>

          {/* Price From */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setPriceFrom(!priceFrom)}
              onMouseEnter={() => setIsFromHovered(true)}
              onMouseLeave={() => setIsFromHovered(false)}
              className="flex items-center gap-3 px-4 py-3 bg-[#343434] h-[50px]"
            >
              <div
                className={`w-5 h-5 flex items-center justify-center transition-colors ${
                  priceFrom ? "bg-[#FFD700]" : "bg-[#414141]"
                }`}
              >
                <Image
                  src={isFromHovered && !priceFrom ? "/yellow_check.svg" : "/grey_check.svg"}
                  alt="check"
                  width={12}
                  height={12}
                />
              </div>
              <span
                className={`font-bold transition-colors ${
                  priceFrom || isFromHovered ? "text-[#FFD700]" : "text-white"
                }`}
              >
                Від
              </span>
            </button>

            <input
              type="text"
              value={priceAmount}
              onChange={(e) => {
                setPriceAmount(e.target.value);
                clearFieldErrors(["price"]);
              }}
              placeholder="Вкажіть суму"
              className={`font-wix w-[566px] h-[50px] bg-[#343434] text-white px-4 placeholder-[#A0A0A0] ${
                priceError ? "border-2 border-red-500" : ""
              }`}
            />

            {/* Currency Selector */}
            <div className={`flex gap-4 ${currencyError ? "border-2 border-red-500" : ""}`}>
              {currencies.map((currency) => (
                <button
                  key={currency.id}
                  type="button"
                  onClick={() => {
                    clearFieldErrors(["currency"]);
                    if (selectedCurrency === currency.id) {
                      setSelectedCurrency(null);
                    } else {
                      setSelectedCurrency(currency.id);
                    }
                  }}
                  className={`w-[100px] h-[50px] flex items-center justify-center transition-colors group ${
                    selectedCurrency === currency.id
                      ? "bg-[#FECC39]"
                      : "bg-[#343434] hover:bg-[#FECC39]"
                  }`}
                >
                  <Image
                    src={currency.icon}
                    alt="Currency"
                    width={48}
                    height={48}
                    style={{
                      filter: selectedCurrency === currency.id 
                        ? "brightness(0) saturate(100) invert(0.2)"
                        : "none"
                    }}
                    className="transition-all group-hover:brightness-0"
                  />
                </button>
              ))}
            </div>
          </div>
          {(priceError || currencyError) && (
            <p className="text-red-500 text-sm">{priceError || currencyError}</p>
          )}

          {/* Or divider */}
          <div className="flex justify-center">
            <span className="font-wix text-white">або</span>
          </div>

          {/* Negotiable Price */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setPriceNegotiable(!priceNegotiable)}
              onMouseEnter={() => setIsNegotiableHovered(true)}
              onMouseLeave={() => setIsNegotiableHovered(false)}
              className="flex items-center gap-3 px-4 py-3 bg-[#343434] h-[60px] w-[222px]"
            >
            <div
              className={`w-5 h-5 flex items-center justify-center transition-colors ${
                priceNegotiable ? "bg-[#FFD700]" : "bg-[#414141]"
              }`}
            >
              <Image
                src={
                  isNegotiableHovered && !priceNegotiable
                    ? "/yellow_check.svg"
                    : "/grey_check.svg"
                }
                alt="check"
                width={12}
                height={12}
              />
            </div>
            <span
              className={`font-bold transition-colors ${
                priceNegotiable || isNegotiableHovered ? "text-[#FFD700]" : "text-white"
              }`}
            >
              Ціна договірна
            </span>
            </button>
          </div>
        </div>

        {/* Service Description */}
        <div className="w-full flex flex-col gap-2">
          <label className="font-wix text-white text-sm">Опис послуги</label>
          <div className="relative">
            <div className="absolute left-4 top-4">
              <Image src="/ua.svg" alt="UA" width={24} height={24} />
            </div>
            <textarea
              value={descriptionUa}
              onChange={(e) => {
                setDescriptionUa(e.target.value);
                clearFieldErrors(["description.uk"]);
              }}
              placeholder="Детально опишіть послугу"
              className={`font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0] resize-none ${
                descriptionUaError ? "border-2 border-red-500" : ""
              }`}
              style={{ width: "1000px", height: "180px" }}
            />
          </div>
          {descriptionUaError && <p className="text-red-500 text-sm">{descriptionUaError}</p>}
          <div className="relative">
            <div className="absolute left-4 top-4">
              <Image src="/en.svg" alt="EN" width={24} height={24} />
            </div>
            <textarea
              value={descriptionEn}
              onChange={(e) => {
                setDescriptionEn(e.target.value);
                clearFieldErrors(["description.en"]);
              }}
              placeholder="Describe the service in detail"
              className={`font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0] resize-none ${
                descriptionEnError ? "border-2 border-red-500" : ""
              }`}
              style={{ width: "1000px", height: "180px" }}
            />
          </div>
          {descriptionEnError && <p className="text-red-500 text-sm">{descriptionEnError}</p>}
        </div>

        {/* Options Section */}
        <div className="w-full flex flex-col gap-6">
          <h2 className="text-white text-[20px] font-bold">Опції</h2>
          {optionsError && <p className="text-red-500 text-sm">{optionsError}</p>}

          {options.map((option, index) => (
            <div key={option.id} className="flex gap-4">
              {/* Input fields container */}
              <div className="flex-1 flex flex-col gap-4">
                {/* Ukrainian input */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Image src="/ua.svg" alt="UA" width={24} height={24} />
                  </div>
                  <input
                    type="text"
                    value={option.nameUa}
                    onChange={(e) => updateOption(option.id, "nameUa", e.target.value)}
                    placeholder="Назва опції"
                    className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
                  />
                </div>
                {/* English input */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Image src="/en.svg" alt="EN" width={24} height={24} />
                  </div>
                  <input
                    type="text"
                    value={option.nameEn}
                    onChange={(e) => updateOption(option.id, "nameEn", e.target.value)}
                    placeholder="Option name"
                    className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
                  />
                </div>
              </div>

              {/* Control buttons - vertical layout */}
              {options.length > 1 && (
                <div className="flex flex-col justify-center gap-1 bg-[#343434] px-2 h-full">
                  <button
                    type="button"
                    onClick={() => moveOption(option.id, "up")}
                    disabled={index === 0}
                    className="w-[40px] h-[36px] flex items-center justify-center hover:bg-[#414141] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Image
                      src="/yellow_triangle_up.svg"
                      alt="Move up"
                      width={20}
                      height={20}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveOption(option.id, "down")}
                    disabled={index === options.length - 1}
                    className="w-[40px] h-[36px] flex items-center justify-center hover:bg-[#414141] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Image
                      src="/yellow_triangle_down.svg"
                      alt="Move down"
                      width={20}
                      height={20}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteOption(option.id)}
                    className="w-[40px] h-[36px] flex items-center justify-center hover:bg-[#414141] transition-colors"
                  >
                    <Image
                      src="/yellow_cross.svg"
                      alt="Delete"
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add Option Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={addOption}
              className="w-[60px] h-[60px] bg-[#FECC39] flex items-center justify-center hover:bg-[#ffd557] transition-colors"
            >
              <Image src="/plus.svg" alt="add" width={24} height={24} />
            </button>
          </div>
        </div>

        {/* Publish / Save Button */}
        <button
          type="button"
          onClick={handlePublish}
          onMouseEnter={() => setIsPublishHovered(true)}
          onMouseLeave={() => setIsPublishHovered(false)}
          className={`w-[300px] h-[60px] flex items-stretch transition-all duration-300 ${
            isPublishHovered ? "bg-white" : "bg-[#FECC39]"
          }`}
        >
          <span className="flex items-center justify-center flex-1 px-6 font-bold text-[#343434]">
            {isEditMode ? "Зберегти" : "Опублікувати"}
          </span>
          <div className="flex items-center justify-center w-[60px] border-l border-[#343434]">
            <Image
              src="/grey_check.svg"
              alt="Publish"
              width={20}
              height={20}
            />
          </div>
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={handleDelete}
          onMouseEnter={() => setIsDeleteHovered(true)}
          onMouseLeave={() => setIsDeleteHovered(false)}
          className={`w-[300px] h-[60px] flex items-stretch transition-all duration-300 ${
            isDeleteHovered ? "bg-[#FECC39]" : "bg-[#343434]"
          }`}
        >
          <span
            className={`flex items-center justify-center flex-1 px-6 font-bold transition-colors ${
              isDeleteHovered ? "text-[#343434]" : "text-[#FECC39]"
            }`}
          >
            Видалити
          </span>
          <div
            className={`flex items-center justify-center w-[60px] border-l transition-colors ${
              isDeleteHovered ? "border-[#343434]" : "border-[#FECC39]"
            }`}
          >
            <Image
              src={isDeleteHovered ? "/black_cross.svg" : "/yellow_cross.svg"}
              alt="Delete"
              width={24}
              height={24}
            />
          </div>
        </button>
      </form>

      {/* Add Project Cover Modal */}
      <AddProjectCover
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        onImageSelect={(imageUrl) => {
          setServiceCover(imageUrl);
          clearFieldErrors(["image"]);
        }}
        onImageRemove={() => setServiceCover(null)}
        currentImage={serviceCover}
        customTitle="Додайте обкладинку"
      />
    </div>
  );
}
