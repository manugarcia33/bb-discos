import { X, Disc3 } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryClick?: (category: string) => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  onCategoryClick,
}: SidebarProps) {
  const categories = [
    { id: "all", name: "Todos los Vinilos", icon: "🎵" },
    { id: "international", name: "Bandas Internacionales", icon: "🌍" },
    { id: "solistas-masculinos", name: "Solistas Masculinos", icon: "🎤" },
    { id: "solistas-femeninas", name: "Solistas Femeninas", icon: "⭐" },
    { id: "jazz", name: "Jazz", icon: "🎺" },
    { id: "brasilera", name: "Musica Brasilera", icon: "🕺" },
    { id: "others", name: "Otros", icon: "📀" },
  ];

  const handleCategoryClick = (categoryId: string) => {
    if (onCategoryClick) {
      onCategoryClick(categoryId);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`sidebar-menu ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">
            <Disc3 size={24} />
            <h3>Categorías</h3>
          </div>
          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X size={24} />
          </button>
        </div>

        <div className="sidebar-content">
          <nav className="category-nav">
            {categories.map((category) => (
              <button
                key={category.id}
                className="category-item"
                onClick={() => handleCategoryClick(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
