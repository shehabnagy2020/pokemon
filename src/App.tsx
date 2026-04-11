import { PokemonProvider } from './context/PokemonContext';
import './App.css';
import PokemonList from './pages/PokemonList';
import PokemonDetails from './pages/PokemonDetails';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <PokemonProvider>
      <Router>
        <div className="App">
          <nav className="app-nav">
            <div className="nav-content">
              <Link to="/" className="nav-logo">
                Pokemon App
              </Link>
              <div className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
              </div>
            </div>
          </nav>
          <main className="app-main">
            <Routes>
              <Route path="/" element={<PokemonList />} />
              <Route path="/pokemon/:id" element={<PokemonDetails />} />
            </Routes>
          </main>
        </div>
      </Router>
    </PokemonProvider>
  );
}

export default App;
