import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PokemonProvider } from './context/PokemonContext';
import App from './App';

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <PokemonProvider>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </PokemonProvider>
  );
};

test('renders Pokemon App navigation', async () => {
  renderWithProviders(<App />);
  const navLogo = await waitFor(() => screen.getByText('Pokemon App'));
  expect(navLogo).toBeInTheDocument();
});

test('renders Pokemon List page on home route', async () => {
  renderWithProviders(<App />);
  const title = await waitFor(() => screen.getByText('Pokemon List'), { timeout: 10000 });
  expect(title).toBeInTheDocument();
});
