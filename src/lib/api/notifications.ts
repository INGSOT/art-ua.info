import api from "./auth";

export type NotificationSource = "notification" | "message";

interface RawLocalizedText {
  uk?: string;
  en?: string;
}

interface RawNotification {
  id: number;
  source: NotificationSource;
  type: string;
  title: RawLocalizedText | null;
  message: RawLocalizedText | null;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

interface NotificationsResponse {
  data: RawNotification[];
}

export interface NotificationItem {
  id: number;
  source: NotificationSource;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

// Бекенд зберігає тексти під ключами "uk"/"en", тоді як локаль фронтенду —
// "ua"/"en", тож напряму зіставити не можна.
function pickLocalized(text: RawLocalizedText | null, locale: string): string {
  const backendLocale = locale === "en" ? "en" : "uk";
  return text?.[backendLocale] ?? text?.uk ?? text?.en ?? "";
}

function mapNotification(raw: RawNotification, locale: string): NotificationItem {
  return {
    id: raw.id,
    source: raw.source,
    type: raw.type,
    title: pickLocalized(raw.title, locale),
    message: pickLocalized(raw.message, locale),
    data: raw.data ?? {},
    isRead: raw.is_read,
    createdAt: raw.created_at,
  };
}

export const notificationsAPI = {
  list: async (locale: string = "ua"): Promise<NotificationItem[]> => {
    const response = await api.get<NotificationsResponse>("/v1/art-ua-info/my/notifications", {
      params: { type: "all", unread_only: false, per_page: 50, page: 1 },
    });
    return response.data.data.map((raw) => mapNotification(raw, locale));
  },

  unreadCount: async (): Promise<number> => {
    const response = await api.get<{ unread_count: number }>("/v1/art-ua-info/my/notifications/unread-count");
    return response.data.unread_count ?? 0;
  },

  markAsRead: async (source: NotificationSource, id: number): Promise<void> => {
    await api.post(`/v1/art-ua-info/my/notifications/${source}/${id}/read`);
  },

  remove: async (source: NotificationSource, id: number): Promise<void> => {
    await api.delete(`/v1/art-ua-info/my/notifications/${source}/${id}`);
  },
};
