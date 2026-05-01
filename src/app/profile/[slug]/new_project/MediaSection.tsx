import Image from "next/image";
import ImageGallerySlider from "./ImageGallerySlider";
import { getVideoInfo } from "../../../../utils/videoUtils";

interface MediaSectionProps {
  projectCover: string | null;
  galleryImages: string[];
  workVideoUrl: string | null;
  workImage: string | null;
  tagsUa: string;
  tagsEn: string;
  addCoverText: string;
  addCoverOptional: string;
  workUploadText: string;
  tagsLabel: string;
  tagsPlaceholder: string;
  tagsPlaceholderEn: string;
  tagsHint: string;
  onOpenCoverModal: () => void;
  onOpenGalleryModal: () => void;
  onClearWorkVideo: () => void;
  onOpenWorkImageModal: () => void;
  onOpenWorkModal: () => void;
  onTagsUaChange: (value: string) => void;
  onTagsEnChange: (value: string) => void;
}

export default function MediaSection({
  projectCover,
  galleryImages,
  workVideoUrl,
  workImage,
  tagsUa,
  tagsEn,
  addCoverText,
  addCoverOptional,
  workUploadText,
  tagsLabel,
  tagsPlaceholder,
  tagsPlaceholderEn,
  tagsHint,
  onOpenCoverModal,
  onOpenGalleryModal,
  onClearWorkVideo,
  onOpenWorkImageModal,
  onOpenWorkModal,
  onTagsUaChange,
  onTagsEnChange,
}: MediaSectionProps) {
  return (
    <>
      <div className="w-full max-w-[1000px] flex flex-col gap-2">
        <label className="font-wix text-white text-sm">Обкладинка</label>
        <div className="flex justify-center">
          <div
            onClick={() => !projectCover && onOpenCoverModal()}
            className={`relative flex flex-col items-center justify-center gap-4 w-full h-[800px] bg-[#343434] transition-colors ${!projectCover ? "cursor-pointer hover:bg-[#3a3a3a]" : ""}`}
          >
            {projectCover ? (
              <>
                <Image
                  src={projectCover}
                  alt="Project cover"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCoverModal();
                  }}
                  className="absolute top-4 right-4 w-12 h-12 bg-[#343434] flex items-center justify-center hover:bg-[#414141] transition-colors z-10"
                >
                  <Image src="/yellow_cross.svg" alt="Edit" width={24} height={24} />
                </button>
              </>
            ) : (
              <>
                <Image src="/upload.svg" alt="upload" width={48} height={48} />
                <div className="text-white text-center">
                  <p>{addCoverText}</p>
                  <p>{addCoverOptional}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1000px] flex flex-col gap-2">
        <label className="font-wix text-white text-sm">Робота</label>
        <div className="flex justify-center">
          {galleryImages.length > 0 ? (
            <ImageGallerySlider images={galleryImages} onEditClick={onOpenGalleryModal} />
          ) : workVideoUrl ? (
            (() => {
              const videoInfo = getVideoInfo(workVideoUrl);
              return videoInfo ? (
                <div className="relative w-full aspect-[4/3] bg-[#343434]">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoInfo.videoId}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                  <button
                    onClick={onClearWorkVideo}
                    className="absolute top-2 right-2 w-10 h-10 bg-[#343434] hover:bg-[#FECC39] flex items-center justify-center transition-colors group z-10"
                  >
                    <Image
                      src="/yellow_cross.svg"
                      alt="Remove"
                      width={24}
                      height={24}
                      className="group-hover:brightness-0 group-hover:saturate-100 group-hover:invert-[0.2] transition-all"
                    />
                  </button>
                </div>
              ) : null;
            })()
          ) : workImage ? (
            <div className="relative w-full aspect-[4/3] bg-[#343434]">
              <Image src={workImage} alt="Work image" fill className="object-cover" />
              <button
                onClick={onOpenWorkImageModal}
                className="absolute top-2 right-2 w-10 h-10 bg-[#343434] hover:bg-[#FECC39] flex items-center justify-center transition-colors group z-10"
              >
                <Image
                  src="/yellow_cross.svg"
                  alt="Remove"
                  width={24}
                  height={24}
                  className="group-hover:brightness-0 group-hover:saturate-100 group-hover:invert-[0.2] transition-all"
                />
              </button>
            </div>
          ) : (
            <div
              onClick={onOpenWorkModal}
              className="flex flex-col items-center justify-center gap-4 w-full h-[800px] bg-[#343434] cursor-pointer hover:bg-[#3a3a3a] transition-colors"
            >
              <Image src="/upload.svg" alt="upload" width={48} height={48} />
              <p className="text-white text-center">{workUploadText}</p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-[1000px] flex flex-col gap-2">
        <label className="font-wix text-white text-sm">{tagsLabel}</label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Image src="/ua.svg" alt="UA" width={24} height={24} />
          </div>
          <input
            type="text"
            value={tagsUa}
            onChange={(e) => onTagsUaChange(e.target.value)}
            placeholder={tagsPlaceholder}
            className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
          />
        </div>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Image src="/en.svg" alt="EN" width={24} height={24} />
          </div>
          <input
            type="text"
            value={tagsEn}
            onChange={(e) => onTagsEnChange(e.target.value)}
            placeholder={tagsPlaceholderEn}
            className="font-wix w-full pl-14 pr-6 py-4 bg-[#343434] text-white placeholder-[#A0A0A0]"
          />
        </div>
        <p className="text-white text-sm text-right">{tagsHint}</p>
      </div>
    </>
  );
}
