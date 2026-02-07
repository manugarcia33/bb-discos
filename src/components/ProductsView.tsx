import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import FiltersBar from "./FiltersBar";

interface Product {
  id: number;
  title: string;
  artist: string;
  price: number;
  installments: number;
  genre: string;
}

interface ProductsViewProps {
  products: Product[];
  onNavigateHome: () => void;
}

export default function ProductsView({
  products,
  onNavigateHome,
}: ProductsViewProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filtro por género
      const matchesGenre =
        selectedGenres.length === 0 || selectedGenres.includes(product.genre);

      // Filtro por precio
      const matchesMinPrice = minPrice === 0 || product.price >= minPrice;
      const matchesMaxPrice = maxPrice === 0 || product.price <= maxPrice;
      const matchesPrice = matchesMinPrice && matchesMaxPrice;

      return matchesGenre && matchesPrice;
    });
  }, [products, selectedGenres, minPrice, maxPrice]);

  return (
    <div className="products-section">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a onClick={onNavigateHome}>Inicio</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Productos
            </li>
          </ol>
        </nav>

        <div className="row">
          {/* Sidebar - Filters */}
          <div className="col-lg-3 col-md-4 col-12">
            <FiltersBar
              selectedGenres={selectedGenres}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onGenreChange={setSelectedGenres}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
            />
          </div>

          {/* Product Grid */}
          <div className="col-lg-9 col-md-8 col-12">
            {/* Results Count */}
            <div className="products-header">
              <h2 className="products-count">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "producto" : "productos"}
              </h2>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="row">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="col-lg-4 col-md-6 col-12 mb-4"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-products">
                <p>
                  No se encontraron productos con los filtros seleccionados.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
