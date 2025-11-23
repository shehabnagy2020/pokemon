import React from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import type { PokemonInfo } from "~/types/pokemon";
import TypesBadges from "../typesBadges";
import StatsProgress from "../statsProgress";
import AbilityState from "../abilityState";
import { IMAGES_FALLBACK_URL } from "~/utils/const";

type PokemonInfoCardProps = {
  card: PokemonInfo;
};

const PokemonInfoCard: React.FC<PokemonInfoCardProps> = ({ card }) => {
  return (
    <div className="sm:rounded-md bg-white shadow-md overflow-hidden">
      <div className="w-full text-white bg-linear-to-r from-[#aa55f0] to-[#e8489e] p-2 flex flex-col gap-2 items-center">
        <h1
          className="flex items-center gap-2 capitalize text-2xl font-bold"
          data-testid="pokemon-name"
        >
          <AiFillThunderbolt />
          {card.name}
        </h1>
        <span data-testid="pokemon-id">#{card.id}</span>
      </div>
      <div className="flex flex-col md:flex-row gap-8 p-8">
        <div className="md:w-1/2 shrink-0 flex flex-col gap-6 items-center">
          <img
            className="aspect-square object-contain bg-gray-100 rounded-full w-full"
            src={
              card.sprites?.other?.["official-artwork"]?.front_default ??
              IMAGES_FALLBACK_URL
            }
            alt={card.name}
          />
          <TypesBadges types={card.types} />
          <div className="flex gap-6 w-full">
            <div className="w-full bg-gray-100 rounded-md flex flex-col items-center p-4 gap-2">
              <span className="text-gray-600">Height</span>
              <span data-testid="pokemon-height">{card.height} m</span>
            </div>
            <div className="w-full bg-gray-100 rounded-md flex flex-col items-center p-4 gap-2">
              <span className="text-gray-600">Weight</span>
              <span data-testid="pokemon-weight">{card.weight} Kg</span>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-4">
          <h2 className="font-bold text-xl">Base stats</h2>
          <div className="flex flex-col gap-2">
            {card.stats.map((statEntry, idx) => (
              <StatsProgress
                key={idx}
                name={statEntry.stat.name}
                value={statEntry.base_stat}
              />
            ))}
          </div>
          <h2 className="font-bold text-xl">Abilities</h2>
          <div className="flex flex-col gap-2">
            {card.abilities.map((abilityEntry, idx) => (
              <AbilityState
                name={abilityEntry.ability.name}
                isHidden={abilityEntry.is_hidden}
                slot={abilityEntry.slot}
                key={idx}
              />
            ))}
          </div>
          <h2 className="font-bold text-xl">Base experience</h2>
          <span
            data-testid="pokemon-base-experience"
            className="text-[#aa55f0] font-bold text-xl"
          >
            {card.base_experience} XP
          </span>
        </div>
      </div>
    </div>
  );
};

export default PokemonInfoCard;
