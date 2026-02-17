// Rutas para gestionar múltiples imágenes de productos
const express = require("express");
const router = express.Router();
const db = require("../config/database");

// ===== GET /api/products/:id/images - Obtener todas las imágenes de un producto =====
router.get("/:productId/images", async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await db.query(
      `SELECT * FROM product_images 
       WHERE product_id = $1 
       ORDER BY display_order ASC`,
      [productId],
    );

    res.json({
      success: true,
      count: result.rows.length,
      images: result.rows,
    });
  } catch (error) {
    console.error("Error al obtener imágenes:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener imágenes",
    });
  }
});

// ===== POST /api/products/:id/images - Agregar imagen a un producto =====
router.post("/:productId/images", async (req, res) => {
  try {
    const { productId } = req.params;
    const { image_url, is_main, alt_text } = req.body;

    if (!image_url) {
      return res.status(400).json({
        success: false,
        error: "image_url es requerido",
      });
    }

    // Verificar que el producto existe
    const productExists = await db.query(
      "SELECT id FROM products WHERE id = $1",
      [productId],
    );

    if (productExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado",
      });
    }

    // Obtener el siguiente orden
    const orderResult = await db.query(
      "SELECT COALESCE(MAX(display_order), -1) + 1 as next_order FROM product_images WHERE product_id = $1",
      [productId],
    );
    const nextOrder = orderResult.rows[0].next_order;

    // Insertar la imagen
    const result = await db.query(
      `INSERT INTO product_images (product_id, image_url, is_main, display_order, alt_text)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [productId, image_url, is_main || false, nextOrder, alt_text],
    );

    res.status(201).json({
      success: true,
      message: "Imagen agregada exitosamente",
      image: result.rows[0],
    });
  } catch (error) {
    console.error("Error al agregar imagen:", error);
    res.status(500).json({
      success: false,
      error: "Error al agregar imagen",
    });
  }
});

// ===== PUT /api/products/:id/images/:imageId - Actualizar imagen =====
router.put("/:productId/images/:imageId", async (req, res) => {
  try {
    const { productId, imageId } = req.params;
    const { image_url, is_main, display_order, alt_text } = req.body;

    const result = await db.query(
      `UPDATE product_images
       SET image_url = COALESCE($1, image_url),
           is_main = COALESCE($2, is_main),
           display_order = COALESCE($3, display_order),
           alt_text = COALESCE($4, alt_text)
       WHERE id = $5 AND product_id = $6
       RETURNING *`,
      [image_url, is_main, display_order, alt_text, imageId, productId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Imagen no encontrada",
      });
    }

    res.json({
      success: true,
      message: "Imagen actualizada exitosamente",
      image: result.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar imagen:", error);
    res.status(500).json({
      success: false,
      error: "Error al actualizar imagen",
    });
  }
});

// ===== DELETE /api/products/:id/images/:imageId - Eliminar imagen =====
router.delete("/:productId/images/:imageId", async (req, res) => {
  try {
    const { productId, imageId } = req.params;

    const result = await db.query(
      "DELETE FROM product_images WHERE id = $1 AND product_id = $2 RETURNING *",
      [imageId, productId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Imagen no encontrada",
      });
    }

    res.json({
      success: true,
      message: "Imagen eliminada exitosamente",
      image: result.rows[0],
    });
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    res.status(500).json({
      success: false,
      error: "Error al eliminar imagen",
    });
  }
});

// ===== PUT /api/products/:id/images/:imageId/set-main - Marcar como imagen principal =====
router.put("/:productId/images/:imageId/set-main", async (req, res) => {
  try {
    const { productId, imageId } = req.params;

    const result = await db.query(
      "UPDATE product_images SET is_main = true WHERE id = $1 AND product_id = $2 RETURNING *",
      [imageId, productId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Imagen no encontrada",
      });
    }

    res.json({
      success: true,
      message: "Imagen marcada como principal",
      image: result.rows[0],
    });
  } catch (error) {
    console.error("Error al marcar imagen principal:", error);
    res.status(500).json({
      success: false,
      error: "Error al marcar imagen principal",
    });
  }
});

module.exports = router;
