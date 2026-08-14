"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import type { NotificationItem } from "../../../../../lib/api/notifications";

function formatDate(iso: string, locale: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(locale === "ua" ? "uk-UA" : "en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Кожен тип сповіщення має власний акцентний колір і бейдж, щоб картки
// легко відрізнялись одна від одної в загальній стрічці.
const TYPE_ACCENT: Record<string, string> = {
  service_order: "#FECC39",
  message: "#6DB8FF",
};

function ChatIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 4h16v12H7l-3 3V4z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TypeIcon({ type, color }: { type: string; color: string }) {
  if (type === "message") return <ChatIcon color={color} />;
  return (
    <Image src="/yellow_dollar.svg" alt="" width={22} height={22} className="max-w-full max-h-full object-contain" />
  );
}

interface NotificationCardProps {
  notification: NotificationItem;
  onClose: () => Promise<void> | void;
}

export default function NotificationCard({ notification, onClose }: NotificationCardProps) {
  const t = useTranslations("Profile.notifications");
  const locale = useLocale();
  const [deleting, setDeleting] = useState(false);

  const { data, type } = notification;
  const accent = TYPE_ACCENT[type] ?? "#FECC39";

  const handleClose = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await onClose();
    } finally {
      setDeleting(false);
    }
  };

  const serviceSlug = typeof data.service_slug === "string" ? data.service_slug : null;
  const customerName = typeof data.customer_name === "string" ? data.customer_name : null;
  const customerEmail = typeof data.customer_email === "string" ? data.customer_email : null;
  const customerPhone = typeof data.customer_phone === "string" ? data.customer_phone : null;
  const customerMessage = typeof data.customer_message === "string" ? data.customer_message : null;
  const options = Array.isArray(data.options) ? (data.options as string[]) : [];

  const projectSlug = typeof data.project_slug === "string" ? data.project_slug : null;
  const typeLabel = type === "message" ? t("adminMessageLabel") : t("serviceOrderLabel");

  return (
    <div
      className={`relative bg-[#343434] p-6 md:p-[30px] pb-10 flex flex-col md:flex-row gap-4 md:gap-[30px] border transition-colors ${
        notification.isRead ? "border-transparent" : "border-[#FECC39]"
      }`}
    >
      <div
        className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full"
        style={{ backgroundColor: `${accent}26` }}
      >
        <TypeIcon type={type} color={accent} />
      </div>

      <div className="w-full flex flex-col gap-3 text-white">
        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: accent }}>
          {typeLabel}
        </span>

        {notification.title && <h6 className="font-bold text-sm leading-5">{notification.title}</h6>}

        {notification.message && (
          <p className="font-wix text-sm leading-6 text-white/90 whitespace-pre-line">{notification.message}</p>
        )}

        {(customerName || customerEmail || customerPhone || customerMessage) && (
          <div className="font-wix flex flex-col gap-1 text-sm text-white/80">
            {customerName && <span>{t("customerLabel")}: {customerName}</span>}
            {customerEmail && <span>{t("emailLabel")}: {customerEmail}</span>}
            {customerPhone && <span>{t("phoneLabel")}: {customerPhone}</span>}
            {options.length > 0 && <span>{t("optionsLabel")}: {options.join(", ")}</span>}
            {customerMessage && <span>{t("messageLabel")}: {customerMessage}</span>}
          </div>
        )}

        {serviceSlug && (
          <Link href={`/services/${serviceSlug}`} className="w-fit text-[#FECC39] font-bold text-sm hover:text-white">
            {t("viewService")}
          </Link>
        )}

        {type === "message" && projectSlug && (
          <Link href={`/projects/${projectSlug}`} className="w-fit text-[#6DB8FF] font-bold text-sm hover:text-white">
            {t("viewProject")}
          </Link>
        )}

        <time
          className="absolute right-6 md:right-[30px] bottom-4 text-[13px] leading-[18px] text-white/60 whitespace-nowrap"
          dateTime={notification.createdAt}
        >
          {formatDate(notification.createdAt, locale)}
        </time>
      </div>

      <button
        type="button"
        onClick={handleClose}
        disabled={deleting}
        aria-label={t("closeAlt")}
        className="flex-shrink-0 w-6 h-6 flex items-center justify-center md:ml-auto self-start hover:bg-[#FECC39] transition-colors disabled:opacity-50"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="#fff" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.4999 7.99998L15.9999 2.5L13.4999 0L7.99995 5.50012L2.49963 0L0 2.49988L5.50014 8.00002L0 13.5004L2.49988 16L8 10.4999L13.5 15.9999L16 13.4999L10.4999 7.99998Z" />
        </svg>
      </button>
    </div>
  );
}
