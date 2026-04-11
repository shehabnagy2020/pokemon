import axios from 'axios';

// PokeAPI v2 API
const BASE_URL = 'https://pokeapi.co/api/v2';

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}

export interface PokemonType {
  slot: number;
  type: { name: string; url: string };
}

export interface PokemonAbility {
  slot: number;
  ability: { name: string; url: string };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string };
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
}

export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  sprites: PokemonSprites;
  height: number;
  weight: number;
}

export interface PokemonSpeciesFlavorText {
  flavor_text: string;
  language: { name: string; url: string };
  version: { name: string; url: string };
}

export interface PokemonSpecies {
  flavor_text_entries: PokemonSpeciesFlavorText[];
  evolution_chain: { url: string };
}

export interface PokemonTypeResponse {
  results: { name: string; url: string }[];
}

export interface EvolutionChainSpecies {
  name: string;
  url: string;
}

export interface EvolutionChain {
  species: EvolutionChainSpecies;
  evolves_to: EvolutionChain[];
}

export interface EvolutionChainResponse {
  chain: EvolutionChain;
}

const pokemonApi = {
  async getAllPokemon(limit: number = 10, offset: number = 0): Promise<PokemonListResponse> {
    const response = await axios.get<PokemonListResponse>(`${BASE_URL}/pokemon`, {
      params: { limit, offset }
    });
    return response.data;
  },

  async getPokemonById(id: number | string): Promise<Pokemon> {
    const response = await axios.get<Pokemon>(`${BASE_URL}/pokemon/${id}`);
    return response.data;
  },

  async getPokemonSpecies(id: number | string): Promise<PokemonSpecies> {
    const response = await axios.get<PokemonSpecies>(`${BASE_URL}/pokemon-species/${id}`);
    return response.data;
  },

  async getPokemonTypes(): Promise<PokemonTypeResponse> {
    const response = await axios.get<PokemonTypeResponse>(`${BASE_URL}/type`);
    return response.data;
  },

  async getPokemonByType(typeName: string): Promise<PokemonTypeResponse> {
    const response = await axios.get<PokemonTypeResponse>(`${BASE_URL}/types/${typeName}/pokemon`);
    return response.data;
  },

  async getEvolutionChain(chainId: string): Promise<EvolutionChainResponse> {
    const response = await axios.get<EvolutionChainResponse>(`${BASE_URL}/evolution-chain/${chainId}`);
    return response.data;
  }
};

export default pokemonApi;
