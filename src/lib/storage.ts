/**
 * SSR-safe обёртка над localStorage.
 * Порт save-art/src/utils/storage.js (только нужные методы).
 */

export const isBrowser = typeof window !== "undefined";

export const storage = {
  get(key: string, defaultValue: string | null = null): string | null {
    if (!isBrowser) return defaultValue;
    try {
      const value = localStorage.getItem(key);
      return value !== null ? value : defaultValue;
    } catch (e) {
      console.warn("localStorage.get error:", e);
      return defaultValue;
    }
  },

  set(key: string, value: string): void {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("localStorage.set error:", e);
    }
  },

  remove(key: string): void {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("localStorage.remove error:", e);
    }
  },
};

export default storage;
