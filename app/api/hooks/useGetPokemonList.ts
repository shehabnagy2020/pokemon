import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { PokemonList } from "~/types/pokemon";

const getPpkemonList = async (
  limit: number,
  offset: number
): Promise<PokemonList> => {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );
  return response.data;
};

export const useGetPokemonList = (limit: number, offset: number) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["pokemonList", limit, offset],
    queryFn: () => getPpkemonList(limit, offset),
  });

  if (error) {
    console.error("Error fetching Pokemon list:", error);
  }

  return { data, error, isLoading, refetch };
};
