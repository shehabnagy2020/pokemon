import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PokemonCard from './PokemonCard';
import { PokemonCardData } from '../context/PokemonContext';

const mockPokemon: PokemonCardData = {
  id: 25,
  name: 'pikachu',
  types: ['electric'],
  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  abilities: ['static', 'lightning-rod']
};

const renderWithRouter = (ui: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

test('renders pokemon name', () => {
  renderWithRouter(<PokemonCard pokemon={mockPokemon} />);
  expect(screen.getByText('pikachu')).toBeInTheDocument();
});

test('renders pokemon id with proper formatting', () => {
  renderWithRouter(<PokemonCard pokemon={mockPokemon} />);
  expect(screen.getByText('#025')).toBeInTheDocument();
});

test('renders pokemon type', () => {
  renderWithRouter(<PokemonCard pokemon={mockPokemon} />);
  expect(screen.getByText('electric')).toBeInTheDocument();
});

test('renders pokemon abilities', () => {
  renderWithRouter(<PokemonCard pokemon={mockPokemon} />);
  expect(screen.getByText('static')).toBeInTheDocument();
  expect(screen.getByText('lightning-rod')).toBeInTheDocument();
});

test('renders pokemon image', () => {
  renderWithRouter(<PokemonCard pokemon={mockPokemon} />);
  const image = screen.getByAltText('pikachu');
  expect(image).toBeInTheDocument();
  expect(image).toHaveAttribute('src', mockPokemon.image);
});
