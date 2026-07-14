"use client";

import { useToast } from "../context/ToastContext";

export default function Toast() {
  const { toast, hideToast } = useToast();

  return (
    <div
      className={`fixed top-[104px] left-4 right-4 md:left-auto md:right-[30px] md:w-[360px] z-[9999] flex flex-col gap-2.5 p-4 border-b-4 border-black text-white shadow-lg transition-all duration-300 ${
        toast.type === "red" ? "bg-[#ff4433]" : "bg-[#43a96b]"
      } ${toast.show ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-[104px]"}`}
    >
      <div className="flex items-center gap-3">
        <p className="w-full font-semibold">{toast.title || (toast.type === "red" ? "Помилка" : "Успішно")}</p>
        <button
          type="button"
          onClick={hideToast}
          className="shrink-0 w-6 h-6 flex items-center justify-center hover:bg-[#343434] transition-colors"
          aria-label="Закрити"
        >
          <img src="/yellow_cross.svg" alt="" className="w-4 h-4" />
        </button>
      </div>

      <p className="w-full">{toast.message}</p>

      {toast.action && (
        <button
          type="button"
          onClick={() => {
            toast.action?.onClick();
            hideToast();
          }}
          className="self-start px-4 py-2 bg-white text-[#343434] font-bold text-[13px] font-[family-name:var(--font-unbounded)] hover:bg-[#FECC39] transition-colors"
        >
          {toast.action.label}
        </button>
      )}
    </div>
  );
}
