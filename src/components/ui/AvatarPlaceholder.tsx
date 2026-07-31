interface AvatarPlaceholderProps {
  name: string;
  className?: string;
  textClassName?: string;
}

export default function AvatarPlaceholder({
  name,
  className = "w-9 h-9",
  textClassName = "text-[14px]",
}: AvatarPlaceholderProps) {
  return (
    <span
      className={`${className} rounded-full bg-[#E5E5E5] text-[#6B7280] font-bold ${textClassName} flex items-center justify-center shrink-0`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
