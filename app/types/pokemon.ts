export type PokemonList = {
  count: number;
  next: string;
  previous: string;
  results: PokemonListItem[];
};

export type PokemonListItem = {
  name: string;
  url: string;
};

export interface PokemonInfo {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  order: number;
  is_default: boolean;
  abilities: AbilityEntry[];
  sprites: PokemonSprites;
  stats: StatEntry[];
  types: TypeEntry[];
  moves: MoveEntry[];
  species: PokemonSpecies;
}

export interface PokemonSpecies {
  name: string;
  url: string;
}

export interface AbilityEntry {
  ability: NamedAPIResource;
  is_hidden: boolean;
  slot: number;
}

export interface PokemonSprites {
  front_default: string | null;
  back_default: string | null;
  front_shiny: string | null;
  back_shiny: string | null;
  other?: {
    dream_world?: {
      front_default: string | null;
    };
    "official-artwork"?: {
      front_default: string | null;
    };
  };
}

export interface StatEntry {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface TypeEntry {
  slot: number;
  type: NamedAPIResource;
}

export interface MoveEntry {
  move: NamedAPIResource;
  version_group_details: VersionGroupDetail[];
}

export interface VersionGroupDetail {
  level_learned_at: number;
  move_learn_method: NamedAPIResource;
  version_group: NamedAPIResource;
}

export interface NamedAPIResource {
  name: string;
  url: string;
}
