import { Search, User, ShoppingCart, Menu } from "lucide-react";
import logo from "../assets/logo.png";

interface HeaderProps {
  onNavigate: (view: string) => void;
  onToggleSidebar: () => void;
}

export default function Header({ onNavigate, onToggleSidebar }: HeaderProps) {
  return (
    <header className="header-bbdiscos">
      <div className="header-content">
        {/* Left Section: Menu + Logo */}
        <div className="header-left">
          <button className="menu-btn" aria-label="Menú" onClick={onToggleSidebar}>
            <Menu size={24} />
          </button>
          <img
            src={logo}
            alt="BB DISCOS"
            className="logo-image"
            onClick={() => onNavigate("HOME")}
            style={{ cursor: "pointer" }}
          />
        </div>

        {/* Center Section: Search Bar */}
        <div className="header-center">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar vinilos..."
              aria-label="Buscar"
            />
            <button className="search-btn" aria-label="Buscar">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Right Section: Icons */}
        <div className="header-right">
          <button className="icon-btn" aria-label="Carrito">
            <ShoppingCart size={24} />
          </button>
          <button className="icon-btn" aria-label="Mi Cuenta">
            <User size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
