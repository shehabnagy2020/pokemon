import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePokemon, PokemonDetailsData, EvolutionChain } from '../context/PokemonContext';
import './PokemonDetails.css';

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

const statNames: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed'
};

function PokemonDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchPokemonDetails, loading, error } = usePokemon();
  const [pokemonData, setPokemonData] = useState<PokemonDetailsData | null>(null);

  useEffect(() => {
    if (id) {
      fetchPokemonDetails(id).then(setPokemonData);
    }
  }, [id, fetchPokemonDetails]);

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="pokemon-details-page">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-line"></div>
            <div className="spinner-dot"></div>
          </div>
          <p>Loading Pokemon details...</p>
        </div>
      </div>
    );
  }

  if (error || !pokemonData) {
    return (
      <div className="pokemon-details-page">
        <button className="back-btn" onClick={handleBack}>
          &larr; Back to List
        </button>
        <div className="error-container">
          <p className="error-message">{error || 'Pokemon not found'}</p>
        </div>
      </div>
    );
  }

  const primaryType = pokemonData.types[0];
  const typeColor = typeColors[primaryType] || '#9E9E9E';

  return (
    <div className="pokemon-details-page">
      <button className="back-btn" onClick={handleBack}>
        ← Back to List
      </button>

      <div className="details-header" style={{ '--type-color': typeColor } as React.CSSProperties}>
        <div className="details-image-container">
          <img
            src={pokemonData.image}
            alt={pokemonData.name}
            className="details-image"
          />
        </div>

        <div className="details-info">
          <h1 className="details-name">{pokemonData.name}</h1>
          <span className="details-id">#{String(pokemonData.id).padStart(3, '0')}</span>

          <div className="details-types">
            {pokemonData.types.map(type => (
              <span
                key={type}
                className="details-type"
                style={{ backgroundColor: typeColors[type] || '#9E9E9E' }}
              >
                {type}
              </span>
            ))}
          </div>

          <div className="details-meta">
            <div className="meta-item">
              <span className="meta-label">Height</span>
              <span className="meta-value">{pokemonData.height / 10}m</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Weight</span>
              <span className="meta-value">{pokemonData.weight / 10}kg</span>
            </div>
          </div>
        </div>
      </div>

      <div className="details-section">
        <h2 className="section-title">Description</h2>
        <p className="description-text">{pokemonData.description}</p>
      </div>

      <div className="details-section">
        <h2 className="section-title">Abilities</h2>
        <div className="abilities-list">
          {pokemonData.abilities.map((ability, index) => (
            <div key={index} className="ability-item">
              <span className="ability-name">{ability.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="details-section">
        <h2 className="section-title">Base Stats</h2>
        <div className="stats-container">
          {pokemonData.stats.map(stat => (
            <div key={stat.name} className="stat-row">
              <span className="stat-name">{statNames[stat.name] || stat.name}</span>
              <span className="stat-value">{stat.value}</span>
              <div className="stat-bar-container">
                <div
                  className="stat-bar"
                  style={{
                    width: `${Math.min(stat.value, 150) / 150 * 100}%`,
                    backgroundColor: getStatColor(stat.value)
                  } as React.CSSProperties}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {pokemonData.evolutionChain && pokemonData.evolutionChain.chain && (
        <div className="details-section">
          <h2 className="section-title">Evolution Chain</h2>
          <div className="evolution-container">
            <EvolutionChainComponent chain={pokemonData.evolutionChain.chain} />
          </div>
        </div>
      )}
    </div>
  );
}

interface EvolutionChainComponentProps {
  chain: EvolutionChain;
  depth?: number;
}

function EvolutionChainComponent({ chain, depth = 0 }: EvolutionChainComponentProps) {
  if (!chain || !chain.species) return null;

  const speciesId = chain.species.url?.split('/').filter(Boolean).pop();
  const spriteUrl = speciesId
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesId}.png`
    : '';

  return (
    <div className="evolution-tree">
      <div className="evolution-stage">
        {spriteUrl && (
          <img
            src={spriteUrl}
            alt={chain.species.name}
            className="evolution-sprite"
          />
        )}
        <span className="evolution-name">{chain.species.name}</span>
      </div>
      {chain.evolves_to && chain.evolves_to.length > 0 && (
        <div className="evolution-arrows">
          <span className="arrow">&#8594;</span>
        </div>
      )}
      <div className="evolution-children">
        {chain.evolves_to.map((evolution, index) => (
          <EvolutionChainComponent key={index} chain={evolution} depth={depth + 1} />
        ))}
      </div>
    </div>
  );
}

function getStatColor(value: number): string {
  if (value < 50) return '#F44336';
  if (value < 80) return '#FF9800';
  if (value < 100) return '#FFEB3B';
  if (value < 120) return '#8BC34A';
  return '#4CAF50';
}

export default PokemonDetails;
