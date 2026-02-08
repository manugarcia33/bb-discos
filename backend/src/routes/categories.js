// ================================================
// RUTAS DE CATEGORÍAS
// ================================================
const express = require("express");
const router = express.Router();
const db = require("../config/database");

// ===== GET /api/categories - Obtener todas las categorías =====
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.name
    `);

    res.json({
      success: true,
      count: result.rows.length,
      categories: result.rows,
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener categorías",
    });
  }
});

// ===== GET /api/categories/:slug - Obtener una categoría por slug =====
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await db.query("SELECT * FROM categories WHERE slug = $1", [
      slug,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Categoría no encontrada",
      });
    }

    res.json({
      success: true,
      category: result.rows[0],
    });
  } catch (error) {
    console.error("Error al obtener categoría:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener categoría",
    });
  }
});

module.exports = router;
