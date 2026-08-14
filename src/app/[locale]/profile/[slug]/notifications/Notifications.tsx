"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { notificationsAPI, type NotificationItem } from "../../../../../lib/api/notifications";
import NotificationCard from "./NotificationCard";

// Вкладка показує сповіщення про замовлення послуг і повідомлення від
// адміністрації — решта типів (донати, модерація тощо) сюди навмисно
// не потрапляють, для них є окремі місця в кабінеті.
const VISIBLE_TYPES = ["service_order", "message"];

export default function Notifications() {
  const t = useTranslations("Profile.notifications");
  const locale = useLocale();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    notificationsAPI
      .list(locale)
      .then((items) => {
        const visible = items.filter((item) => VISIBLE_TYPES.includes(item.type));
        if (!cancelled) setNotifications(visible);
        // Позначаємо прочитаними лише ті сповіщення, що показані в цій
        // вкладці, — глобальний "read-all" зачепив би й інші типи (донати,
        // модерацію тощо), які тут не відображаються.
        visible
          .filter((item) => !item.isRead)
          .forEach((item) => {
            notificationsAPI.markAsRead(item.source, item.id).catch(() => {});
          });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const handleClose = async (notification: NotificationItem) => {
    await notificationsAPI.remove(notification.source, notification.id);
    setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
  };

  if (loading) {
    return <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px] min-h-[400px]" />;
  }

  // Непрочитані сповіщення показуються першими (як `order: 0` для .item.new
  // у save-art), решта — у порядку від найновішого, як їх повернув бекенд.
  const sortedNotifications = [...notifications].sort(
    (a, b) => Number(a.isRead) - Number(b.isRead)
  );

  return (
    <section className="w-full bg-[#414141] pt-4 pb-8 px-4 md:px-10 lg:px-[75px] min-h-[400px]">
      {notifications.length > 0 ? (
        <div className="w-full max-w-[1000px] mx-auto flex flex-col gap-10">
          {sortedNotifications.map((notification) => (
            <NotificationCard
              key={`${notification.source}-${notification.id}`}
              notification={notification}
              onClose={() => handleClose(notification)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-10 text-center text-white w-full max-w-[1000px] mx-auto py-16 px-4">
          <div className="w-full max-w-[400px] aspect-[4/3] flex items-center justify-center p-3">
            <Image
              src="/megaphone.svg"
              alt=""
              width={400}
              height={300}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <h2 className="text-white text-xl md:text-3xl font-bold text-center max-w-[600px]">
            {t("empty.title")}
          </h2>
          <p className="font-wix text-white text-base md:text-lg text-center max-w-[600px]">
            {t("empty.subtitle")}
          </p>
        </div>
      )}
    </section>
  );
}
