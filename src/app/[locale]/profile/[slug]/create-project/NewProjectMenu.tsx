import { useTranslations } from "next-intl";

export type NewProjectTab =
  | "owner"
  | "name"
  | "media"
  | "description"
  | "characteristics"
  | "additional"
  | "publication";

interface NewProjectMenuProps {
  activeTab: NewProjectTab;
  unlockedTabs: NewProjectTab[];
  onTabChange: (tab: NewProjectTab) => void;
}

export default function NewProjectMenu({
  activeTab,
  unlockedTabs,
  onTabChange,
}: NewProjectMenuProps) {
  const t = useTranslations("CreateProject.menu");
  const menuItems: { id: NewProjectTab; label: string }[] = [
    { id: "owner", label: t("owner") },
    { id: "name", label: t("name") },
    { id: "media", label: t("media") },
    { id: "description", label: t("description") },
    { id: "characteristics", label: t("characteristics") },
    { id: "additional", label: t("additional") },
    { id: "publication", label: t("publication") },
  ];

  return (
    <div className="w-full max-w-[1440px] h-[80px] bg-[#343434] flex items-center justify-start px-6 overflow-x-auto">
      <nav className="flex items-center gap-6 md:gap-[30px] min-w-max">
        {menuItems.map((item) => {
          const isUnlocked = unlockedTabs.includes(item.id);
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              disabled={!isUnlocked}
              onClick={() => onTabChange(item.id)}
              className={`font-bold text-[14px] font-[family-name:var(--font-unbounded)] whitespace-nowrap transition-colors ${
                isActive
                  ? "text-[#FECC39]"
                  : isUnlocked
                    ? "text-white hover:text-[#FECC39]"
                    : "text-[#A0A0A0] cursor-not-allowed"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
