import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Album {
  id: number;
  title: string;
  artist: string;
  price: number;
  image: string;
  year?: string;
}

export default function FeaturedCarousel() {
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

  const featuredAlbums: Album[] = [
    {
      id: 1,
      title: "Abbey Road",
      artist: "The Beatles",
      price: 30000,
      image:
        "https://via.placeholder.com/400x400/e76f51/ffffff?text=Abbey+Road",
      year: "1969",
    },
    {
      id: 2,
      title: "The Dark Side of the Moon",
      artist: "Pink Floyd",
      price: 35000,
      image:
        "https://via.placeholder.com/400x400/264653/ffffff?text=Pink+Floyd",
      year: "1973",
    },
    {
      id: 3,
      title: "Thriller",
      artist: "Michael Jackson",
      price: 32000,
      image: "https://via.placeholder.com/400x400/2a9d8f/ffffff?text=Thriller",
      year: "1982",
    },
    {
      id: 4,
      title: "Rumours",
      artist: "Fleetwood Mac",
      price: 28000,
      image: "https://via.placeholder.com/400x400/e9c46a/000000?text=Rumours",
      year: "1977",
    },
    {
      id: 5,
      title: "Back in Black",
      artist: "AC/DC",
      price: 29000,
      image: "https://via.placeholder.com/400x400/f4a261/000000?text=AC/DC",
      year: "1980",
    },
  ];

  const maxIndex = Math.max(0, featuredAlbums.length - itemsPerView);

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
    <section className="featured-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Vinilos Destacados</h2>
          <p className="section-subtitle">Las joyas de nuestra colección</p>
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
              {featuredAlbums.map((album) => (
                <div key={album.id} className="carousel-item">
                  <div className="album-card featured-card">
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
                      {album.year && <p className="album-year">{album.year}</p>}
                      <p className="album-price">
                        ${album.price.toLocaleString()}
                      </p>
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
