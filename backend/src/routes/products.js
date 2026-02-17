// ================================================
// RUTAS DE PRODUCTOS
// ================================================
const express = require("express");
const router = express.Router();
const db = require("../config/database");

// ===== GET /api/products - Obtener todos los productos (con filtros) =====
router.get("/", async (req, res) => {
  try {
    const { category, minPrice, maxPrice, featured, onSale } = req.query;

    let query = `
      SELECT p.*, 
             c.name as category_name, 
             c.slug as category_slug,
             COALESCE(
               (SELECT image_url FROM product_images 
                WHERE product_id = p.id AND is_main = true 
                LIMIT 1),
               p.image_url
             ) as main_image_url
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    // Filtro por categoría
    if (category) {
      query += ` AND c.slug = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    // Filtro por precio mínimo
    if (minPrice) {
      query += ` AND p.price >= $${paramCount}`;
      params.push(parseFloat(minPrice));
      paramCount++;
    }

    // Filtro por precio máximo
    if (maxPrice) {
      query += ` AND p.price <= $${paramCount}`;
      params.push(parseFloat(maxPrice));
      paramCount++;
    }

    // Filtro por destacados
    if (featured === "true") {
      query += ` AND p.is_featured = true`;
    }

    // Filtro por ofertas
    if (onSale === "true") {
      query += ` AND p.is_on_sale = true`;
    }

    query += ` ORDER BY p.created_at DESC`;

    const result = await db.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      products: result.rows,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener productos",
    });
  }
});

// ===== GET /api/products/:id - Obtener un producto específico =====
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      SELECT p.*, 
             c.name as category_name, 
             c.slug as category_slug,
             COALESCE(
               (SELECT image_url FROM product_images 
                WHERE product_id = p.id AND is_main = true 
                LIMIT 1),
               p.image_url
             ) as main_image_url
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado",
      });
    }

    // Obtener todas las imágenes del producto
    const images = await db.query(
      `SELECT * FROM product_images 
       WHERE product_id = $1 
       ORDER BY display_order ASC`,
      [id],
    );

    res.json({
      success: true,
      product: {
        ...result.rows[0],
        images: images.rows,
      },
    });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener producto",
    });
  }
});

// ===== POST /api/products - Crear nuevo producto (ADMIN) =====
router.post("/", async (req, res) => {
  try {
    const {
      title,
      artist,
      price,
      category_id,
      description,
      year,
      stock,
      image_url,
      is_featured,
      is_on_sale,
      discount_percentage,
    } = req.body;

    // Calcular precio de cuotas (3 cuotas sin interés)
    const installment_price = price / 3;

    const result = await db.query(
      `
      INSERT INTO products (
        title, artist, price, installment_price, category_id,
        description, year, stock, image_url, is_featured,
        is_on_sale, discount_percentage
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `,
      [
        title,
        artist,
        price,
        installment_price,
        category_id,
        description,
        year,
        stock,
        image_url,
        is_featured || false,
        is_on_sale || false,
        discount_percentage || 0,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({
      success: false,
      error: "Error al crear producto",
    });
  }
});

// ===== PUT /api/products/:id - Actualizar producto (ADMIN) =====
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      artist,
      price,
      category_id,
      description,
      year,
      stock,
      image_url,
      is_featured,
      is_on_sale,
      discount_percentage,
    } = req.body;

    const installment_price = price / 3;

    const result = await db.query(
      `
      UPDATE products
      SET title = $1, artist = $2, price = $3, installment_price = $4,
          category_id = $5, description = $6, year = $7, stock = $8,
          image_url = $9, is_featured = $10, is_on_sale = $11,
          discount_percentage = $12, updated_at = CURRENT_TIMESTAMP
      WHERE id = $13
      RETURNING *
    `,
      [
        title,
        artist,
        price,
        installment_price,
        category_id,
        description,
        year,
        stock,
        image_url,
        is_featured,
        is_on_sale,
        discount_percentage,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Producto actualizado exitosamente",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({
      success: false,
      error: "Error al actualizar producto",
    });
  }
});

// ===== DELETE /api/products/:id - Eliminar producto (ADMIN) =====
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Producto eliminado exitosamente",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({
      success: false,
      error: "Error al eliminar producto",
    });
  }
});

module.exports = router;
