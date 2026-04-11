import { useNavigate } from 'react-router-dom';
import './PokemonCard.css';
import { PokemonCardData } from '../context/PokemonContext';

const typeColors: Record<string, string> = {
  grass: '#4CAF50',
  fire: '#F44336',
  water: '#2196F3',
  electric: '#FFD600',
  psychic: '#E040FB',
  ice: '#00E5FF',
  dragon: '#651FFF',
  dark: '#424242',
  fairy: '#FF4081',
  normal: '#9E9E9E',
  fighting: '#FF5722',
  flying: '#7C4DFF',
  poison: '#9C27B0',
  ground: '#8D6E63',
  rock: '#A1887F',
  bug: '#76FF03',
  ghost: '#B388FF',
  steel: '#90A4AE',
};

interface PokemonCardProps {
  pokemon: PokemonCardData;
}

function PokemonCard({ pokemon }: PokemonCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/pokemon/${pokemon.id}`);
  };

  const primaryType = pokemon.types[0];
  const typeColor = typeColors[primaryType] || '#9E9E9E';

  return (
    <div
      className="pokemon-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      style={{ '--card-color': typeColor } as React.CSSProperties}
    >
      <div className="pokemon-header">
        <span className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</span>
        <div className="pokemon-types">
          {pokemon.types.map(type => (
            <span
              key={type}
              className="pokemon-type"
              style={{ backgroundColor: typeColors[type] || '#9E9E9E' }}
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      <div className="pokemon-image-container">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="pokemon-image"
          loading="lazy"
        />
      </div>

      <h3 className="pokemon-name">{pokemon.name}</h3>

      <div className="pokemon-abilities">
        {pokemon.abilities.slice(0, 2).map(ability => (
          <span key={ability} className="ability-tag">
            {ability}
          </span>
        ))}
      </div>
    </div>
  );
}

export default PokemonCard;
