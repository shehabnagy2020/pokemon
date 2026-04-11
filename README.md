# Pokémon Explorer

A sleek Pokémon browser/explorer application built with React and TypeScript, powered by the [PokeAPI v2](https://pokeapi.co/). Browse, search, and explore Pokémon with detailed stats, abilities, and evolution chains — all wrapped in a beautiful dark-themed glassmorphic UI.

## Features

- **Pokémon Gallery** — Browse all Pokémon in a responsive grid layout
- **Search & Filter** — Search by name and filter by Pokémon type
- **Dual Pagination Modes** — Toggle between traditional page numbers and infinite scroll
- **Detailed Pokémon View** — View stats, abilities, flavor text, and evolution chains
- **Animated Stat Bars** — Color-coded base stats with smooth animations
- **Evolution Chain Tree** — Recursively rendered evolution paths with sprites
- **Dark Glassmorphic UI** — Modern glassmorphism design with type-specific color theming
- **Responsive Design** — Works seamlessly on desktop and mobile

## Tech Stack

- **React 19** — UI framework
- **TypeScript 6** — Type safety
- **React Router DOM 7** — Client-side routing
- **Axios** — HTTP client for API requests
- **Context API** — Central state management
- **CSS3** — Plain CSS with glassmorphism and animations
- **Jest & React Testing Library** — Testing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/shehabnagy2020/pokemon.git
cd pokemon

# Install dependencies
npm install

# Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Available Scripts

### `npm start`

Runs the app in development mode. The page will reload when you make changes.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder. The build is optimized and ready for deployment.

### `npm run eject`

**Note: this is a one-way operation.** Once you eject, you can't go back. This copies all build configurations into your project for full control.

## Project Structure

```
src/
├── components/
│   └── PokemonCard.tsx        # Pokémon card component for the grid
├── context/
│   └── PokemonContext.tsx     # Central state management (Context API)
├── pages/
│   ├── PokemonList.tsx        # Home page: grid, search, filter, pagination
│   └── PokemonDetails.tsx     # Detail page: stats, abilities, evolution chain
├── services/
│   └── pokemonApi.ts          # API client with typed interfaces
├── hooks/                     # Custom hooks (reserved for future use)
├── App.tsx                    # Root component with Router + Provider
├── App.css                    # Navbar styles
├── index.tsx                  # Application entry point
└── index.css                  # Global styles (dark theme, scrollbar)
```

## Architecture

The app follows a layered architecture:

1. **Service Layer** (`pokemonApi.ts`) — Axios-based API client with TypeScript interfaces for all PokeAPI responses
2. **State Management** (`PokemonContext.tsx`) — React Context API manages pagination, search, filtering, and data fetching
3. **Presentation Layer** — Pages and components consume the context to render the UI

**Data Flow:** `pokemonApi.ts` → `PokemonContext.tsx` → Pages/Components

## API

This app uses the free [PokeAPI v2](https://pokeapi.co/) with the following endpoints:

| Endpoint | Purpose |
|---|---|
| `/pokemon?limit=&offset=` | List all Pokémon (paginated) |
| `/pokemon/{id}` | Get single Pokémon details |
| `/pokemon-species/{id}` | Get species data (flavor text, evolution chain URL) |
| `/type` | Get all Pokémon types |
| `/evolution-chain/{chainId}` | Get full evolution chain |

## License

This project is open source and available under the [MIT License](LICENSE).
