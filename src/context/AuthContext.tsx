"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { authAPI, AuthUser } from "../lib/api/auth";
import { storage } from "../lib/storage";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  // SSR-safe: ленивая инициализация, чтобы не читать localStorage на сервере
  const [token, setToken] = useState<string | null>(() => storage.get("token"));
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    try {
      const data = await authAPI.getMe();
      setUser(data.user);
    } catch {
      // Токен неверный/просрочен — очищаем локальное состояние
      storage.remove("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadMe();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authAPI.login(email, password);
    storage.set("token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => {
    const data = await authAPI.register(name, email, password, password_confirmation);
    storage.set("token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // токена уже может не быть на сервере — всё равно чистим локально
    } finally {
      storage.remove("token");
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
