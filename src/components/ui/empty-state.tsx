import Image from "next/image";
import { Link } from "@/src/i18n/navigation";

interface EmptyStateProps {
  title: string;
  description?: string;
  buttonText: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  imageSrc?: string;
  imageAlt?: string;
}

export default function EmptyState({
  title,
  description,
  buttonText,
  buttonHref,
  onButtonClick,
  imageSrc = "/megaphone.svg",
  imageAlt = "Megaphone",
}: EmptyStateProps) {
  const buttonClassName =
    "mt-8 h-[60px] flex items-stretch transition-all duration-300 rounded-none bg-[#FECC39] hover:bg-[#FECC39] w-full md:w-[320px]";
  const buttonContent = (
    <>
      <span className="flex items-center justify-center flex-1 px-6 font-bold text-black whitespace-nowrap">
        {buttonText}
      </span>
      <div className="flex items-center justify-center w-[60px] flex-shrink-0 border-l border-black">
        <Image src="/plus.svg" alt="Plus" width={24} height={24} />
      </div>
    </>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-16 px-4">
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={420}
        height={420}
        className="w-[200px] h-[200px] md:w-[420px] md:h-[420px]"
      />
      <h2 className="mt-8 text-white text-xl md:text-3xl font-bold text-center max-w-[600px]">
        {title}
      </h2>
      {description && (
        <p className="font-wix mt-6 text-white text-base md:text-lg text-center">
          {description}
        </p>
      )}
      {buttonHref ? (
        <Link href={buttonHref} className={buttonClassName}>
          {buttonContent}
        </Link>
      ) : (
        <button type="button" onClick={onButtonClick} className={buttonClassName}>
          {buttonContent}
        </button>
      )}
    </div>
  );
}
