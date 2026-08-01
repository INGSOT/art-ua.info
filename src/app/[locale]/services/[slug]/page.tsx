"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Message from "../../../../components/Message";
import { publicServicesAPI, type PublicService, type ServiceCurrency } from "../../../../lib/api/publicServices";
import { withAuthorId, withTeamId } from "../../../../lib/authorQuery";
import { getApiErrorMessage } from "../../../../lib/apiError";

type ServiceDetailTranslations = ReturnType<typeof useTranslations>;

function getFormFields(t: ServiceDetailTranslations) {
  return [
    { id: "name", label: t("nameLabel"), placeholder: t("namePlaceholder"), type: "text" as const },
    { id: "email", label: t("emailLabel"), placeholder: t("emailPlaceholder"), type: "email" as const },
    { id: "phone", label: t("phoneLabel"), placeholder: t("phonePlaceholder"), type: "tel" as const },
    { id: "message", label: t("messageLabel"), placeholder: t("messagePlaceholder"), type: "textarea" as const, rows: 5 },
  ];
}

const CURRENCY_ICON: Record<ServiceCurrency, string> = {
  UAH: "/hryvnia.svg",
  USD: "/dollar.svg",
  EUR: "/euro.svg",
};

export default function ServicePage() {
  const t = useTranslations("Services.detail");
  const params = useParams<{ slug?: string }>();
  const slug = typeof params?.slug === "string" ? params.slug : undefined;

  const [service, setService] = useState<PublicService | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let ignore = false;

    const fetchService = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await publicServicesAPI.show(slug);
        if (!ignore) setService(data);
      } catch {
        if (!ignore) setNotFound(true);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchService();

    return () => {
      ignore = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header isHomePage={false} />
        <div className="w-full min-h-[420px] flex items-center justify-center bg-[#414141]">
          <p className="font-wix text-white text-lg md:text-2xl">{t("loading")}</p>
        </div>
        <Footer />
      </>
    );
  }

  if (notFound || !service) {
    return (
      <>
        <Header isHomePage={false} />
        <div className="w-full min-h-[420px] flex items-center justify-center bg-[#414141]">
          <p className="font-wix text-white text-lg md:text-2xl">{t("notFound")}</p>
        </div>
        <Footer />
      </>
    );
  }

  const authorHref = !service.performerSlug
    ? null
    : service.performerType === "team"
      ? withTeamId("/team/projects", service.performerSlug)
      : withAuthorId("/author/projects", service.performerSlug);

  const formattedPrice =
    typeof service.price === "number" ? service.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "";

  return (
    <>
      <Header isHomePage={false} />
      <div className="flex flex-col lg:flex-row w-full">
        {/* Photo */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="relative w-full aspect-[512/512]">
            <Image src={service.image || "/masks.svg"} alt={service.title} fill className="object-cover" />
          </div>
          <div className="w-full flex-1 bg-[#414141]" />
        </div>

        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Description */}
          <div className="w-full bg-[#FFFCF5] p-8 lg:p-12">
            <div className="flex items-center gap-2 mb-6 text-sm">
              {authorHref ? (
                <Link href={authorHref} className="text-black hover:underline">
                  {service.performerName}
                </Link>
              ) : (
                <span className="text-black">{service.performerName}</span>
              )}
              <span className="text-black">/</span>
              <span className="text-black">{t("breadcrumbServices")}</span>
            </div>

            <h1 className="text-black font-bold text-[40px] leading-tight mb-6" style={{ fontWeight: 600 }}>
              {service.title}
            </h1>

            <div
              className="bg-[#FECC39] text-black font-bold px-6 py-3 mb-6 flex items-center justify-center whitespace-nowrap w-fit"
              style={{ minHeight: "48px", fontWeight: 600 }}
            >
              {service.price === null ? (
                t("priceNegotiable")
              ) : (
                <span className="flex items-center gap-2">
                  {service.priceFrom && <span>{t("priceFrom")}</span>}
                  <span>{formattedPrice}</span>
                  {service.currency && (
                    <Image
                      src={CURRENCY_ICON[service.currency]}
                      alt={service.currency}
                      width={24}
                      height={24}
                      className="-ml-2"
                    />
                  )}
                </span>
              )}
            </div>

            <div className="text-black space-y-4">
              {service.description
                .split("\n")
                .filter((paragraph) => paragraph.trim())
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          </div>

          <OrderForm slug={service.slug} options={service.options} t={t} />
        </div>
      </div>
      <Footer />
    </>
  );
}

