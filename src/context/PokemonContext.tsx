import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import pokemonApi, { Pokemon, PokemonListResponse } from "../services/pokemonApi";

export interface PokemonCardData {
  id: number;
  name: string;
  types: string[];
  image: string;
  abilities: string[];
}

export interface PokemonAbilityDetail {
  name: string;
  description: string;
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface EvolutionChain {
  species: { name: string; url: string };
  evolves_to: EvolutionChain[];
}

export type EvolutionChainResponseType = {
  chain: EvolutionChain;
};

export interface PokemonDetailsData {
  id: number;
  name: string;
  types: string[];
  image: string;
  abilities: PokemonAbilityDetail[];
  stats: PokemonStat[];
  height: number;
  weight: number;
  description: string;
  evolutionChain: EvolutionChainResponseType | null;
}

interface PokemonContextType {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  totalPokemonCount: number;
  paginationMode: "pages" | "infinite";
  setPaginationMode: (mode: "pages" | "infinite") => void;
  selectedPokemon: PokemonDetailsData | null;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedType: string;
  pokemonTypes: { results: { name: string; url: string }[] } | null;
  setSearchTerm: (term: string) => void;
  setSelectedType: (type: string) => void;
  fetchPage: (replace?: boolean) => Promise<void>;
  fetchPokemonDetails: (id: number | string) => Promise<PokemonDetailsData>;
  setSelectedPokemon: (pokemon: PokemonDetailsData | null) => void;
  filteredPokemon: PokemonCardData[];
  currentPagePokemon: PokemonCardData[];
  loadMore: () => void;
  hasMore: boolean;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const usePokemon = (): PokemonContextType => {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error("usePokemon must be used within a PokemonProvider");
  }
  return context;
};

interface PokemonProviderProps {
  children: ReactNode;
}

export const PokemonProvider = ({ children }: PokemonProviderProps) => {
  const [allPokemonList, setAllPokemonList] = useState<PokemonCardData[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetailsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [pokemonTypes, setPokemonTypes] = useState<{ results: { name: string; url: string }[] } | null>(null);
  const [page, setPage] = useState(1);
  const [totalPokemonCount, setTotalPokemonCount] = useState(0);
  const [paginationMode, setPaginationMode] = useState<"pages" | "infinite">("pages");

  const itemsPerPage = 10;

  const handleSetSearchTerm = (term: string) => {
    setPage(1);
    setAllPokemonList([]);
    setSearchTerm(term);
  };

  const handleSetSelectedType = (type: string) => {
    setPage(1);
    setAllPokemonList([]);
    setSelectedType(type);
  };

  const handleSetPaginationMode = (mode: "pages" | "infinite") => {
    setPaginationMode(mode);
    setPage(1);
    setAllPokemonList([]);
  };

  const fetchPokemonTypes = useCallback(async () => {
    try {
      const types = await pokemonApi.getPokemonTypes();
      setPokemonTypes(types);
    } catch (err) {
      console.error("Error fetching Pokemon types:", err);
    }
  }, []);

  const fetchPage = useCallback(async (replace: boolean = true) => {
    setLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * itemsPerPage;
      const response: PokemonListResponse = await pokemonApi.getAllPokemon(itemsPerPage, offset);
      const data = response.results;
      setTotalPokemonCount(response.count);
      const pokemonDetails = await Promise.all(
        data.map(async (pokemon, index) => {
          // Extract id from the url (e.g. ".../pokemon/1/" -> 1)
          // PokeAPI results are ordered by national dex, so id = offset + index + 1
          const pokemonId = (page - 1) * itemsPerPage + index + 1;
          try {
            const details: Pokemon = await pokemonApi.getPokemonById(pokemonId);
            return {
              id: details.id,
              name: details.name,
              types: details.types.map((t) => t.type.name),
              image: details.sprites.front_default || "",
              abilities: details.abilities.map((a) => a.ability.name),
            };
          } catch (err) {
            console.error(`Error fetching Pokemon ${pokemonId}:`, err);
            return {
              id: pokemonId,
              name: pokemon.name || "Unknown",
              types: [],
              image: "",
              abilities: [],
            };
          }
        }),
      );

      const filtered = pokemonDetails.filter((p) => p.id && p.name);

      if (replace) {
        setAllPokemonList(filtered);
      } else {
        setAllPokemonList((prev) => [...prev, ...filtered]);
      }
    } catch (err) {
      setError("Failed to fetch Pokemon data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Fetch next page and append (for infinite scroll)
  const loadMore = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  // Fetch Pokemon types once on mount
  useEffect(() => {
    fetchPokemonTypes();
  }, [fetchPokemonTypes]);

  // Fetch data when page changes
  useEffect(() => {
    if (paginationMode === "infinite") {
      // In infinite mode: page 1 replaces, page > 1 appends
      fetchPage(page === 1);
    } else {
      // In pages mode: always replace
      fetchPage(true);
    }
  }, [page, paginationMode, fetchPage]);

  const fetchPokemonDetails = useCallback(async (id: number | string): Promise<PokemonDetailsData> => {
    setLoading(true);
    setError(null);
    try {
      const [details, species] = await Promise.all([
        pokemonApi.getPokemonById(id),
        pokemonApi.getPokemonSpecies(id),
      ]);

      const evolutionChainId = species.evolution_chain.url
        .split("/")
        .filter(Boolean)
        .pop();
      const evolutionChain =
        await pokemonApi.getEvolutionChain(evolutionChainId!);

      const pokemonData: PokemonDetailsData = {
        id: details.id,
        name: details.name,
        types: details.types.map((t) => t.type.name),
        image: details.sprites.front_default || "",
        abilities: details.abilities.map((a) => ({
          name: a.ability.name,
          description: a.ability.url,
        })),
        stats: details.stats.map((s) => ({
          name: s.stat.name,
          value: s.base_stat,
        })),
        height: details.height,
        weight: details.weight,
        description:
          species.flavor_text_entries
            .find((entry) => entry.language.name === "en")
            ?.flavor_text.replace(/\f/g, " ") || "",
        evolutionChain,
      };

      setSelectedPokemon(pokemonData);
      return pokemonData;
    } catch (err) {
      setError("Failed to fetch Pokemon details");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredPokemon = allPokemonList.filter((pokemon) => {
    const matchesSearch = pokemon.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || pokemon.types.includes(selectedType);
    return matchesSearch && matchesType;
  });

  // With server-side pagination, currentPagePokemon is the filtered data for this page
  const currentPagePokemon = filteredPokemon;

  const totalPages = Math.ceil(totalPokemonCount / itemsPerPage);

  const value: PokemonContextType = {
    page,
    setPage,
    totalPages,
    totalPokemonCount,
    paginationMode,
    setPaginationMode: handleSetPaginationMode,
    selectedPokemon,
    loading,
    error,
    searchTerm,
    selectedType,
    pokemonTypes,
    setSearchTerm: handleSetSearchTerm,
    setSelectedType: handleSetSelectedType,
    fetchPage,
    fetchPokemonDetails,
    setSelectedPokemon,
    filteredPokemon,
    currentPagePokemon,
    loadMore,
    hasMore: allPokemonList.length < totalPokemonCount,
  };

  return (
    <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>
  );
};
