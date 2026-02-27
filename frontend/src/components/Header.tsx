import {
  Search,
  User,
  ShoppingCart,
  Menu,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">(
    "login",
  );
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const openLogin = () => {
    setAuthModalMode("login");
    setAuthModalOpen(true);
  };

  const displayName =
    user?.first_name || user?.email?.split("@")[0] || "Mi cuenta";

  return (
    <>
      <header className="header-bbdiscos">
        <div className="header-content">
          {/* Left Section: Menu + Logo */}
          <div className="header-left">
            <button
              className="menu-btn"
              aria-label="Menú"
              onClick={onMenuClick}
            >
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

            {/* Menú de usuario */}
            {isAuthenticated ? (
              <div className="user-menu-wrapper" ref={userMenuRef}>
                <button
                  className="user-menu-trigger"
                  onClick={() => setUserMenuOpen((o) => !o)}
                  aria-label="Mi cuenta"
                >
                  <User size={20} />
                  <span className="user-menu-name">{displayName}</span>
                  <ChevronDown size={14} />
                </button>

                {userMenuOpen && (
                  <div className="user-menu-dropdown">
                    <div className="user-menu-info">
                      <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>
                        {displayName}
                      </div>
                      <div className="user-menu-info-email">{user?.email}</div>
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="user-menu-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard size={15} />
                        Panel de Admin
                      </Link>
                    )}
                    <button
                      className="user-menu-item danger"
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                    >
                      <LogOut size={15} />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="icon-btn"
                aria-label="Iniciar sesión"
                onClick={openLogin}
              >
                <User size={24} />
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
}
