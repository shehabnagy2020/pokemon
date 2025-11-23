import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import type { PokemonInfo } from "~/types/pokemon";

const getPpkemonInfo = async (id?: string): Promise<PokemonInfo> => {
  if (!id) {
    throw new Error("ID is required");
  }

  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return response.data;
};

export const useGetPokemonInfo = (id?: string) => {
  const { data, error, isLoading, refetch } = useQuery<PokemonInfo, AxiosError>(
    {
      queryKey: ["PokemonInfo", id],
      queryFn: () => getPpkemonInfo(id),
      enabled: !!id,
    }
  );

  if (error) {
    console.error("Error fetching Pokemon info:", error);
  }

  return { data, error, isLoading, refetch };
};
