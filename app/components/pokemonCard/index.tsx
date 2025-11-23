import React, { useEffect, useState } from "react";
import type { PokemonListItem } from "~/types/pokemon";
import { IMAGES_FALLBACK_URL } from "~/utils/const";

type PokemonCardProps = {
  pokemon: PokemonListItem;
};

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const pokemonId = pokemon.url.split("/").filter(Boolean).pop();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
  const [imgSrc, setImgSrc] = useState(imageUrl);

  useEffect(() => {
    const getImageUrl = async () => {
      try {
        const response = await fetch(imageUrl);
        if (response.ok) {
          setImgSrc(imageUrl);
        } else {
          setImgSrc(IMAGES_FALLBACK_URL);
        }
      } catch {
        setImgSrc(IMAGES_FALLBACK_URL);
      }
    };
    getImageUrl();
  }, [imageUrl]);

  return (
    <a
      data-testid={`pokemon-card-${pokemonId}`}
      href={`/pokemon/${pokemonId}`}
      className="flex flex-col items-center gap-2 bg-white rounded-md p-4 shadow-md hover:shadow-lg transition-shadow"
    >
      <img
        src={imgSrc}
        className="shrink-0 w-full aspect-video bg-gray-100 object-contain rounded-md"
        alt="Pokemon"
      />

      <span data-testid="pokemon-name">{pokemon.name}</span>
      <span data-testid="pokemon-order" className="text-gray-500">
        #{pokemonId}
      </span>
    </a>
  );
};

export default PokemonCard;
