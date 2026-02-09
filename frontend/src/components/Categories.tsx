interface Category {
  id: number;
  name: string;
  image: string;
  description: string;
}

interface CategoriesProps {
  onSelectCategory?: (category: string) => void;
}

export default function Categories({ onSelectCategory }: CategoriesProps) {
  const categories: Category[] = [
    {
      id: 1,
      name: "Bandas Internacionales",
      image:
        "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&h=400&fit=crop",
      description: "Las mejores bandas de todos los tiempos",
    },
    {
      id: 2,
      name: "Solistas Masculinos",
      image:
        "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600&h=400&fit=crop",
      description: "Voces que marcaron época",
    },
    {
      id: 3,
      name: "Solistas Femeninas",
      image:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=400&fit=crop",
      description: "Grandes voces femeninas",
    },
    {
      id: 4,
      name: "Jazz",
      image:
        "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&h=400&fit=crop",
      description: "El alma de la música",
    },
    {
      id: 5,
      name: "Musica Brasilera",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
      description: "Ritmo y sentimiento",
    },
    {
      id: 6,
      name: "Musica Nacional",
      image:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop",
      description: "Clásicos argentinos",
    },
  ];

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
                  src={category.image}
                  alt={category.name}
                  className="category-image"
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
