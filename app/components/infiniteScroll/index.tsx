import React from "react";
import { ITEMS_PER_PAGE } from "~/utils/const";

type InfiniteScrollProps = {
  offset: number;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  count?: number; // total pokemon from API
  isLoading: boolean;
};

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  offset,
  setOffset,
  count = 0,
  isLoading,
}) => {
  const hasMore = offset + ITEMS_PER_PAGE < count;

  const shownPokemon =
    count > 0
      ? Math.min(offset + ITEMS_PER_PAGE, count)
      : offset + ITEMS_PER_PAGE;

  const handleLoadMore = () => {
    if (!hasMore || isLoading) return;
    setOffset((prev) => prev + ITEMS_PER_PAGE);
  };

  return (
    <div
      data-testid="infinite-scroll-component"
      className="flex flex-col items-center justify-center gap-3 p-4 text-sm text-gray-700"
    >
      {isLoading && (
        <div
          data-testid="infinite-scroll-loading-state"
          className="mb-1 flex items-center gap-2"
        >
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <span>Loading more Pokemon...</span>
        </div>
      )}

      {!isLoading && hasMore && (
        <button
          data-testid="load-more-button"
          onClick={handleLoadMore}
          className="cursor-pointer rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          disabled={!hasMore}
        >
          Load more Pokemon
        </button>
      )}

      {!hasMore && !isLoading && (
        <p data-testid="end-of-list-message" className="text-gray-600">
          You have reached the end.
        </p>
      )}

      <p data-testid="shown-pokemon-counter" className="text-gray-600">
        Showing {shownPokemon} Pokemon
      </p>
    </div>
  );
};

export default InfiniteScroll;
