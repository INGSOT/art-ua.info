import axios from "axios";
import { storage } from "../storage";

// Получаем API ключ из переменных окружения
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://save-art.ddev.site";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

// Добавляем Bearer токен и API ключ к каждому запросу
api.interceptors.request.use((config) => {
  const token = storage.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (API_KEY) {
    config.headers["X-Api-Key"] = API_KEY;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.remove("token");
    }
    return Promise.reject(error);
  }
);

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  slug: string;
  role?: string;
  profile_type?: string | null;
  avatar_url?: string | null;
  created_at?: string;
}

interface AuthResponse {
  message: string;
  user: AuthUser;
  token: string;
}

export const authAPI = {
  login: async (email: string, password: string, device_name = "Web Browser"): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/v1/auth/login", { email, password, device_name });
    return response.data;
  },

  register: async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
    device_name = "Web Browser"
  ): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/v1/auth/register", {
      name,
      email,
      password,
      password_confirmation,
      device_name,
    });
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await api.post("/v1/auth/logout");
    return response.data;
  },

  getMe: async (): Promise<{ user: AuthUser }> => {
    const response = await api.get("/v1/auth/me");
    return response.data;
  },

  forgotPassword: async (email: string, locale?: string): Promise<{ message: string }> => {
    const response = await api.post("/v1/auth/forgot-password", { email, locale });
    return response.data;
  },

  resetPassword: async (
    token: string,
    email: string,
    password: string,
    password_confirmation: string
  ): Promise<{ message: string }> => {
    const response = await api.post("/v1/auth/reset-password", {
      token,
      email,
      password,
      password_confirmation,
    });
    return response.data;
  },
};

export default api;
