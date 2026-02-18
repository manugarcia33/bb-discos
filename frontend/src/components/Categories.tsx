import { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
  images: string[]; // Cambiado de 'image' a 'images' (array de 3 fotos)
  description: string;
}

interface CategoriesProps {
  onSelectCategory?: (category: string) => void;
}

export default function Categories({ onSelectCategory }: CategoriesProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories: Category[] = [
    {
      id: 1,
      name: "Bandas Internacionales",
      images: [
        "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&h=400&fit=crop",
      ],
      description: "Grupos icónicos que marcaron la historia de la música",
    },
    {
      id: 2,
      name: "Solistas Masculinos",
      images: [
        "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
      ],
      description: "Artistas que dejaron huella con su estilo único",
    },
    {
      id: 3,
      name: "Solistas Femeninas",
      images: [
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=400&fit=crop",
      ],
      description: "Grandes artistas que brillan con su talento",
    },
    {
      id: 4,
      name: "Jazz",
      images: [
        "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&h=400&fit=crop",
      ],
      description: "Improvisación, elegancia y clásicos inolvidables",
    },
    {
      id: 5,
      name: "Musica Brasilera",
      images: [
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=600&h=400&fit=crop",
      ],
      description: "Ritmos vibrantes entre samba, bossa nova y MPB",
    },
    {
      id: 6,
      name: "Musica Nacional",
      images: [
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1488376739440-efe0d0a1ed5b?w=600&h=400&fit=crop",
      ],
      description: "Joyas de la música argentina que nos acompañan siempre",
    },
  ];

  // Efecto para alternar entre las 3 imágenes cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 3000); // Cambia cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="categories-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Explorá por Género</h2>
          <p className="section-subtitle">Encontrá tu sonido perfecto</p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => onSelectCategory?.(category.name)}
            >
              <div className="category-image-wrapper">
                <img
                  src={category.images[currentImageIndex]}
                  alt={category.name}
                  className="category-image"
                  key={currentImageIndex} // Fuerza re-render para animación
                />
                <div className="category-overlay"></div>
              </div>
              <div className="category-content">
                <h3 className="genre-name">{category.name}</h3>
                <p className="genre-description">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
