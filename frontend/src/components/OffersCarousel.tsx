import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { getProducts, type Product } from "../services/api";

interface OfferAlbum {
  id: number;
  title: string;
  artist: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
}

export default function OffersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [offerAlbums, setOfferAlbums] = useState<OfferAlbum[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar ofertas desde la API
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const products = await getProducts({ onSale: true });

        if (products && Array.isArray(products)) {
          const offers = products.map((product: Product) => ({
            id: product.id,
            title: product.title,
            artist: product.artist,
            price: product.price,
            originalPrice:
              product.discountPercentage > 0
                ? Math.round(
                    product.price / (1 - product.discountPercentage / 100),
                  )
                : product.price,
            discount: product.discountPercentage || 0,
            image:
              product.imageUrl ||
              "https://images.unsplash.com/photo-1619983081563-430f63602796?w=400&h=400&fit=crop",
          }));
          setOfferAlbums(offers);
        }
      } catch (error) {
        console.error("Error al cargar ofertas:", error);
        // En caso de error, dejar el array vacío
        setOfferAlbums([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 992) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
      setCurrentIndex(0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Datos por defecto si no hay ofertas
  const defaultOffers: OfferAlbum[] = [
    {
      id: 1,
      title: "Led Zeppelin IV",
      artist: "Led Zeppelin",
      price: 24000,
      originalPrice: 32000,
      discount: 25,
      image:
        "https://images.unsplash.com/photo-1619983081563-430f63602796?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      title: "Hotel California",
      artist: "Eagles",
      price: 21000,
      originalPrice: 28000,
      discount: 25,
      image:
        "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      title: "Born to Run",
      artist: "Bruce Springsteen",
      price: 19500,
      originalPrice: 26000,
      discount: 25,
      image:
        "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      title: "The Wall",
      artist: "Pink Floyd",
      price: 27000,
      originalPrice: 36000,
      discount: 25,
      image:
        "https://images.unsplash.com/photo-1512733596533-7b00ccf8ebaf?w=400&h=400&fit=crop",
    },
    {
      id: 5,
      title: "Nevermind",
      artist: "Nirvana",
      price: 22500,
      originalPrice: 30000,
      discount: 25,
      image:
        "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=400&fit=crop",
    },
  ];

  // Usar datos reales o por defecto
  const displayAlbums =
    isLoading || offerAlbums.length === 0 ? defaultOffers : offerAlbums;
  const maxIndex = Math.max(0, displayAlbums.length - itemsPerView);

  // Debug temporal
  console.log("OffersCarousel:", {
    isLoading,
    offerAlbumsLength: offerAlbums.length,
    displayAlbumsLength: displayAlbums.length,
  });

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const getTransform = () => {
    const percentage = 100 / itemsPerView;
    return `translateX(-${currentIndex * percentage}%)`;
  };

  return (
    <section className="offers-section">
      <div className="container">
        <div className="section-header">
          <div className="offers-title-wrapper">
            <Tag size={32} className="offers-icon" />
            <h2 className="section-title">Ofertas Especiales</h2>
          </div>
          <p className="section-subtitle">Aprovechá estos precios únicos</p>
        </div>

        <div className="carousel-container">
          <button
            className="carousel-btn carousel-btn-left"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Anterior"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="carousel-track">
            <div
              className="carousel-items"
              style={{
                transform: getTransform(),
              }}
            >
              {displayAlbums.map((album) => (
                <div key={album.id} className="carousel-item">
                  <div className="album-card offer-card">
                    <div className="offer-badge">{album.discount}% OFF</div>
                    <div className="album-image-wrapper">
                      <img
                        src={album.image}
                        alt={album.title}
                        className="album-image"
                      />
                      <div className="album-overlay">
                        <button className="btn-view-details">
                          Ver detalles
                        </button>
                      </div>
                    </div>
                    <div className="album-info">
                      <h3 className="album-title">{album.title}</h3>
                      <p className="album-artist">{album.artist}</p>
                      <div className="price-wrapper">
                        <p className="album-price-original">
                          ${album.originalPrice.toLocaleString()}
                        </p>
                        <p className="album-price">
                          ${album.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="carousel-btn carousel-btn-right"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Siguiente"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </section>
  );
}
