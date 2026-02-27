// ================================================
// RUTAS DE AUTENTICACION
// POST /api/auth/register  - Crear cuenta
// POST /api/auth/login     - Iniciar sesion
// GET  /api/auth/me        - Perfil del usuario logueado
// PUT  /api/auth/me        - Actualizar perfil
// ================================================
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
const { authenticate, JWT_SECRET } = require("../middleware/auth");

const generateToken = (userId) =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });

router.post("/register", async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body;
    if (password.length < 6)
      return res
        .status(400)
        .json({ error: "La contrasena debe tener al menos 6 caracteres" });
    const existing = await db.query("SELECT id FROM users WHERE email = $1", [
      email.toLowerCase(),
    ]);
    if (existing.rows.length > 0)
      return res
        .status(409)
        .json({ error: "Ya existe una cuenta con este email" });
    const password_hash = await bcrypt.hash(password, 12);
    const result = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES ($1, $2, $3, $4, $5, 'customer') RETURNING id, email, first_name, last_name, phone, role, created_at`,
      [
        email.toLowerCase(),
        password_hash,
        first_name || null,
        last_name || null,
        phone || null,
      ],
    );
    const user = result.rows[0];
    res
      .status(201)
      .json({
        message: "Cuenta creada",
        token: generateToken(user.id),
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          role: user.role,
        },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear la cuenta" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1 AND is_active = TRUE",
      [email.toLowerCase()],
    );
    if (result.rows.length === 0)
      return res.status(401).json({ error: "Email o contrasena incorrectos" });
    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid)
      return res.status(401).json({ error: "Email o contrasena incorrectos" });
    res.json({
      message: "Sesion iniciada",
      token: generateToken(user.id),
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al iniciar sesion" });
  }
});

router.get("/me", authenticate, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.role, u.created_at, (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as total_orders FROM users u WHERE u.id = $1`,
      [req.user.id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Usuario no encontrado" });
    const user = result.rows[0];
    const addresses = await db.query(
      "SELECT * FROM user_addresses WHERE user_id = $1 ORDER BY is_default DESC",
      [req.user.id],
    );
    res.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
        created_at: user.created_at,
        total_orders: parseInt(user.total_orders),
      },
      addresses: addresses.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
});

router.put("/me", authenticate, async (req, res) => {
  try {
    const { first_name, last_name, phone } = req.body;
    const result = await db.query(
      `UPDATE users SET first_name=$1, last_name=$2, phone=$3, updated_at=NOW() WHERE id=$4 RETURNING id, email, first_name, last_name, phone, role`,
      [first_name || null, last_name || null, phone || null, req.user.id],
    );
    res.json({ message: "Perfil actualizado", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar perfil" });
  }
});

router.put("/change-password", authenticate, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (new_password.length < 6)
      return res
        .status(400)
        .json({ error: "La contrasena debe tener al menos 6 caracteres" });
    const r = await db.query("SELECT password_hash FROM users WHERE id=$1", [
      req.user.id,
    ]);
    await db.query(
      "UPDATE users SET password_hash=$1, updated_at=NOW() WHERE id=$2",
      [await bcrypt.hash(new_password, 12), req.user.id],
    );
    res.json({ message: "Contrasena actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al cambiar contrasena" });
  }
});

router.post("/addresses", authenticate, async (req, res) => {
  try {
    const { label, street, city, province, postal_code, is_default } = req.body;
    if (is_default)
      await db.query(
        "UPDATE user_addresses SET is_default=FALSE WHERE user_id=$1",
        [req.user.id],
      );
    const result = await db.query(
      `INSERT INTO user_addresses (user_id, label, street, city, province, postal_code, is_default) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [
        req.user.id,
        label || "Casa",
        street,
        city,
        province || null,
        postal_code || null,
        is_default || false,
      ],
    );
    res.status(201).json({ address: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar direccion" });
  }
});

module.exports = router;
