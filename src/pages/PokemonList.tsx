import { useRef, useEffect } from 'react';
import { usePokemon } from '../context/PokemonContext';
import PokemonCard from '../components/PokemonCard';
import './PokemonList.css';

function PokemonList() {
  const {
    page,
    setPage,
    totalPages,
    totalPokemonCount,
    loading,
    error,
    searchTerm,
    selectedType,
    pokemonTypes,
    setSearchTerm,
    setSelectedType,
    paginationMode,
    setPaginationMode,
    currentPagePokemon,
    loadMore,
    hasMore,
  } = usePokemon();
  const itemsPerPage = 10;

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePageClick = (pageNum: number) => {
    setPage(pageNum);
  };

  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // IntersectionObserver for infinite scroll
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (paginationMode !== 'infinite' || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    const current = sentinelRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [paginationMode, hasMore, loading, loadMore]);

  if (loading && currentPagePokemon.length === 0) {
    return (
      <div className="pokemon-list-page">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-line"></div>
            <div className="spinner-dot"></div>
          </div>
          <p>Loading Pokemon...</p>
        </div>
      </div>
    );
  }

  if (error && currentPagePokemon.length === 0) {
    return (
      <div className="pokemon-list-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pokemon-list-page">
      <div className="page-header">
        <h1 className="page-title">Pokemon List</h1>
        <p className="page-subtitle">Explore all {totalPokemonCount} Pokemon</p>
      </div>

      <div className="pagination-mode-toggle">
        <button
          className={`mode-btn ${paginationMode === 'pages' ? 'active' : ''}`}
          onClick={() => setPaginationMode('pages')}
        >
          <span className="mode-icon">📄</span>
          Page Numbers
        </button>
        <button
          className={`mode-btn ${paginationMode === 'infinite' ? 'active' : ''}`}
          onClick={() => setPaginationMode('infinite')}
        >
          <span className="mode-icon">♾️</span>
          Infinite Scroll
        </button>
      </div>

      <div className="filters-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Pokemon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Search Pokemon"
          />
        </div>

        <div className="type-filter-container">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="type-select"
            aria-label="Filter by type"
          >
            <option value="">All Types</option>
            {pokemonTypes?.results?.map(type => (
              <option key={type.name} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="results-info">
        {currentPagePokemon.length > 0 ? (
          paginationMode === 'infinite' ? (
            <span>
              Showing {currentPagePokemon.length} of {totalPokemonCount} Pokemon
            </span>
          ) : (
            <span>
              Showing {(page - 1) * itemsPerPage + 1}–{Math.min(page * itemsPerPage, totalPokemonCount)} of {totalPokemonCount} Pokemon
            </span>
          )
        ) : (
          <span>No Pokemon found</span>
        )}
      </div>

      <div className="pokemon-grid">
        {currentPagePokemon?.map(pokemon => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      {paginationMode === 'pages' && (
        <div className="pagination">
          <button className="pagination-btn" onClick={handlePrevPage} disabled={page <= 1}>
            ← Previous
          </button>

          <div className="page-numbers">
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                className={`page-number-btn ${page === pageNum ? 'active' : ''}`}
                onClick={() => handlePageClick(pageNum)}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button className="pagination-btn" onClick={handleNextPage} disabled={page >= totalPages || totalPages <= 1}>
            Next →
          </button>
        </div>
      )}

      {paginationMode === 'infinite' && (
        <div ref={sentinelRef} className="infinite-sentinel">
          {loading && (
            <div className="loading-container loading-inline">
              <div className="loading-spinner loading-inline-spinner">
                <div className="spinner-line"></div>
                <div className="spinner-dot"></div>
              </div>
              <p>Loading more...</p>
            </div>
          )}
          {!hasMore && !loading && (
            <div className="end-message">
              <p>✨ You've reached the end! All {totalPokemonCount} Pokemon loaded.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PokemonList;
