"use client";

import { useEffect, useState } from "react";
import { applicationsAPI } from "../lib/api/applications";
import { getApiErrorMessage, getApiFieldErrors } from "../lib/apiError";
import { useToast } from "../context/ToastContext";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  disableAnimation?: boolean;
}

export default function ApplicationModal({
  isOpen,
  onClose,
  disableAnimation = false,
}: ApplicationModalProps) {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [about, setAbout] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrors({});
    setIsSubmitting(true);
    try {
      await applicationsAPI.submit({ name, email, phone, about, resume: file });
      showToast("Заявку успішно надіслано!", "green");
      setName("");
      setEmail("");
      setPhone("");
      setAbout("");
      setFile(null);
      onClose();
    } catch (err) {
      const fieldErrors = getApiFieldErrors(err);
      if (fieldErrors) {
        setErrors(
          Object.fromEntries(
            Object.entries(fieldErrors).map(([field, messages]) => [
              field,
              Array.isArray(messages) ? messages[0] : messages,
            ])
          )
        );
      } else {
        showToast(getApiErrorMessage(err, "Не вдалося надіслати заявку"), "red");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div
        className={`fixed right-0 top-0 h-full w-full md:w-[600px] bg-[#414141] z-50 flex flex-col overflow-y-auto ${
          disableAnimation ? "" : "animate-slide-in"
        } scrollbar-hide`}
      >
        <div className="p-6 md:p-[30px] flex-1">
          <div className="flex items-center justify-between">
            <div className="font-bold text-white text-[16px] font-[family-name:var(--font-unbounded)]">
              Заявка
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#343434] transition-colors"
              aria-label="Закрити"
            >
              <img src="/yellow_cross.svg" alt="Закрити" className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-8 w-full border-t border-[#343434]" />

          <form onSubmit={handleSubmit}>
            <div className="mt-8 flex flex-col gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Вкажіть повне ім'я"
                className="font-wix w-full h-[60px] bg-[#343434] px-6 text-white placeholder-[#A0A0A0]"
              />
              {errors.name && (
                <p className="font-wix text-sm text-[#FECC39]">{errors.name}</p>
              )}

              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sample@mail.com"
                className="font-wix w-full h-[60px] bg-[#343434] px-6 text-white placeholder-[#A0A0A0]"
              />
              {errors.email && (
                <p className="font-wix text-sm text-[#FECC39]">{errors.email}</p>
              )}

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Вкажіть номер"
                className="font-wix w-full h-[60px] bg-[#343434] px-6 text-white placeholder-[#A0A0A0]"
              />
              {errors.phone && (
                <p className="font-wix text-sm text-[#FECC39]">{errors.phone}</p>
              )}

              <textarea
                rows={4}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Розкажіть про себе"
                className="font-wix w-full bg-[#343434] px-6 py-4 text-white placeholder-[#A0A0A0] resize-none"
              />
              {errors.about && (
                <p className="font-wix text-sm text-[#FECC39]">{errors.about}</p>
              )}

              <label className="flex items-center justify-between w-full h-[60px] bg-[#343434] px-6 text-white cursor-pointer">
                <span className="font-wix text-sm truncate">
                  {file ? file.name : "Завантажте резюме (не обов'язково)"}
                </span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                {file && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setFile(null);
                    }}
                    aria-label="Видалити файл"
                  >
                    <img src="/yellow_cross.svg" alt="Видалити" className="w-4 h-4" />
                  </button>
                )}
              </label>
              {errors.resume && (
                <p className="font-wix text-sm text-[#FECC39]">{errors.resume}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 w-full h-[60px] bg-[#FECC39] text-[#343434] font-bold text-[16px] hover:bg-white transition-colors disabled:opacity-60"
            >
              {isSubmitting ? "Надсилаємо..." : "Відправити"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
