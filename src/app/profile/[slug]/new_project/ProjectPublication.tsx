"use client";

import { useState } from "react";
import Image from "next/image";
import { newProjectTexts } from "../../../../data/newProjectData";
import Message from "../../../../components/Message";

export default function ProjectPublication() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isTermsHovered, setIsTermsHovered] = useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
  const [isDraftHovered, setIsDraftHovered] = useState(false);
  const [isPublishHovered, setIsPublishHovered] = useState(false);
  const [notification, setNotification] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous notification
    setNotification(null);

    // Get project data from localStorage (populated by ProjectCreating)
    const projectDataStr = typeof window !== 'undefined' ? localStorage.getItem('projectData') : null;
    
    if (!projectDataStr) {
      setNotification({ type: "error", text: "Помилка: дані проекту не знайдені" });
      return;
    }

    try {
      const projectData = JSON.parse(projectDataStr);

      // Validation 1: Check if owner is selected
      if (!projectData.selectedOwner) {
        setNotification({ type: "error", text: "Оберіть власника проекту" });
        return;
      }

      // Validation 2: Check if project name is filled in both languages
      if (!projectData.projectNameUa?.trim() || !projectData.projectNameEn?.trim()) {
        setNotification({ type: "error", text: "Введіть назву проекту" });
        return;
      }

      // Validation 3: Check if both Ukrainian and English names are filled
      if (!projectData.projectNameUa?.trim() && projectData.projectNameEn?.trim()) {
        setNotification({ type: "error", text: "Заповніть назву українською" });
        return;
      }

      if (projectData.projectNameUa?.trim() && !projectData.projectNameEn?.trim()) {
        setNotification({ type: "error", text: "Заповніть назву англійською" });
        return;
      }

      // Validation 4: Check if art field (genre) is selected
      if (!projectData.selectedArtField) {
        setNotification({ type: "error", text: "Оберіть жанр проекту" });
        return;
      }

      // Validation 5: Check if at least one work element is added
      const hasWorkContent = projectData.workImage || projectData.workVideoUrl || (projectData.galleryImages && projectData.galleryImages.length > 0);
      if (!hasWorkContent) {
        setNotification({ type: "error", text: "Додайте роботу" });
        return;
      }

      // Validation 6: Check if terms are accepted
      if (!acceptedTerms) {
        setNotification({ type: "error", text: "Прийміть умови публікації" });
        return;
      }

      // All validations passed, submit form to server
      // В fetch нужно ввести URL, который будет обрабатывать запрос формы на сервере
      const response = await fetch('', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        setNotification({ type: "success", text: "Проект відправлено на модерацію" });
        // Clear localStorage and reset form
        localStorage.removeItem('projectData');
        setAcceptedTerms(false);
        console.log("Project submitted successfully");
      } else {
        setNotification({ type: "error", text: "Помилка при надіслані проекту" });
        console.error("Project submission failed with status:", response.status);
      }
    } catch (error) {
      setNotification({ type: "error", text: "Помилка при надіслані проекту" });
      console.error("Project submission error:", error);
    }
  };

  return (
    <section className="w-full bg-[#FFFCF5] flex flex-col items-center py-10 px-4 md:px-10 lg:px-[75px] border-b border-black">
      {notification && (
        <Message
          type={notification.type}
          message={notification.text}
          onClose={() => setNotification(null)}
        />
      )}
      <form onSubmit={handlePublish} className="flex flex-col items-center w-full">
      {/* Accept Terms Checkbox */}
      <button
        type="button"
        onClick={() => setAcceptedTerms(!acceptedTerms)}
        onMouseEnter={() => setIsTermsHovered(true)}
        onMouseLeave={() => setIsTermsHovered(false)}
        className="flex items-center gap-3 px-6 py-4 bg-[#343434] min-h-[60px] mb-6"
      >
        {/* Checkmark */}
        <div
          className={`w-5 h-5 flex-shrink-0 flex items-center justify-center transition-colors ${
            acceptedTerms ? "bg-[#FFD700]" : "bg-[#414141]"
          }`}
        >
          <Image
            src={isTermsHovered && !acceptedTerms ? "/yellow_check.svg" : "/grey_check.svg"}
            alt="check"
            width={12}
            height={12}
          />
        </div>

        {/* Label */}
        <span
          className={`font-bold transition-colors text-center md:text-left ${
            acceptedTerms || isTermsHovered ? "text-[#FECC39]" : "text-white"
          }`}
        >
          {newProjectTexts.acceptTermsLabel}
        </span>
      </button>

      {/* Publication Notice */}
      <p className="text-black text-center mb-8 max-w-4xl">
        {newProjectTexts.publicationNotice}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-[1000px] justify-between">
        {/* Delete Button */}
        <button
          type="button"
          onMouseEnter={() => setIsDeleteHovered(true)}
          onMouseLeave={() => setIsDeleteHovered(false)}
          className={`h-[60px] flex items-stretch transition-all duration-300 w-full md:flex-1 ${
            isDeleteHovered ? "bg-[#FECC39]" : "bg-[#343434]"
          }`}
        >
          <span
            className={`flex items-center justify-center flex-1 px-6 font-bold whitespace-nowrap transition-colors ${
              isDeleteHovered ? "text-[#343434]" : "text-[#FECC39]"
            }`}
          >
            {newProjectTexts.deleteButton}
          </span>
          <div
            className={`flex items-center justify-center w-[60px] flex-shrink-0 border-l transition-colors ${
              isDeleteHovered ? "border-[#343434]" : "border-[#FECC39]"
            }`}
          >
            <Image
              src={isDeleteHovered ? "/black_cross.svg" : "/yellow_cross.svg"}
              alt="Delete"
              width={24}
              height={24}
            />
          </div>
        </button>

        {/* Save Draft Button */}
        <button
          type="button"
          onMouseEnter={() => setIsDraftHovered(true)}
          onMouseLeave={() => setIsDraftHovered(false)}
          className={`h-[60px] flex items-stretch transition-all duration-300 w-full md:flex-1 ${
            isDraftHovered ? "bg-[#FECC39]" : "bg-[#343434]"
          }`}
        >
          <span
            className={`flex items-center justify-center flex-1 px-6 font-bold whitespace-nowrap transition-colors ${
              isDraftHovered ? "text-[#343434]" : "text-[#FECC39]"
            }`}
          >
            {newProjectTexts.saveDraftButton}
          </span>
          <div
            className={`flex items-center justify-center w-[60px] h-[60px] flex-shrink-0 border-l transition-colors ${
              isDraftHovered ? "border-[#343434]" : "border-[#FECC39]"
            }`}
          >
            <Image
              src={isDraftHovered ? "/black_draft.svg" : "/yellow_draft.svg"}
              alt="Draft"
              width={20}
              height={20}
            />
          </div>
        </button>

        {/* Publish Button */}
        <button
          type="submit"
          onMouseEnter={() => setIsPublishHovered(true)}
          onMouseLeave={() => setIsPublishHovered(false)}
          className={`h-[60px] flex items-stretch transition-all duration-300 w-full md:flex-1 ${
            isPublishHovered ? 'bg-white' : 'bg-[#FECC39]'
          }`}
        >
          <span className="flex items-center justify-center flex-1 px-6 font-bold text-[#343434] whitespace-nowrap">
            {newProjectTexts.publishButton}
          </span>
          <div className="flex items-center justify-center w-[60px] flex-shrink-0 border-l border-[#343434]">
            <Image
              src="/grey_check.svg"
              alt="Publish"
              width={20}
              height={20}
            />
          </div>
        </button>
      </div>
      </form>
    </section>
  );
}
