import React, { useEffect } from "react";
import { AiFillThunderbolt, AiOutlineArrowLeft } from "react-icons/ai";
import { useParams } from "react-router";
import { useGetPokemonInfo } from "~/api/hooks/useGetPokemonInfo";
import AbilityState from "~/components/abilityState";
import PokemonInfoCard from "~/components/pokemonInfoCard";
import PokemonInfoCardSkeleton from "~/components/pokemonInfoCard/skeleton";
import StatsProgress from "~/components/statsProgress";
import TypesBadges from "~/components/typesBadges";

const Info = () => {
  const { pokemonId } = useParams();
  const { data, isLoading, error, refetch } = useGetPokemonInfo(pokemonId);

  useEffect(() => {
    // if id is wrong redirect to 404
    if (isNaN(Number(pokemonId))) {
      window.location.href = "/404";
    }
  }, [pokemonId]);

  return (
    <div className="bg-[#faedf7] min-h-[100vh]">
      <div className="container xl:w-2/4 mx-auto py-8">
        <div className="mb-4 flex px-4 md:px-0">
          <a
            href="/"
            className="bg-white cursor-pointer p-2 rounded-lg flex items-center gap-2 border-2 border-gray-200"
          >
            <AiOutlineArrowLeft />
            Back to list
          </a>
        </div>

        {!isLoading ? (
          data && !error ? (
            <PokemonInfoCard card={data} />
          ) : (
            <div
              data-testid="error-message"
              className="text-red-500 text-center w-full col-span-full"
            >
              Error loading Pokemon info,{" "}
              <button
                onClick={() => refetch()}
                className="cursor-pointer underline"
              >
                Retry
              </button>
            </div>
          )
        ) : (
          <PokemonInfoCardSkeleton />
        )}
      </div>
    </div>
  );
};

export default Info;
