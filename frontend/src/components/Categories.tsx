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
        "https://res.cloudinary.com/dzjik8puv/image/upload/v1771457184/WhatsApp_Image_2026-02-18_at_10.21.58_AM_lxupq1.jpg",
        "https://res.cloudinary.com/dzjik8puv/image/upload/v1771457193/WhatsApp_Image_2026-02-18_at_10.21.58_AM_2_qz4u14.jpg",
        "https://res.cloudinary.com/dzjik8puv/image/upload/v1771457183/WhatsApp_Image_2026-02-18_at_10.21.58_AM_1_iaipmr.jpg",
      ],
      description: "Grupos icónicos que marcaron la historia de la música",
    },
    {
      id: 2,
      name: "Solistas Masculinos",
      images: [
        "https://res.cloudinary.com/dzjik8puv/image/upload/v1771457184/WhatsApp_Image_2026-02-18_at_10.24.45_AM_1_qiqhbp.jpg",
        "https://res.cloudinary.com/dzjik8puv/image/upload/v1771457184/WhatsApp_Image_2026-02-18_at_10.24.46_AM_cyeqfk.jpg",
        "https://res.cloudinary.com/dzjik8puv/image/upload/v1771457184/WhatsApp_Image_2026-02-18_at_10.24.45_AM_xvhnzj.jpg",
      ],
      description: "Artistas que dejaron huella con su estilo único",
    },
    {
      id: 3,
      name: "Solistas Femeninas",
      images: [
        "https://res.cloudinary.com/dzjik8puv/image/upload/v1771457184/WhatsApp_Image_2026-02-18_at_10.27.59_AM_b0rhoz.jpg",
        "https://res.cloudinary.com/dzjik8puv/image/upload/v1771457184/WhatsApp_Image_2026-02-18_at_10.27.59_AM_1_bkigdw.jpg",
        "https://res.cloudinary.com/dzjik8puv/image/upload/v1771457183/WhatsApp_Image_2026-02-18_at_10.37.59_AM_ela2nv.jpg",
      ],
      description: "Grandes artistas que brillan con su talento",
    },
    {
      id: 4,
      name: "Jazz",
      images: [
        "https://res.cloudinary.com/dzjik8puv/image/upload/v1771457185/WhatsApp_Image_2026-02-18_at_10.29.22_AM_1_bzqxea.jpg",
        "https://res.cloudinary.com/dzjik8puv/image/upload/v1771457193/WhatsApp_Image_2026-02-18_at_10.29.22_AM_2_hg1m92.jpg",
        "https://res.cloudinary.com/dzjik8puv/image/upload/v1771457193/WhatsApp_Image_2026-02-18_at_10.29.22_AM_q5htu1.jpg",
      ],
      description: "Improvisación, elegancia y clásicos inolvidables",
    },
    {
      id: 5,
      name: "Musica Brasilera",
      images: [
        "https://res.cloudinary.com/dzjik8puv/image/upload/v1771457193/WhatsApp_Image_2026-02-18_at_10.32.04_AM_iktmr5.jpg",
        "https://res.cloudinary.com/dzjik8puv/image/upload/v1771457193/WhatsApp_Image_2026-02-18_at_10.32.05_AM_1_qedzgb.jpg",
        "https://res.cloudinary.com/dzjik8puv/image/upload/v1771457200/WhatsApp_Image_2026-02-18_at_10.32.05_AM_l1tyi6.jpg",
      ],
      description: "Ritmos vibrantes entre samba, bossa nova y MPB",
    },
    {
      id: 6,
      name: "Musica Nacional",
      images: [
        "https://res.cloudinary.com/dzjik8puv/image/upload/v1771457200/WhatsApp_Image_2026-02-18_at_10.33.21_AM_1_a6m7kw.jpg",
        "https://res.cloudinary.com/dzjik8puv/image/upload/v1771457204/WhatsApp_Image_2026-02-18_at_10.33.21_AM_fhqsp6.jpg",
        "https://res.cloudinary.com/dzjik8puv/image/upload/v1771457204/WhatsApp_Image_2026-02-18_at_10.33.21_AM_2_qfmwfs.jpg",
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
