import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import pokemonApi from "../services/pokemonApi";

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
  const [allPokemonNames, setAllPokemonNames] = useState<{ name: string; url: string }[]>([]);
  const [currentPagePokemon, setCurrentPagePokemon] = useState<PokemonCardData[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetailsData | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [pokemonTypes, setPokemonTypes] = useState<{ results: { name: string; url: string }[] } | null>(null);
  const [page, setPage] = useState(1);
  const [totalPokemonCount, setTotalPokemonCount] = useState(0);
  const [paginationMode, setPaginationMode] = useState<"pages" | "infinite">("pages");

  const itemsPerPage = 10;
  const fetchVersionRef = useRef(0);

  // Fetch Pokemon types once on mount
  useEffect(() => {
    pokemonApi.getPokemonTypes()
      .then((types) => setPokemonTypes(types))
      .catch((err) => console.error("Error fetching Pokemon types:", err));
  }, []);

  // Fetch all Pokemon names once on mount
  useEffect(() => {
    pokemonApi.getAllPokemonNames()
      .then((names) => {
        setAllPokemonNames(names);
      })
      .catch((err) => console.error("Error fetching all Pokemon names:", err));
  }, []);

  // Single data-fetching effect
  useEffect(() => {
    // Don't run until names are loaded
    if (allPokemonNames.length === 0) {
      return;
    }

    const myVersion = ++fetchVersionRef.current;

    const fetchData = async () => {
      setError(null);

      if (initialLoading) setInitialLoading(false);
      setFetching(true);

      try {
        // Step 1: Compute the filtered list of names
        let filtered = allPokemonNames;

        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter((p) => p.name.toLowerCase().includes(term));
        }

        if (selectedType) {
          const typeData = await pokemonApi.getPokemonByType(selectedType);
          // Check if we've been superseded by a newer fetch
          if (fetchVersionRef.current !== myVersion) return;
          const nameSet = new Set(typeData.pokemon.map((p) => p.pokemon.name));
          filtered = filtered.filter((p) => nameSet.has(p.name));
        }

        if (fetchVersionRef.current !== myVersion) return;

        setTotalPokemonCount(filtered.length);

        // Step 2: Paginate
        const offset = (page - 1) * itemsPerPage;
        const pageItems = filtered.slice(offset, offset + itemsPerPage);

        if (pageItems.length === 0) {
          if (!(paginationMode === "infinite" && page > 1)) {
            setCurrentPagePokemon([]);
          }
          setFetching(false);
          return;
        }

        // Step 3: Fetch details for this page
        const pokemonDetails = await Promise.all(
          pageItems.map(async (pokemon) => {
            const urlParts = pokemon.url.split("/").filter(Boolean);
            const pokemonId = parseInt(urlParts[urlParts.length - 1], 10);
            try {
              const details = await pokemonApi.getPokemonById(pokemonId);
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
          })
        );

        // Check if superseded
        if (fetchVersionRef.current !== myVersion) return;

        if (paginationMode === "infinite" && page > 1) {
          setCurrentPagePokemon((prev) => [...prev, ...pokemonDetails]);
        } else {
          setCurrentPagePokemon(pokemonDetails);
        }
      } catch (err: any) {
        if (fetchVersionRef.current === myVersion) {
          setError("Failed to fetch Pokemon data");
          console.error(err);
        }
      } finally {
        if (fetchVersionRef.current === myVersion) {
          setFetching(false);
        }
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchTerm, selectedType, paginationMode, allPokemonNames.length]);

  const handleSetSearchTerm = useCallback((term: string) => {
    setPage(1);
    setSearchTerm(term);
  }, []);

  const handleSetSelectedType = useCallback((type: string) => {
    setPage(1);
    setSelectedType(type);
  }, []);

  const handleSetPaginationMode = useCallback((mode: "pages" | "infinite") => {
    setPaginationMode(mode);
    setPage(1);
    setCurrentPagePokemon([]);
  }, []);

  const loadMore = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const fetchPage = useCallback(async () => {
    setPage(1);
  }, []);

  const fetchPokemonDetails = useCallback(async (id: number | string): Promise<PokemonDetailsData> => {
    setInitialLoading(true);
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
      setInitialLoading(false);
    }
  }, []);

  const loading = initialLoading || fetching;
  const filteredPokemon = currentPagePokemon;
  const totalPages = totalPokemonCount > 0 ? Math.ceil(totalPokemonCount / itemsPerPage) : 1;

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
    hasMore: currentPagePokemon.length < totalPokemonCount,
  };

  return (
    <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>
  );
};
