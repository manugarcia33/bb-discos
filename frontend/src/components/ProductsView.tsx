import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import FiltersBar from "./FiltersBar";
import { getProducts } from "../services/api";

interface Product {
  id: number;
  title: string;
  artist: string;
  price: number;
  installments: number;
  genre: string;
}

export default function ProductsView() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar productos filtrados desde la API cuando cambien los filtros
  useEffect(() => {
    loadFilteredProducts();
  }, [selectedGenres, minPrice, maxPrice]);

  const loadFilteredProducts = async () => {
    setLoading(true);
    try {
      const filters = {
        category: selectedGenres,
        minPrice,
        maxPrice,
      };
      const productsData = await getProducts(filters);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error("Error al cargar productos filtrados:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="products-section">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Inicio</Link>
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
                {loading
                  ? "Cargando..."
                  : `${filteredProducts.length} ${filteredProducts.length === 1 ? "producto" : "productos"}`}
              </h2>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <p>Aplicando filtros...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
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
