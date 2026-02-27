import { useState, type FormEvent } from "react";
import { X, Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Campos del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setPhone("");
    setError(null);
    setShowPassword(false);
  };

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    resetForm();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          phone,
        });
      }
      onClose();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="auth-modal-backdrop" onClick={handleBackdropClick}>
      <div className="auth-modal">
        {/* Header */}
        <div className="auth-modal-header">
          <h2 className="auth-modal-title">
            {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </h2>
          <button
            className="auth-modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => switchMode("login")}
            type="button"
          >
            Iniciar Sesión
          </button>
          <button
            className={`auth-tab ${mode === "register" ? "active" : ""}`}
            onClick={() => switchMode("register")}
            type="button"
          >
            Registrarse
          </button>
        </div>

        {/* Formulario */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Nombre y apellido (solo en registro) */}
          {mode === "register" && (
            <div className="auth-row">
              <div className="auth-field">
                <label className="auth-label">Nombre</label>
                <div className="auth-input-wrapper">
                  <User size={16} className="auth-input-icon" />
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Juan"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>
              <div className="auth-field">
                <label className="auth-label">Apellido</label>
                <div className="auth-input-wrapper">
                  <User size={16} className="auth-input-icon" />
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="García"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label">Email *</label>
            <div className="auth-input-wrapper">
              <Mail size={16} className="auth-input-icon" />
              <input
                type="email"
                className="auth-input"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Teléfono (solo en registro) */}
          {mode === "register" && (
            <div className="auth-field">
              <label className="auth-label">Teléfono (opcional)</label>
              <div className="auth-input-wrapper">
                <Phone size={16} className="auth-input-icon" />
                <input
                  type="tel"
                  className="auth-input"
                  placeholder="+54 11 1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Contraseña */}
          <div className="auth-field">
            <label className="auth-label">Contraseña *</label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input auth-input-password"
                placeholder={
                  mode === "register" ? "Mínimo 6 caracteres" : "Tu contraseña"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Ver contraseña"
                }
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && <div className="auth-error">{error}</div>}

          {/* Submit */}
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading
              ? "Cargando..."
              : mode === "login"
                ? "Iniciar Sesión"
                : "Crear mi cuenta"}
          </button>

          {/* Nota de compra sin cuenta (solo en registro) */}
          {mode === "register" && (
            <p className="auth-note">
              También podés comprar sin registrarte. Crear una cuenta te permite
              guardar tus datos para compras más rápidas en el futuro.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
