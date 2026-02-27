const jwt = require("jsonwebtoken");
const db = require("../config/database");

const JWT_SECRET = process.env.JWT_SECRET || "bb_discos_secret_dev";

/**
 * Middleware: verifica el token JWT y adjunta req.user
 * Usa: en rutas que requieren estar logueado
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Token de autenticación requerido" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verificar que el usuario todavía existe y está activo
    const result = await db.query(
      "SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = $1",
      [decoded.userId],
    );

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return res
        .status(401)
        .json({ error: "Usuario no encontrado o inactivo" });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }
    next(err);
  }
};

/**
 * Middleware: requiere rol admin
 * Usar DESPUÉS de authenticate
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Acceso denegado: se requiere rol administrador" });
  }
  next();
};

/**
 * Middleware: adjunta req.user si hay token pero NO falla si no hay token
 * Útil para rutas que pueden usarse con o sin login
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const result = await db.query(
      "SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = $1",
      [decoded.userId],
    );

    req.user =
      result.rows.length > 0 && result.rows[0].is_active
        ? result.rows[0]
        : null;
    next();
  } catch {
    req.user = null;
    next();
  }
};

module.exports = { authenticate, requireAdmin, optionalAuth, JWT_SECRET };
