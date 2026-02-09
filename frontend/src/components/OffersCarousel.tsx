import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";

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

  const offerAlbums: OfferAlbum[] = [
    {
      id: 1,
      title: "Led Zeppelin IV",
      artist: "Led Zeppelin",
      price: 24000,
      originalPrice: 32000,
      discount: 25,
      image:
        "https://via.placeholder.com/400x400/6a4c93/ffffff?text=Led+Zeppelin",
    },
    {
      id: 2,
      title: "Hotel California",
      artist: "Eagles",
      price: 21000,
      originalPrice: 28000,
      discount: 25,
      image: "https://via.placeholder.com/400x400/1982c4/ffffff?text=Eagles",
    },
    {
      id: 3,
      title: "Born to Run",
      artist: "Bruce Springsteen",
      price: 19500,
      originalPrice: 26000,
      discount: 25,
      image:
        "https://via.placeholder.com/400x400/8ac926/000000?text=Springsteen",
    },
    {
      id: 4,
      title: "The Wall",
      artist: "Pink Floyd",
      price: 27000,
      originalPrice: 36000,
      discount: 25,
      image: "https://via.placeholder.com/400x400/ff595e/ffffff?text=The+Wall",
    },
    {
      id: 5,
      title: "Nevermind",
      artist: "Nirvana",
      price: 22500,
      originalPrice: 30000,
      discount: 25,
      image: "https://via.placeholder.com/400x400/ffca3a/000000?text=Nirvana",
    },
  ];

  const maxIndex = Math.max(0, offerAlbums.length - itemsPerView);

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
              {offerAlbums.map((album) => (
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
