"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";

export type ToastType = "green" | "red";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastState {
  show: boolean;
  message: string;
  title: string;
  type: ToastType;
  action: ToastAction | null;
}

interface ToastContextValue {
  toast: ToastState;
  showToast: (message: string, type?: ToastType, title?: string, action?: ToastAction | null) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const initialToastState: ToastState = { show: false, message: "", title: "", type: "green", action: null };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>(initialToastState);

  const showToast = useCallback(
    (message: string, type: ToastType = "green", title = "", action: ToastAction | null = null) => {
      setToast({ show: true, message, title, type, action });
      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, action ? 6000 : 3000);
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
