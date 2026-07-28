export type NewProjectTab =
  | "owner"
  | "name"
  | "media"
  | "description"
  | "parameters"
  | "characteristics"
  | "additional"
  | "publication";

const menuItems: { id: NewProjectTab; label: string }[] = [
  { id: "owner", label: "Власник проєкту" },
  { id: "name", label: "Назва" },
  { id: "media", label: "Медіа" },
  { id: "description", label: "Опис" },
  { id: "parameters", label: "Параметри" },
  { id: "characteristics", label: "Характеристики" },
  { id: "additional", label: "Додатково" },
  { id: "publication", label: "Публікація" },
];

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
