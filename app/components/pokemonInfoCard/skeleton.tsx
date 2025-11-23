import React from "react";
import Skeleton from "../skeleton";

const PokemonInfoCardSkeleton = () => {
  const card = {};
  return (
    <div className="sm:rounded-md bg-white shadow-md overflow-hidden">
      <div className="w-full text-white bg-linear-to-r from-[#aa55f0] to-[#e8489e] p-2 flex flex-col gap-2 items-center">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="flex flex-col md:flex-row gap-8 p-8">
        <div className="md:w-1/2 shrink-0 flex flex-col gap-6 items-center">
          <Skeleton className="aspect-square bg-gray-100 rounded-full! w-full" />
          <Skeleton className="h-6 w-24" />
          <div className="flex gap-6 w-full">
            <div className="w-full bg-gray-100 rounded-md flex flex-col items-center p-4 gap-2">
              <span className="text-gray-600">Height</span>
              <Skeleton className="h-6 w-12" />
            </div>
            <div className="w-full bg-gray-100 rounded-md flex flex-col items-center p-4 gap-2">
              <span className="text-gray-600">Weight</span>
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-4">
          <h2 className="font-bold text-xl">Base stats</h2>
          <div className="flex flex-col gap-2">
            {[...Array(6)].map((_, idx) => (
              <Skeleton key={idx} className="h-6 w-full" />
            ))}
          </div>
          <h2 className="font-bold text-xl">Abilities</h2>
          <div className="flex flex-col gap-2">
            {[...Array(2)].map((_, idx) => (
              <Skeleton key={idx} className="h-6 w-1/2" />
            ))}
          </div>
          <h2 className="font-bold text-xl">Base experience</h2>
          <span className="text-[#aa55f0] font-bold text-xl">
            <Skeleton className="h-6 w-24" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default PokemonInfoCardSkeleton;
