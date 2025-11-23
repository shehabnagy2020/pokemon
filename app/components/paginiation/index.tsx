import React from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { ITEMS_PER_PAGE } from "~/utils/const";

type PaginationProps = {
  offset: number;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  count?: number;
};

const Pagination = ({ offset, setOffset, count = 0 }: PaginationProps) => {
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
  const currentPage = Math.floor(offset / ITEMS_PER_PAGE) + 1;

  const goToPage = (page: number) => {
    setOffset((page - 1) * ITEMS_PER_PAGE);
  };

  // Generate visible page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className="flex flex-col gap-3 items-center"
      data-testid="pagination-component"
    >
      <div className="flex items-center gap-2">
        <button
          data-testid="previous-button"
          className="cursor-pointer flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-40"
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          <AiOutlineArrowLeft />
          Previous
        </button>

        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={idx} className="px-3 py-2 text-gray-500">
              …
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => goToPage(page as number)}
              className={`cursor-pointer px-3 py-2 rounded-md border ${
                currentPage === page
                  ? "bg-black text-white border-black"
                  : "bg-white border-gray-300"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          data-testid="next-button"
          className="cursor-pointer flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-40"
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next
          <AiOutlineArrowRight />
        </button>
      </div>

      <span data-testid="page-info" className="text-sm text-gray-600">
        Page {currentPage} of {totalPages} ({ITEMS_PER_PAGE} Pokémon per page)
      </span>
    </div>
  );
};

export default Pagination;
