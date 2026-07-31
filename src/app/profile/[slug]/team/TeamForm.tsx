"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import AddProjectCover from "../create-project/AddProjectCover";
import DeleteTeamModal from "./DeleteTeamModal";
import { myTeamsAPI } from "../../../../lib/api/myTeams";
import { getApiErrorMessage, getApiFieldErrors } from "../../../../lib/apiError";
import { withProfileId } from "../../../../lib/authorQuery";
import { useProfileView } from "../../ProfileViewContext";

// Порядок відповідає розташуванню полів у формі (згори вниз) — перше поле з
// помилкою в цьому порядку отримує фокус, коли сервер повертає 422.
const FIELD_ORDER = [
  "avatar",
  "name.uk",
  "name.en",
  "website",
  "country.uk",
  "country.en",
  "city.uk",
  "city.en",
  "region.uk",
  "region.en",
  "zip.uk",
  "zip.en",
  "specialization.uk",
  "specialization.en",
  "description.uk",
  "description.en",
] as const;

interface TeamFormProps {
  mode?: "create" | "edit";
}

interface MemberOption {
  key: string;
  id: number;
  name: string;
  icon: string;
}

export default function TeamForm({ mode = "create" }: TeamFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("slug");
  const { slug: profileSlug } = useProfileView();
  const isEditMode = mode === "edit" && !!editSlug;

  const [teamCover, setTeamCover] = useState<string | null>(null);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);

  const [nameUa, setNameUa] = useState("");
  const [nameEn, setNameEn] = useState("");

  const [countryUa, setCountryUa] = useState("");
  const [countryEn, setCountryEn] = useState("");

  const [cityUa, setCityUa] = useState("");
  const [cityEn, setCityEn] = useState("");

  const [websiteUrl, setWebsiteUrl] = useState("");

  const [regionUa, setRegionUa] = useState("");
  const [regionEn, setRegionEn] = useState("");

  const [zipUa, setZipUa] = useState("");
  const [zipEn, setZipEn] = useState("");

  const [specializationUa, setSpecializationUa] = useState("");
  const [specializationEn, setSpecializationEn] = useState("");
  const [aboutUa, setAboutUa] = useState("");
  const [aboutEn, setAboutEn] = useState("");

  const [membersQuery, setMembersQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<MemberOption[]>([]);
  const [searchResults, setSearchResults] = useState<MemberOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [isPrimaryHovered, setIsPrimaryHovered] = useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const avatarRef = useRef<HTMLDivElement>(null);
  const nameUaRef = useRef<HTMLInputElement>(null);
  const nameEnRef = useRef<HTMLInputElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const countryUaRef = useRef<HTMLInputElement>(null);
  const countryEnRef = useRef<HTMLInputElement>(null);
  const cityUaRef = useRef<HTMLInputElement>(null);
  const cityEnRef = useRef<HTMLInputElement>(null);
  const regionUaRef = useRef<HTMLInputElement>(null);
  const regionEnRef = useRef<HTMLInputElement>(null);
  const zipUaRef = useRef<HTMLInputElement>(null);
  const zipEnRef = useRef<HTMLInputElement>(null);
  const specializationUaRef = useRef<HTMLInputElement>(null);
  const specializationEnRef = useRef<HTMLInputElement>(null);
  const aboutUaRef = useRef<HTMLTextAreaElement>(null);
  const aboutEnRef = useRef<HTMLTextAreaElement>(null);

  const fieldRefs: Record<(typeof FIELD_ORDER)[number], React.RefObject<HTMLElement | null>> = {
    avatar: avatarRef,
    "name.uk": nameUaRef,
    "name.en": nameEnRef,
    website: websiteRef,
    "country.uk": countryUaRef,
    "country.en": countryEnRef,
    "city.uk": cityUaRef,
    "city.en": cityEnRef,
    "region.uk": regionUaRef,
    "region.en": regionEnRef,
    "zip.uk": zipUaRef,
    "zip.en": zipEnRef,
    "specialization.uk": specializationUaRef,
    "specialization.en": specializationEnRef,
    "description.uk": aboutUaRef,
    "description.en": aboutEnRef,
  };

  const clearFieldErrors = (keys: string[]) => {
    setFieldErrors((prev) => {
      if (!keys.some((key) => key in prev)) return prev;
      const next = { ...prev };
      keys.forEach((key) => delete next[key]);
      return next;
    });
  };

  useEffect(() => {
    const firstErrorField = FIELD_ORDER.find((key) => fieldErrors[key]?.length);
    if (!firstErrorField) return;
    const target = fieldRefs[firstErrorField].current;
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    target?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldErrors]);

  useEffect(() => {
    if (!isEditMode || !editSlug) return;
    myTeamsAPI.getForEdit(editSlug).then((team) => {
      if (!team) return;
      setTeamCover(team.avatarUrl);
      setWebsiteUrl(team.website ?? "");
      setNameUa(team.name.uk ?? "");
      setNameEn(team.name.en ?? "");
      setCountryUa(team.country.uk ?? "");
      setCountryEn(team.country.en ?? "");
      setCityUa(team.city.uk ?? "");
      setCityEn(team.city.en ?? "");
      setRegionUa(team.region.uk ?? "");
      setRegionEn(team.region.en ?? "");
      setZipUa(team.zip.uk ?? "");
      setZipEn(team.zip.en ?? "");
      setAboutUa(team.description.uk ?? "");
      setAboutEn(team.description.en ?? "");
      setSpecializationUa(team.specialization.uk ?? "");
      setSpecializationEn(team.specialization.en ?? "");
      setSelectedMembers(
        team.members.map((m) => ({
          key: `member-${m.id}`,
          id: m.id,
          name: m.name,
          icon: m.avatarUrl ?? "/megaphone.svg",
        }))
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, editSlug]);

  useEffect(() => {
    const query = membersQuery.trim();
    if (!query) {
      setSearchResults([]);
      return;
    }
    let cancelled = false;
    myTeamsAPI.searchMembers(query).then((users) => {
      if (cancelled) return;
      const results = users
        .map((user) => ({
          key: `member-${user.id}`,
          id: user.id,
          name: user.name,
          icon: user.avatarUrl ?? "/megaphone.svg",
        }))
        .filter((result) => !selectedMembers.some((member) => member.id === result.id));
      setSearchResults(results);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membersQuery]);

  const handlePrimary = async () => {
    setError(null);
    setFieldErrors({});

    // Дзеркалить обов'язкові поля StoreTeamRequest/UpdateTeamRequest на бекенді
    // (усі поля, крім website) — щоб не чекати на round-trip для очевидно
    // порожніх полів.
    const requiredChecks: Array<[(typeof FIELD_ORDER)[number], boolean, string]> = [
      ["avatar", !teamCover, "Додайте обкладинку команди"],
      ["name.uk", !nameUa.trim(), "Вкажіть назву команди"],
      ["name.en", !nameEn.trim(), "Please specify the team name"],
      ["country.uk", !countryUa.trim(), "Вкажіть країну"],
      ["country.en", !countryEn.trim(), "Please specify the country"],
      ["city.uk", !cityUa.trim(), "Вкажіть населений пункт"],
      ["city.en", !cityEn.trim(), "Please specify the city"],
      ["region.uk", !regionUa.trim(), "Вкажіть область"],
      ["region.en", !regionEn.trim(), "Please specify the region"],
      ["zip.uk", !zipUa.trim(), "Вкажіть поштовий індекс"],
      ["zip.en", !zipEn.trim(), "Please specify the postal code"],
      ["specialization.uk", !specializationUa.trim(), "Вкажіть спеціалізацію команди"],
      ["specialization.en", !specializationEn.trim(), "Please specify the team specialization"],
      ["description.uk", !aboutUa.trim(), "Розкажіть про діяльність команди"],
      ["description.en", !aboutEn.trim(), "Tell us about the team's activity"],
    ];
    const missing = requiredChecks.filter(([, isMissing]) => isMissing);
    if (missing.length > 0) {
      setFieldErrors(Object.fromEntries(missing.map(([key, , message]) => [key, [message]])));
      return;
    }

    const payload = {
      nameUk: nameUa.trim(),
      nameEn: nameEn.trim() || undefined,
      avatar: teamCover,
      website: websiteUrl.trim() || undefined,
      countryUk: countryUa.trim() || undefined,
      countryEn: countryEn.trim() || undefined,
      cityUk: cityUa.trim() || undefined,
      cityEn: cityEn.trim() || undefined,
      regionUk: regionUa.trim() || undefined,
      regionEn: regionEn.trim() || undefined,
      zipUk: zipUa.trim() || undefined,
      zipEn: zipEn.trim() || undefined,
      descriptionUk: aboutUa.trim() || undefined,
      descriptionEn: aboutEn.trim() || undefined,
      specializationUk: specializationUa.trim() || undefined,
      specializationEn: specializationEn.trim() || undefined,
      memberIds: selectedMembers.map((m) => m.id),
    };

    try {
      if (isEditMode && editSlug) {
        await myTeamsAPI.update(editSlug, payload);
      } else {
        await myTeamsAPI.create(payload);
      }
      router.push(withProfileId("/profile/team", profileSlug));
    } catch (err) {
      const errors = getApiFieldErrors(err);
      if (errors) {
        setFieldErrors(errors);
      } else {
        setError(getApiErrorMessage(err, "Не вдалося зберегти команду"));
      }
    }
  };

  const handleDelete = async () => {
    if (!isEditMode || !editSlug) return;
    try {
      await myTeamsAPI.remove(editSlug);
      router.push(withProfileId("/profile/team", profileSlug));
    } catch (err) {
      setIsDeleteModalOpen(false);
      setError(getApiErrorMessage(err, "Не вдалося видалити команду"));
    }
  };

  const handleAddMember = (member: MemberOption) => {
    setSelectedMembers((prev) => {
      if (prev.some((item) => item.id === member.id)) {
        return prev;
      }
      return [...prev, member];
    });
    setMembersQuery("");
  };

  const handleRemoveMember = (memberKey: string) => {
    setSelectedMembers((prev) => prev.filter((member) => member.key !== memberKey));
  };

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-10 md:px-10 lg:px-[75px] bg-[#414141] min-h-screen">
      {error && (
        <div className="w-full max-w-[1000px] bg-red-900/40 border border-red-500 text-white px-4 py-3">
          {error}
        </div>
      )}
      <form className="flex flex-col items-center gap-8 w-full max-w-[1000px]">
        {/* Cover Upload */}
        <div className="w-full flex flex-col items-center gap-2">
          <label className="font-wix text-white text-sm self-start">
            Обкладинка команди <span className="text-red-500">*</span>
          </label>
          <div
            ref={avatarRef}
            tabIndex={-1}
            onClick={() => !teamCover && setIsCoverModalOpen(true)}
            className={`relative flex flex-col items-center justify-center gap-4 w-[400px] h-[400px] bg-[#343434] transition-colors outline-none ${
              !teamCover ? "cursor-pointer hover:bg-[#3a3a3a]" : ""
            } ${fieldErrors.avatar ? "border-2 border-red-500" : ""}`}
          >
            {teamCover ? (
              <>
                <Image
                  src={teamCover}
                  alt="Team cover"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCoverModalOpen(true);
                  }}
                  className="absolute top-4 right-4 w-12 h-12 bg-[#343434] flex items-center justify-center hover:bg-[#414141] transition-colors z-10"
                >
                  <Image
                    src="/yellow_cross.svg"
                    alt="Edit"
                    width={24}
                    height={24}
                  />
                </button>
              </>
            ) : (
              <>
                <Image src="/upload.svg" alt="upload" width={48} height={48} />
                <p className="text-white text-center">Додайте обкладинку</p>
              </>
            )}
          </div>
          {fieldErrors.avatar && <p className="text-red-500 text-sm">{fieldErrors.avatar[0]}</p>}
        </div>

        {/* Team Name */}
        <div className="w-full flex flex-col gap-2">
          <label className="font-wix text-white text-sm">
            Назва команди <span className="text-red-500">*</span>
          </label>
          <div
            className={`relative ${
              fieldErrors["name.uk"] || fieldErrors.name ? "border-2 border-red-500" : ""
            }`}
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Image src="/ua.svg" alt="UA" width={24} height={24} />
            </div>
            <input
              ref={nameUaRef}
              type="text"
              value={nameUa}
              onChange={(e) => {
                setNameUa(e.target.value);
                clearFieldErrors(["name.uk", "name"]);
              }}
              placeholder="Вкажіть назву команди"
              className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
            />
          </div>
          {(fieldErrors["name.uk"] || fieldErrors.name) && (
            <p className="text-red-500 text-sm">{(fieldErrors["name.uk"] || fieldErrors.name)[0]}</p>
          )}
          <div className={`relative ${fieldErrors["name.en"] ? "border-2 border-red-500" : ""}`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Image src="/en.svg" alt="EN" width={24} height={24} />
            </div>
            <input
              ref={nameEnRef}
              type="text"
              value={nameEn}
              onChange={(e) => {
                setNameEn(e.target.value);
                clearFieldErrors(["name.en"]);
              }}
              placeholder="Please specify the team name"
              className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
            />
          </div>
          {fieldErrors["name.en"] && <p className="text-red-500 text-sm">{fieldErrors["name.en"][0]}</p>}
        </div>

        {/* Website */}
        <div className="w-full flex flex-col gap-2">
          <label className="font-wix text-white text-sm">Сайт команди</label>
          <input
            ref={websiteRef}
            type="text"
            value={websiteUrl}
            onChange={(e) => {
              setWebsiteUrl(e.target.value);
              clearFieldErrors(["website"]);
            }}
            placeholder="https://example.com"
            className={`font-wix w-full px-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0] ${
              fieldErrors.website ? "border-2 border-red-500" : ""
            }`}
          />
          {fieldErrors.website && <p className="text-red-500 text-sm">{fieldErrors.website[0]}</p>}
        </div>

        {/* Country + City */}
        <div className="w-full flex flex-col md:flex-row gap-3">
          <div className="w-full md:flex-1 md:max-w-[494px] flex flex-col gap-2">
            <label className="font-wix text-white text-sm">
              Країна <span className="text-red-500">*</span>
            </label>
            <div className={`relative ${fieldErrors["country.uk"] ? "border-2 border-red-500" : ""}`}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src="/ua.svg" alt="UA" width={24} height={24} />
              </div>
              <input
                ref={countryUaRef}
                type="text"
                value={countryUa}
                onChange={(e) => {
                  setCountryUa(e.target.value);
                  clearFieldErrors(["country.uk"]);
                }}
                placeholder="Вкажіть країну"
                className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
              />
            </div>
            {fieldErrors["country.uk"] && (
              <p className="text-red-500 text-sm">{fieldErrors["country.uk"][0]}</p>
            )}
            <div className={`relative ${fieldErrors["country.en"] ? "border-2 border-red-500" : ""}`}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src="/en.svg" alt="EN" width={24} height={24} />
              </div>
              <input
                ref={countryEnRef}
                type="text"
                value={countryEn}
                onChange={(e) => {
                  setCountryEn(e.target.value);
                  clearFieldErrors(["country.en"]);
                }}
                placeholder="Please specify the country"
                className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
              />
            </div>
            {fieldErrors["country.en"] && (
              <p className="text-red-500 text-sm">{fieldErrors["country.en"][0]}</p>
            )}
          </div>

          <div className="w-full md:flex-1 md:max-w-[494px] flex flex-col gap-2">
            <label className="font-wix text-white text-sm">
              Населений пункт <span className="text-red-500">*</span>
            </label>
            <div className={`relative ${fieldErrors["city.uk"] ? "border-2 border-red-500" : ""}`}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src="/ua.svg" alt="UA" width={24} height={24} />
              </div>
              <input
                ref={cityUaRef}
                type="text"
                value={cityUa}
                onChange={(e) => {
                  setCityUa(e.target.value);
                  clearFieldErrors(["city.uk"]);
                }}
                placeholder="Вкажіть назву"
                className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
              />
            </div>
            {fieldErrors["city.uk"] && <p className="text-red-500 text-sm">{fieldErrors["city.uk"][0]}</p>}
            <div className={`relative ${fieldErrors["city.en"] ? "border-2 border-red-500" : ""}`}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src="/en.svg" alt="EN" width={24} height={24} />
              </div>
              <input
                ref={cityEnRef}
                type="text"
                value={cityEn}
                onChange={(e) => {
                  setCityEn(e.target.value);
                  clearFieldErrors(["city.en"]);
                }}
                placeholder="Please specify the city"
                className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
              />
            </div>
            {fieldErrors["city.en"] && <p className="text-red-500 text-sm">{fieldErrors["city.en"][0]}</p>}
          </div>
        </div>

        {/* Region + Zip */}
        <div className="w-full flex flex-col md:flex-row gap-3">
          <div className="w-full md:flex-1 md:max-w-[494px] flex flex-col gap-2">
            <label className="font-wix text-white text-sm">
              Область, регіон <span className="text-red-500">*</span>
            </label>
            <div className={`relative ${fieldErrors["region.uk"] ? "border-2 border-red-500" : ""}`}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src="/ua.svg" alt="UA" width={24} height={24} />
              </div>
              <input
                ref={regionUaRef}
                type="text"
                value={regionUa}
                onChange={(e) => {
                  setRegionUa(e.target.value);
                  clearFieldErrors(["region.uk"]);
                }}
                placeholder="Вкажіть область"
                className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
              />
            </div>
            {fieldErrors["region.uk"] && (
              <p className="text-red-500 text-sm">{fieldErrors["region.uk"][0]}</p>
            )}
            <div className={`relative ${fieldErrors["region.en"] ? "border-2 border-red-500" : ""}`}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src="/en.svg" alt="EN" width={24} height={24} />
              </div>
              <input
                ref={regionEnRef}
                type="text"
                value={regionEn}
                onChange={(e) => {
                  setRegionEn(e.target.value);
                  clearFieldErrors(["region.en"]);
                }}
                placeholder="Please specify the region"
                className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
              />
            </div>
            {fieldErrors["region.en"] && (
              <p className="text-red-500 text-sm">{fieldErrors["region.en"][0]}</p>
            )}
          </div>

          <div className="w-full md:flex-1 md:max-w-[494px] flex flex-col gap-2">
            <label className="font-wix text-white text-sm">
              Поштовий індекс <span className="text-red-500">*</span>
            </label>
            <div className={`relative ${fieldErrors["zip.uk"] ? "border-2 border-red-500" : ""}`}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src="/ua.svg" alt="UA" width={24} height={24} />
              </div>
              <input
                ref={zipUaRef}
                type="text"
                value={zipUa}
                onChange={(e) => {
                  setZipUa(e.target.value);
                  clearFieldErrors(["zip.uk"]);
                }}
                placeholder="Вкажіть індекс"
                className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
              />
            </div>
            {fieldErrors["zip.uk"] && <p className="text-red-500 text-sm">{fieldErrors["zip.uk"][0]}</p>}
            <div className={`relative ${fieldErrors["zip.en"] ? "border-2 border-red-500" : ""}`}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src="/en.svg" alt="EN" width={24} height={24} />
              </div>
              <input
                ref={zipEnRef}
                type="text"
                value={zipEn}
                onChange={(e) => {
                  setZipEn(e.target.value);
                  clearFieldErrors(["zip.en"]);
                }}
                placeholder="Please specify the postal code"
                className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
              />
            </div>
            {fieldErrors["zip.en"] && <p className="text-red-500 text-sm">{fieldErrors["zip.en"][0]}</p>}
          </div>
        </div>

        {/* Specialization */}
        <div className="w-full flex flex-col gap-2">
          <label className="font-wix text-white text-sm">
            Спеціалізація команди <span className="text-red-500">*</span>
          </label>
          <div className={`relative ${fieldErrors["specialization.uk"] ? "border-2 border-red-500" : ""}`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Image src="/ua.svg" alt="UA" width={24} height={24} />
            </div>
            <input
              ref={specializationUaRef}
              type="text"
              value={specializationUa}
              onChange={(e) => {
                setSpecializationUa(e.target.value);
                clearFieldErrors(["specialization.uk"]);
              }}
              placeholder="Наприклад: відеозйомка"
              className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
            />
          </div>
          {fieldErrors["specialization.uk"] && (
            <p className="text-red-500 text-sm">{fieldErrors["specialization.uk"][0]}</p>
          )}
          <div className={`relative ${fieldErrors["specialization.en"] ? "border-2 border-red-500" : ""}`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Image src="/en.svg" alt="EN" width={24} height={24} />
            </div>
            <input
              ref={specializationEnRef}
              type="text"
              value={specializationEn}
              onChange={(e) => {
                setSpecializationEn(e.target.value);
                clearFieldErrors(["specialization.en"]);
              }}
              placeholder="For example: video shooting"
              className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
            />
          </div>
          {fieldErrors["specialization.en"] && (
            <p className="text-red-500 text-sm">{fieldErrors["specialization.en"][0]}</p>
          )}
        </div>

        {/* About */}
        <div className="w-full flex flex-col gap-2">
          <label className="font-wix text-white text-sm">
            Інформація про команду <span className="text-red-500">*</span>
          </label>
          <div className={`relative ${fieldErrors["description.uk"] ? "border-2 border-red-500" : ""}`}>
            <div className="absolute left-4 top-4">
              <Image src="/ua.svg" alt="UA" width={24} height={24} />
            </div>
            <textarea
              ref={aboutUaRef}
              value={aboutUa}
              onChange={(e) => {
                setAboutUa(e.target.value);
                clearFieldErrors(["description.uk"]);
              }}
              placeholder="Розкажіть про діяльність команди"
              className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0] resize-none"
              style={{ height: "180px" }}
            />
          </div>
          {fieldErrors["description.uk"] && (
            <p className="text-red-500 text-sm">{fieldErrors["description.uk"][0]}</p>
          )}
          <div className={`relative ${fieldErrors["description.en"] ? "border-2 border-red-500" : ""}`}>
            <div className="absolute left-4 top-4">
              <Image src="/en.svg" alt="EN" width={24} height={24} />
            </div>
            <textarea
              ref={aboutEnRef}
              value={aboutEn}
              onChange={(e) => {
                setAboutEn(e.target.value);
                clearFieldErrors(["description.en"]);
              }}
              placeholder="Tell us about the team's activity"
              className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0] resize-none"
              style={{ height: "180px" }}
            />
          </div>
          {fieldErrors["description.en"] && (
            <p className="text-red-500 text-sm">{fieldErrors["description.en"][0]}</p>
          )}
        </div>

        {/* Members */}
        <div className="w-full flex flex-col gap-4">
          <div
            className="text-white"
            style={{
              fontWeight: 600,
              fontSize: "18px",
              lineHeight: "24px",
              maxWidth: "600px",
            }}
          >
            Учасники
          </div>

          {selectedMembers.length > 0 && (
            <div className="w-full flex flex-col gap-3">
              {selectedMembers.map((member) => (
                <div
                  key={member.key}
                  className="w-full h-[60px] bg-[#343434] text-white px-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={member.icon}
                        alt="Артист"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-wix truncate">{member.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member.key)}
                    className="flex items-center justify-center shrink-0"
                    aria-label="Видалити учасника"
                  >
                    <Image
                      src="/yellow_cross.svg"
                      alt="Видалити"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="w-full flex flex-col gap-1">
            <div className="font-wix text-white text-sm">
              Додайте учасника до команди
            </div>

            <div className="relative w-full h-[60px]">
              <input
                type="text"
                value={membersQuery}
                onChange={(e) => setMembersQuery(e.target.value)}
                placeholder="Вкажіть ім’я або email"
                className="font-wix w-full h-full bg-[#343434] text-white placeholder-[#A0A0A0] px-6 pr-16"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center"
              >
                <Image src="/search.svg" alt="Search" width={24} height={24} />
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="w-full">
                {searchResults.map((result) => (
                  <button
                    key={result.key}
                    type="button"
                    onClick={() => handleAddMember(result)}
                    className="w-full h-[60px] bg-[#343434] text-white px-4 flex items-center justify-between border-t border-[#414141] hover:bg-[#3a3a3a] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                        <Image
                          src={result.icon}
                          alt="Артист"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-wix truncate">
                        {result.name}
                      </span>
                    </div>
                    <Image
                      src="/yellow_plus.svg"
                      alt="Додати"
                      width={24}
                      height={24}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Primary Button */}
        <button
          type="button"
          onClick={handlePrimary}
          onMouseEnter={() => setIsPrimaryHovered(true)}
          onMouseLeave={() => setIsPrimaryHovered(false)}
          className={`w-[300px] h-[60px] flex items-stretch transition-all duration-300 ${
            isPrimaryHovered ? "bg-white" : "bg-[#FECC39]"
          }`}
        >
          <span className="flex items-center justify-center flex-1 px-6 font-bold text-[#343434]">
            {isEditMode ? "Зберегти" : "Створити"}
          </span>
          <div className="flex items-center justify-center w-[60px] border-l border-[#343434]">
            <Image src="/grey_check.svg" alt="Primary" width={20} height={20} />
          </div>
        </button>

        {/* Delete Button — лише для вже існуючої команди */}
        {isEditMode && (
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            onMouseEnter={() => setIsDeleteHovered(true)}
            onMouseLeave={() => setIsDeleteHovered(false)}
            className={`w-[300px] h-[60px] flex items-stretch transition-all duration-300 ${
              isDeleteHovered ? "bg-[#FECC39]" : "bg-[#343434]"
            }`}
          >
            <span
              className={`flex items-center justify-center flex-1 px-6 font-bold transition-colors ${
                isDeleteHovered ? "text-[#343434]" : "text-[#FECC39]"
              }`}
            >
              Видалити
            </span>
            <div
              className={`flex items-center justify-center w-[60px] border-l transition-colors ${
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
        )}
      </form>

      <AddProjectCover
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        onImageSelect={(imageUrl) => setTeamCover(imageUrl)}
        onImageRemove={() => setTeamCover(null)}
        currentImage={teamCover}
        customTitle="Додайте обкладинку"
      />

      <DeleteTeamModal
        isOpen={isDeleteModalOpen}
        teamName={nameUa || "Команда"}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
      />
    </div>
  );
}

