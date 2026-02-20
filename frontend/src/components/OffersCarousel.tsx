import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Tag, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { getProducts, type Product } from "../services/api";

const ITEMS_PER_PAGE = 3;

export default function OffersCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      const data = await getProducts({ onSale: true });
      setProducts(data);
      setLoading(false);
    };
    fetchOffers();
  }, []);

  const maxIndex = Math.max(0, products.length - ITEMS_PER_PAGE);

  const prev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((i) => Math.min(maxIndex, i + 1));
  }, [maxIndex]);

  const translateX = -(currentIndex * (100 / ITEMS_PER_PAGE));

  const getOriginalPrice = (product: Product): number => {
    if (product.discountPercentage > 0) {
      return Math.round(product.price / (1 - product.discountPercentage / 100));
    }
    return product.price;
  };

  return (
    <section className="offers-section">
      <div className="container">
        <div className="section-header text-center">
          <div className="offers-title-wrapper">
            <Tag size={28} className="offers-icon" />
            <h2 className="section-title mb-0">Ofertas Especiales</h2>
          </div>
          <p className="section-subtitle">
            Aprovechá los mejores precios en vinilos seleccionados
          </p>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div
              className="spinner-border"
              style={{ color: "var(--color-accent)" }}
              role="status"
            >
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted py-5">
            No hay ofertas disponibles en este momento.
          </p>
        ) : (
          <div className="carousel-container">
            {/* Prev button */}
            <button
              className="carousel-btn carousel-btn-left"
              onClick={prev}
              disabled={currentIndex === 0}
              aria-label="Anterior"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="carousel-track">
              <div
                className="carousel-items"
                style={{ transform: `translateX(${translateX}%)` }}
              >
                {products.map((product) => (
                  <div key={product.id} className="vinyl-slide">
                    <Link
                      to={`/producto/${product.id}`}
                      className="album-card offer-card text-decoration-none d-block"
                    >
                      <div className="album-image-wrapper">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={`${product.artist} - ${product.title}`}
                            className="album-image"
                          />
                        ) : (
                          <div
                            className="album-image d-flex align-items-center justify-content-center"
                            style={{ background: "#e9ecef" }}
                          >
                            <Camera size={48} color="#adb5bd" />
                          </div>
                        )}

                        {/* Discount badge */}
                        {product.discountPercentage > 0 && (
                          <div className="offer-badge">
                            -{product.discountPercentage}%
                          </div>
                        )}

                        <div className="album-overlay">
                          <span className="btn-view-details">Ver oferta</span>
                        </div>
                      </div>

                      <div className="album-info">
                        <p className="album-title">{product.title}</p>
                        <p className="album-artist">{product.artist}</p>
                        {product.year && (
                          <p className="album-year">{product.year}</p>
                        )}

                        <div className="price-wrapper">
                          {product.discountPercentage > 0 && (
                            <span className="album-price-original">
                              $
                              {getOriginalPrice(product).toLocaleString(
                                "es-AR",
                              )}
                            </span>
                          )}
                          <span className="album-price">
                            ${product.price.toLocaleString("es-AR")}
                          </span>
                        </div>

                        <p
                          className="product-installments"
                          style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}
                        >
                          3 cuotas sin interés de $
                          {product.installments.toLocaleString("es-AR")}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Next button */}
            <button
              className="carousel-btn carousel-btn-right"
              onClick={next}
              disabled={currentIndex >= maxIndex}
              aria-label="Siguiente"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        )}

        {/* Dot indicators */}
        {!loading && products.length > ITEMS_PER_PAGE && (
          <div className="d-flex justify-content-center gap-2 mt-4">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  border: "none",
                  background:
                    i === currentIndex ? "var(--color-accent)" : "#d0d0d0",
                  padding: 0,
                  cursor: "pointer",
                  transition: "background 0.3s",
                }}
                aria-label={`Ir a página ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
