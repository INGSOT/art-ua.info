"use client";

import Image from "next/image";

interface PaginationSectionProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationSection({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationSectionProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxVisible; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number") {
      onPageChange(page);
    }
  };

  return (
    <div className="bg-[#343434] px-8 py-6">
      <div className="flex justify-between items-center max-w-full">
        {/* Left side - Page counter */}
        <div className="text-white text-base">
          {currentPage} з {totalPages}
        </div>

        {/* Right side - Page numbers with arrows */}
        <div className="flex items-center gap-4">
          {/* Previous arrow */}
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`transition-opacity ${
              currentPage === 1 ? "opacity-30 cursor-not-allowed" : "opacity-100 hover:opacity-80"
            }`}
          >
            <Image
              src="/yellow_triangle_left.svg"
              alt="Previous"
              width={24}
              height={24}
            />
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-3">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => handlePageClick(page)}
                disabled={page === "..."}
                className={`min-w-[32px] h-8 flex items-center justify-center text-base transition-colors ${
                  page === currentPage
                    ? "text-[#F0C419] font-semibold"
                    : page === "..."
                    ? "text-white cursor-default"
                    : "text-white hover:text-[#F0C419]"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next arrow */}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`transition-opacity ${
              currentPage === totalPages
                ? "opacity-30 cursor-not-allowed"
                : "opacity-100 hover:opacity-80"
            }`}
          >
            <Image
              src="/yellow_triangle_right.svg"
              alt="Next"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
