import api from "./auth";

export interface ApplicationPayload {
  name: string;
  email: string;
  phone?: string;
  about?: string;
  resume?: File | null;
}

export const applicationsAPI = {
  /** Надіслати заявку на співпрацю (форма "Заявка" у футері сайту) */
  submit: async (data: ApplicationPayload): Promise<void> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    if (data.phone) formData.append("phone", data.phone);
    if (data.about) formData.append("about", data.about);
    if (data.resume) formData.append("resume", data.resume);

    await api.post("/v1/applications", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
