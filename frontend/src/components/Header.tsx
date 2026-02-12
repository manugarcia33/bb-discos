import { Search, User, ShoppingCart, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  return (
    <header className="header-bbdiscos">
      <div className="header-content">
        {/* Left Section: Menu + Logo */}
        <div className="header-left">
          <button className="menu-btn" aria-label="Menú">
            <Menu size={24} />
          </button>
          <Link to="/">
            <img
              src={logo}
              alt="BB DISCOS"
              className="logo-image"
              style={{ cursor: "pointer" }}
            />
          </Link>
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
