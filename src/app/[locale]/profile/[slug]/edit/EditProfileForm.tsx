"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import AddProjectCover from "../create-project/AddProjectCover";
import { profileAPI, type MyProfileEditData } from "../../../../../lib/api/profile";
import { withProfileId } from "../../../../../lib/authorQuery";
import { getImageUrl } from "../../../../../lib/url";
import { useAuth } from "../../../../../context/AuthContext";
import { useProfileView } from "../../ProfileViewContext";

const EMPTY_DATA: MyProfileEditData = {
  avatar: null,
  fullNameUk: "",
  fullNameEn: "",
  professionUk: "",
  professionEn: "",
  countryUk: "",
  countryEn: "",
  cityUk: "",
  cityEn: "",
  descriptionUk: "",
  descriptionEn: "",
  website: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  youtube: "",
};

export default function EditProfileForm() {
  const t = useTranslations("Profile.edit");
  const router = useRouter();
  const { refreshUser } = useAuth();
  const { slug: profileSlug } = useProfileView();

  const [data, setData] = useState<MyProfileEditData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isSaveHovered, setIsSaveHovered] = useState(false);

  useEffect(() => {
    let cancelled = false;
    profileAPI
      .getMyProfileEditData()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setField = <K extends keyof MyProfileEditData>(key: K, value: MyProfileEditData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setError(null);
    if (!data.fullNameUk.trim()) {
      setError(t("nameRequiredError"));
      return;
    }

    setSaving(true);
    try {
      await profileAPI.updateProfile(data);
      await refreshUser();
      router.push(withProfileId("/profile/projects", profileSlug));
    } catch {
      setError(t("saveError"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="w-full bg-[#414141] min-h-screen" />;
  }

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-10 md:px-10 lg:px-[75px] bg-[#414141] min-h-screen">
      {error && (
        <div className="w-full max-w-[1000px] bg-red-900/40 border border-red-500 text-white px-4 py-3">
          {error}
        </div>
      )}
      <form className="flex flex-col items-center gap-8 w-full max-w-[1000px]" onSubmit={(e) => e.preventDefault()}>
        {/* Avatar */}
        <div className="w-full flex justify-center">
          <div
            onClick={() => setIsCoverModalOpen(true)}
            className="relative flex flex-col items-center justify-center gap-4 w-[200px] h-[200px] rounded-full overflow-hidden bg-[#343434] cursor-pointer hover:bg-[#3a3a3a] transition-colors"
          >
            {data.avatar ? (
              <Image src={getImageUrl(data.avatar) ?? data.avatar} alt="Avatar" fill className="object-cover" />
            ) : (
              <>
                <Image src="/upload.svg" alt="upload" width={40} height={40} />
                <p className="text-white text-center text-sm px-4">{t("avatarUploadHint")}</p>
              </>
            )}
          </div>
        </div>

        {/* Full name */}
        <div className="w-full flex flex-col gap-2">
          <label className="font-wix text-white text-sm">{t("fullNameLabel")}</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Image src="/ua.svg" alt="UA" width={24} height={24} />
            </div>
            <input
              type="text"
              value={data.fullNameUk}
              onChange={(e) => setField("fullNameUk", e.target.value)}
              placeholder={t("fullNameUkPlaceholder")}
              className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
            />
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Image src="/en.svg" alt="EN" width={24} height={24} />
            </div>
            <input
              type="text"
              value={data.fullNameEn}
              onChange={(e) => setField("fullNameEn", e.target.value)}
              placeholder={t("fullNameEnPlaceholder")}
              className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
            />
          </div>
        </div>

        {/* Profession */}
        <div className="w-full flex flex-col gap-2">
          <label className="font-wix text-white text-sm">{t("professionLabel")}</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Image src="/ua.svg" alt="UA" width={24} height={24} />
            </div>
            <input
              type="text"
              value={data.professionUk}
              onChange={(e) => setField("professionUk", e.target.value)}
              placeholder={t("professionUkPlaceholder")}
              className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
            />
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Image src="/en.svg" alt="EN" width={24} height={24} />
            </div>
            <input
              type="text"
              value={data.professionEn}
              onChange={(e) => setField("professionEn", e.target.value)}
              placeholder={t("professionEnPlaceholder")}
              className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
            />
          </div>
        </div>

        {/* Country + City */}
        <div className="w-full flex flex-col md:flex-row gap-3">
          <div className="w-full md:flex-1 flex flex-col gap-2">
            <label className="font-wix text-white text-sm">{t("countryLabel")}</label>
            <input
              type="text"
              value={data.countryUk}
              onChange={(e) => setField("countryUk", e.target.value)}
              placeholder={t("countryPlaceholder")}
              className="font-wix w-full px-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
            />
          </div>
          <div className="w-full md:flex-1 flex flex-col gap-2">
            <label className="font-wix text-white text-sm">{t("cityLabel")}</label>
            <input
              type="text"
              value={data.cityUk}
              onChange={(e) => setField("cityUk", e.target.value)}
              placeholder={t("cityPlaceholder")}
              className="font-wix w-full px-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
            />
          </div>
        </div>

        {/* Description */}
        <div className="w-full flex flex-col gap-2">
          <label className="font-wix text-white text-sm">{t("descriptionLabel")}</label>
          <textarea
            value={data.descriptionUk}
            onChange={(e) => setField("descriptionUk", e.target.value)}
            placeholder={t("descriptionPlaceholder")}
            className="font-wix w-full px-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0] resize-none"
            style={{ height: "140px" }}
          />
        </div>

        {/* Website + Social links */}
        <div className="w-full flex flex-col gap-4">
          <h2 className="text-white text-[20px] font-bold">{t("socialsTitle")}</h2>
          <input
            type="text"
            value={data.website}
            onChange={(e) => setField("website", e.target.value)}
            placeholder={t("websitePlaceholder")}
            className="font-wix w-full px-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
          />
          <input
            type="text"
            value={data.facebook}
            onChange={(e) => setField("facebook", e.target.value)}
            placeholder={t("facebookPlaceholder")}
            className="font-wix w-full px-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
          />
          <input
            type="text"
            value={data.instagram}
            onChange={(e) => setField("instagram", e.target.value)}
            placeholder={t("instagramPlaceholder")}
            className="font-wix w-full px-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
          />
          <input
            type="text"
            value={data.linkedin}
            onChange={(e) => setField("linkedin", e.target.value)}
            placeholder={t("linkedinPlaceholder")}
            className="font-wix w-full px-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
          />
          <input
            type="text"
            value={data.youtube}
            onChange={(e) => setField("youtube", e.target.value)}
            placeholder={t("youtubePlaceholder")}
            className="font-wix w-full px-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
          />
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          onMouseEnter={() => setIsSaveHovered(true)}
          onMouseLeave={() => setIsSaveHovered(false)}
          className={`w-[300px] h-[60px] flex items-stretch transition-all duration-300 disabled:opacity-50 ${
            isSaveHovered ? "bg-white" : "bg-[#FECC39]"
          }`}
        >
          <span className="flex items-center justify-center flex-1 px-6 font-bold text-[#343434]">
            {saving ? t("saving") : t("save")}
          </span>
          <div className="flex items-center justify-center w-[60px] border-l border-[#343434]">
            <Image src="/grey_check.svg" alt="Save" width={20} height={20} />
          </div>
        </button>
      </form>

      <AddProjectCover
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        onImageSelect={(imageUrl) => setField("avatar", imageUrl)}
        onImageRemove={() => setField("avatar", null)}
        currentImage={getImageUrl(data.avatar)}
        customTitle={t("avatarModalTitle")}
      />
    </div>
  );
}
