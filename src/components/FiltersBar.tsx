import { ChevronDown, ChevronUp, DollarSign, Music2 } from "lucide-react";
import { useState } from "react";

interface FiltersBarProps {
  selectedGenres: string[];
  minPrice: number;
  maxPrice: number;
  onGenreChange: (genres: string[]) => void;
  onMinPriceChange: (price: number) => void;
  onMaxPriceChange: (price: number) => void;
}

export default function FiltersBar({
  selectedGenres,
  minPrice,
  maxPrice,
  onGenreChange,
  onMinPriceChange,
  onMaxPriceChange,
}: FiltersBarProps) {
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isGenreOpen, setIsGenreOpen] = useState(true);

  const genres = [
    { id: "international", name: "Bandas Internacionales" },
    { id: "solistas-masculinos", name: "Solistas Masculinos" },
    { id: "solistas-femeninas", name: "Solistas Femeninas" },
    { id: "jazz", name: "Jazz" },
    { id: "nacional", name: "Música Nacional" },
    { id: "brasilera", name: "Música Brasilera" },
    { id: "others", name: "Otros" },
  ];

  const handleGenreToggle = (genreId: string) => {
    if (selectedGenres.includes(genreId)) {
      onGenreChange(selectedGenres.filter((g) => g !== genreId));
    } else {
      onGenreChange([...selectedGenres, genreId]);
    }
  };

  const clearAllFilters = () => {
    onGenreChange([]);
    onMinPriceChange(0);
    onMaxPriceChange(0);
  };

  const hasActiveFilters =
    selectedGenres.length > 0 || minPrice > 0 || maxPrice > 0;

  return (
    <div className="filters-bar">
      <div className="filters-header">
        <h3 className="filters-title">Filtros</h3>
        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearAllFilters}>
            Limpiar todo
          </button>
        )}
      </div>

      {/* Price Filter */}
      <div className="filter-section">
        <button
          className="filter-section-header"
          onClick={() => setIsPriceOpen(!isPriceOpen)}
        >
          <div className="filter-section-title">
            <DollarSign size={18} />
            <span>Precio</span>
          </div>
          {isPriceOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {isPriceOpen && (
          <div className="filter-options price-inputs">
            <div className="price-input-group">
              <label htmlFor="minPrice" className="price-label">
                Precio mínimo
              </label>
              <input
                id="minPrice"
                type="number"
                className="price-input"
                placeholder="Min"
                value={minPrice || ""}
                onChange={(e) => onMinPriceChange(Number(e.target.value) || 0)}
                min="0"
              />
            </div>
            <div className="price-input-group">
              <label htmlFor="maxPrice" className="price-label">
                Precio máximo
              </label>
              <input
                id="maxPrice"
                type="number"
                className="price-input"
                placeholder="Max"
                value={maxPrice || ""}
                onChange={(e) => onMaxPriceChange(Number(e.target.value) || 0)}
                min="0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Genre Filter */}
      <div className="filter-section">
        <button
          className="filter-section-header"
          onClick={() => setIsGenreOpen(!isGenreOpen)}
        >
          <div className="filter-section-title">
            <Music2 size={18} />
            <span>Género</span>
          </div>
          {isGenreOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {isGenreOpen && (
          <div className="filter-options">
            {genres.map((genre) => (
              <label key={genre.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre.id)}
                  onChange={() => handleGenreToggle(genre.id)}
                />
                <span>{genre.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
