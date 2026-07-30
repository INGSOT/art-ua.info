"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { publicCatalogsAPI, type CatalogLikeResponse } from "../../../lib/api/publicCatalogs";

interface CatalogLikeButtonProps {
  catalogId: number;
  initialLikes: number;
  initialIsLiked?: boolean;
  className?: string;
}

export default function CatalogLikeButton({
  catalogId,
  initialLikes,
  initialIsLiked = false,
  className = "",
}: CatalogLikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeLoading, setLikeLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  // Сторінка рендериться на сервері без токена користувача, тож is_liked із
  // SSR-фетчу завжди false. Після визначення авторизації на клієнті
  // довантажуємо актуальний стан лайка (як на сторінці проєкту).
  useEffect(() => {
    if (authLoading || !user) return;

    let cancelled = false;
    publicCatalogsAPI
      .show(catalogId)
      .then((catalog) => {
        if (cancelled) return;
        setIsLiked(catalog.isLiked);
        setLikes(catalog.likes);
      })
      .catch(() => {
        // Не вдалось перевірити стан лайка — залишаємо те, що вже є (з SSR).
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, catalogId]);

  const handleLikeClick = async () => {
    if (likeLoading) return;

    if (!user) {
      showToast("Щоб поставити лайк, потрібно увійти в систему", "red", "Помилка");
      return;
    }

    setLikeLoading(true);
    try {
      const response = isLiked
        ? await publicCatalogsAPI.unlike(catalogId)
        : await publicCatalogsAPI.like(catalogId);
      setIsLiked(response.is_liked);
      setLikes(response.likes_count);
    } catch (error) {
      if (isAxiosError<CatalogLikeResponse>(error) && error.response?.status === 422) {
        const data = error.response.data;
        if (typeof data?.is_liked === "boolean") setIsLiked(data.is_liked);
        if (typeof data?.likes_count === "number") setLikes(data.likes_count);
        showToast(data?.message || "Не вдалося оновити лайк", "red", "Помилка");
      } else if (isAxiosError(error) && error.response?.status === 401) {
        showToast("Щоб поставити лайк, потрібно увійти в систему", "red", "Помилка");
      } else {
        showToast("Не вдалося оновити лайк", "red", "Помилка");
      }
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div className={`bg-[#343434] flex items-stretch h-[52px] w-fit ${className}`}>
      <div className="flex items-center justify-center px-4">
        <span className="text-[#FECC39] font-bold text-sm">{likes}</span>
      </div>
      <div className="w-px bg-[#272727]" />
      <button
        type="button"
        onClick={handleLikeClick}
        disabled={likeLoading}
        className={`flex items-center justify-center w-[52px] flex-shrink-0 transition-colors ${
          isLiked ? "bg-[#FECC39]" : ""
        } ${likeLoading ? "cursor-wait opacity-60" : ""}`}
      >
        <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 16C8.64137 15.8678 0 12.5515 0 5.71041C0 0.615962 5.72931 -1.91752 9 1.70397C12.2362 -1.89649 18 0.574211 18 5.71041C18 12.552 9.35904 15.8682 9 16Z"
            fill={isLiked ? "#343434" : "#FECC39"}
          />
        </svg>
      </button>
    </div>
  );
}
