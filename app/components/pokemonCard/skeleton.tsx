import React from "react";
import Skeleton from "../skeleton";

const PokemonCardSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-2 items-center border-2 border-gray-200 p-2 bg-white rounded-md">
      <Skeleton className="shrink-0 w-full aspect-video bg-gray-200 object-contain rounded-md" />
      <Skeleton className="w-3/4 h-5" />
      <Skeleton className="w-1/4 h-4" />
    </div>
  );
};

export default PokemonCardSkeleton;
