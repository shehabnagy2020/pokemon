import ViewOptionsControls from "~/components/viewOptionControls";
import { useEffect, useState } from "react";
import PokemonCard from "~/components/pokemonCard";
import { useGetPokemonList } from "~/api/hooks/useGetPokemonList";
import { AiFillThunderbolt } from "react-icons/ai";
import PokemonCardSkeleton from "~/components/pokemonCard/skeleton";
import type { PokemonListItem } from "~/types/pokemon";
import { ITEMS_PER_PAGE } from "~/utils/const";

export default function Home() {
  const [shownData, setShownData] = useState<PokemonListItem[]>([]);
  const [offset, setOffset] = useState(0);

  const { data, isLoading, error, refetch } = useGetPokemonList(
    ITEMS_PER_PAGE,
    offset
  );

  const [activeView, setActiveView] = useState<
    "pageControls" | "infiniteScroll"
  >("pageControls");

  useEffect(() => {
    if (
      activeView === "pageControls" ||
      (activeView === "infiniteScroll" && offset === 0)
    ) {
      setShownData(data?.results || []);
    } else {
      setShownData((prev) => [...prev, ...(data?.results || [])]);
    }
  }, [activeView, data, offset]);

  return (
    <div
      className={`min-h-[100vh] ${
        activeView === "pageControls" ? "bg-[#e9efff]" : "bg-[#edfdf3]"
      }`}
    >
      <div className="flex flex-col gap-4 p-4 items-center w-full container mx-auto">
        <h1 className="flex items-center gap-2 font-bold text-3xl">
          <AiFillThunderbolt />
          Pokédex
        </h1>
        <p className="text-gray-600 text-sm">
          Discover and explore Pokemon with page controls
        </p>
        <ViewOptionsControls
          setOffset={setOffset}
          activeView={activeView}
          setActiveView={setActiveView}
        />

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading &&
          (activeView === "pageControls" ||
            (activeView === "infiniteScroll" && offset === 0)) ? (
            [...Array(10)].map((_, idx) => <PokemonCardSkeleton key={idx} />)
          ) : shownData && !error ? (
            shownData.map((pokemon, idx) => (
              <PokemonCard key={idx} pokemon={pokemon} />
            ))
          ) : (
            <div
              data-testid="error-message"
              className="text-red-500 text-center w-full col-span-full"
            >
              Error loading Pokemon,{" "}
              <button
                onClick={() => refetch()}
                className="cursor-pointer underline"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