function OrderForm({
  slug,
  options,
  t,
}: {
  slug: string;
  options: string[];
  t: ServiceDetailTranslations;
}) {
  const FORM_FIELDS = useMemo(() => getFormFields(t), [t]);
  const optionItems = useMemo(() => options.map((label, index) => ({ id: String(index), label })), [options]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});
  const [hoveredOptions, setHoveredOptions] = useState<Record<string, boolean>>({});
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setHovered = (id: string, hovered: boolean) => {
    setHoveredOptions((prev) => ({ ...prev, [id]: hovered }));
  };

  const handleInputChange = (id: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (optionItems.length > 0 && !Object.values(selectedOptions).some(Boolean)) {
      setNotification({ type: "error", text: t("selectOption") });
      return;
    }

    const allFieldsFilled = FORM_FIELDS.every((field) => formValues[field.id]?.trim());
    if (!allFieldsFilled) {
      setNotification({ type: "error", text: t("fillAllFields") });
      return;
    }

    const nameField = formValues["name"];
    if (nameField && /\d/.test(nameField)) {
      setNotification({ type: "error", text: t("nameNoDigits") });
      return;
    }

    const emailField = formValues["email"];
    if (emailField && !emailField.includes("@")) {
      setNotification({ type: "error", text: t("emailMustContainAt") });
      return;
    }

    const phoneField = formValues["phone"];
    if (phoneField && !/^\d+$/.test(phoneField)) {
      setNotification({ type: "error", text: t("phoneDigitsOnly") });
      return;
    }

    const selectedLabels = optionItems.filter((option) => selectedOptions[option.id]).map((option) => option.label);

    setIsSubmitting(true);
    try {
      await publicServicesAPI.order(slug, {
        name: nameField,
        email: emailField,
        phone: phoneField || undefined,
        message: formValues["message"],
        options: selectedLabels,
      });
      setNotification({ type: "success", text: t("requestSent") });
      setSelectedOptions({});
      setFormValues({});
    } catch (error) {
      setNotification({ type: "error", text: getApiErrorMessage(error, t("requestSendFailed")) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#414141] p-8 lg:p-12">
      {notification && (
        <Message type={notification.type} message={notification.text} onClose={() => setNotification(null)} />
      )}
      <form onSubmit={validateForm}>
        <h2 className="text-white font-bold text-2xl mb-6">{t("orderTitle")}</h2>

        {optionItems.length > 0 && (
          <div className="flex flex-col gap-4 mb-6">
            {optionItems.map((option) => {
              const isSelected = selectedOptions[option.id];
              const isHovered = hoveredOptions[option.id];

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleOption(option.id)}
                  onMouseEnter={() => setHovered(option.id, true)}
                  onMouseLeave={() => setHovered(option.id, false)}
                  className="w-full h-[50px] bg-[#343434] flex items-center gap-3 px-4 transition-colors"
                >
                  <div
                    className={`w-5 h-5 flex items-center justify-center transition-colors ${
                      isSelected ? "bg-[#FFD700]" : "bg-[#414141]"
                    }`}
                  >
                    <Image
                      src={isHovered && !isSelected ? "/yellow_check.svg" : "/grey_check.svg"}
                      alt="check"
                      width={12}
                      height={12}
                    />
                  </div>
                  <span
                    className={`flex-1 text-left font-bold text-base transition-colors ${
                      isSelected || isHovered ? "text-[#FFD700]" : "text-white"
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex flex-col gap-6">
          {FORM_FIELDS.map((field) => (
            <div key={field.id} className="flex flex-col gap-2">
              <label className="font-wix text-white text-sm">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  placeholder={field.placeholder}
                  rows={field.rows}
                  value={formValues[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="font-wix w-full bg-[#343434] text-white px-4 py-3 placeholder:text-[#4a4a4a] resize-none"
                />
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formValues[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="font-wix w-full h-[50px] bg-[#343434] text-white px-4 placeholder:text-[#4a4a4a]"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className={`w-full h-[60px] flex items-stretch transition-colors overflow-hidden disabled:opacity-60 ${
              isButtonHovered ? "bg-white" : "bg-[#FECC39]"
            }`}
          >
            <span className="flex items-center justify-center flex-1 px-6 font-bold text-[#343434]">
              {isSubmitting ? t("sending") : t("submit")}
            </span>
            <div className="flex items-center justify-center w-[60px] border-l border-[#343434]">
              <Image src="/grey_triangle_right.svg" alt="Arrow" width={24} height={24} />
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}
