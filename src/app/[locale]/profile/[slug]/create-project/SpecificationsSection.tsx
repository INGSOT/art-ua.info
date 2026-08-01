import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Parameter } from "../../../../../lib/api/catalogs";

export interface ParameterAnswer {
  valueId: number | null;
  value: { uk: string; en: string };
}

export type ParameterAnswers = Record<number, ParameterAnswer>;

function localize(value: string | { uk: string; en?: string } | null | undefined): string {
  if (value == null) return "";
  if (typeof value === "object") return value.uk ?? value.en ?? "";
  return value;
}

interface SpecificationsSectionProps {
  artCategory: string | undefined;
  isLoadingCatalog: boolean;
  catalog: Parameter[];
  answers: ParameterAnswers;
  errors?: Record<string, string>;
  onSelectChange: (parameterId: number, valueId: number | null) => void;
  onCustomChange: (parameterId: number, field: "uk" | "en", value: string) => void;
}

export default function SpecificationsSection({
  artCategory,
  isLoadingCatalog,
  catalog,
  answers,
  errors = {},
  onSelectChange,
  onCustomChange,
}: SpecificationsSectionProps) {
  const t = useTranslations("CreateProject.specifications");
  return (
    <div className="w-full max-w-[1000px] flex flex-col gap-6">
      <p className="font-wix text-white text-sm w-full text-left">
        {t("hint")}
      </p>

      {!artCategory && (
        <p className="text-[#A0A0A0] text-center">
          {t("selectArtFieldFirst")}
        </p>
      )}
      {artCategory && isLoadingCatalog && (
        <p className="text-[#A0A0A0] text-center">{t("loading")}</p>
      )}
      {artCategory && !isLoadingCatalog && catalog.length === 0 && (
        <p className="text-[#A0A0A0] text-center">{t("empty")}</p>
      )}

      {catalog.map((param) => {
        const answer = answers[param.id];
        const errorValue = errors[`param_${param.id}_value`];
        const errorUk = errors[`param_${param.id}_uk`];
        const errorEn = errors[`param_${param.id}_en`];

        return (
          <div key={param.id} className="w-full flex flex-col gap-2">
            <label className="font-wix text-white text-sm">{localize(param.name)}</label>

            {param.type === "list" ? (
              <>
                <select
                  value={answer?.valueId ?? ""}
                  onChange={(e) =>
                    onSelectChange(param.id, e.target.value ? Number(e.target.value) : null)
                  }
                  className={`font-wix w-full px-6 py-4 bg-[#343434] text-white ${
                    errorValue ? "border-2 border-red-500" : ""
                  }`}
                >
                  <option value="">{t("selectValue")}</option>
                  {param.values.map((value) => (
                    <option key={value.id} value={value.id}>
                      {localize(value.value)}
                    </option>
                  ))}
                </select>
                {errorValue && <p className="text-red-500 text-sm">{errorValue}</p>}
              </>
            ) : (
              <>
                <div className={`relative ${errorUk ? "border-2 border-red-500" : ""}`}>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Image src="/ua.svg" alt="UA" width={24} height={24} />
                  </div>
                  <input
                    type="text"
                    value={answer?.value.uk ?? ""}
                    onChange={(e) => onCustomChange(param.id, "uk", e.target.value)}
                    className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
                  />
                </div>
                {errorUk && <p className="text-red-500 text-sm">{errorUk}</p>}
                <div className={`relative ${errorEn ? "border-2 border-red-500" : ""}`}>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Image src="/en.svg" alt="EN" width={24} height={24} />
                  </div>
                  <input
                    type="text"
                    value={answer?.value.en ?? ""}
                    onChange={(e) => onCustomChange(param.id, "en", e.target.value)}
                    className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
                  />
                </div>
                {errorEn && <p className="text-red-500 text-sm">{errorEn}</p>}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
