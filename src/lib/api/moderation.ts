import api from "./auth";

interface ModerationActionResponse {
  message: string;
  status?: string;
  status_moderation?: string;
}

// Project::getRouteKeyName() === 'slug', тож {project} у роуті модерації
// резолвиться по slug, як і в решті ендпоінтів проєкту.
export const moderationAPI = {
  startReview: async (slug: string): Promise<ModerationActionResponse> => {
    const response = await api.post<ModerationActionResponse>(
      `/v1/moderation/projects/${slug}/start-review`
    );
    return response.data;
  },

  approve: async (slug: string): Promise<ModerationActionResponse> => {
    const response = await api.post<ModerationActionResponse>(
      `/v1/moderation/projects/${slug}/approve`
    );
    return response.data;
  },

  reject: async (slug: string, reason: string): Promise<ModerationActionResponse> => {
    const response = await api.post<ModerationActionResponse>(
      `/v1/moderation/projects/${slug}/reject`,
      { reason }
    );
    return response.data;
  },

  message: async (slug: string, content: string, subject?: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      `/v1/moderation/projects/${slug}/message`,
      { content, subject }
    );
    return response.data;
  },
};
