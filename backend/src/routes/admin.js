// ================================================
// RUTAS DE ADMINISTRACIÓN (requieren rol admin)
// GET  /api/admin/stats           - Estadísticas generales
// GET  /api/admin/orders          - Listado de órdenes
// GET  /api/admin/users           - Listado de usuarios
// POST /api/admin/products        - Crear producto
// PUT  /api/admin/products/:id    - Editar producto
// DELETE /api/admin/products/:id  - Eliminar producto
// POST /api/admin/products/csv    - Importar CSV
// ================================================
const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../config/database");
const { authenticate, requireAdmin } = require("../middleware/auth");
const cloudinary = require("../config/cloudinary");

// Todos los endpoints requieren estar logueado y ser admin
router.use(authenticate, requireAdmin);

// Multer en memoria para CSV y para imágenes
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ===== GET /api/admin/stats =====
router.get("/stats", async (req, res) => {
  try {
    const [productsCount, categoriesCount, usersCount, ordersStats, topProducts, recentOrders] =
      await Promise.all([
        db.query("SELECT COUNT(*) as total, SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) as sin_stock FROM products"),
        db.query("SELECT COUNT(*) as total FROM categories"),
        db.query("SELECT COUNT(*) as total, COUNT(CASE WHEN role='admin' THEN 1 END) as admins FROM users"),
        db.query(`
          SELECT 
            COUNT(*) as total_orders,
            COALESCE(SUM(total), 0) as ingresos_totales,
            COALESCE(SUM(CASE WHEN DATE(created_at) = CURRENT_DATE THEN total ELSE 0 END), 0) as ingresos_hoy,
            COALESCE(SUM(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN total ELSE 0 END), 0) as ingresos_mes
          FROM orders WHERE status != 'cancelled'
        `),
        db.query(`
          SELECT p.id, p.title, p.artist, p.price, p.stock,
                 COUNT(oi.id) as veces_vendido,
                 COALESCE(SUM(oi.quantity), 0) as unidades_vendidas
          FROM products p
          LEFT JOIN order_items oi ON oi.product_id = p.id
          GROUP BY p.id
          ORDER BY unidades_vendidas DESC
          LIMIT 5
        `),
        db.query(`
          SELECT o.id, o.status, o.total, o.created_at,
                 u.email, u.first_name, u.last_name,
                 o.guest_email
          FROM orders o
          LEFT JOIN users u ON o.user_id = u.id
          ORDER BY o.created_at DESC
          LIMIT 10
        `),
      ]);

    res.json({
      products: {
        total: parseInt(productsCount.rows[0].total),
        sin_stock: parseInt(productsCount.rows[0].sin_stock),
      },
      categories: parseInt(categoriesCount.rows[0].total),
      users: {
        total: parseInt(usersCount.rows[0].total),
        admins: parseInt(usersCount.rows[0].admins),
      },
      orders: {
        total: parseInt(ordersStats.rows[0].total_orders),
        ingresos_totales: parseFloat(ordersStats.rows[0].ingresos_totales),
        ingresos_hoy: parseFloat(ordersStats.rows[0].ingresos_hoy),
        ingresos_mes: parseFloat(ordersStats.rows[0].ingresos_mes),
      },
      top_products: topProducts.rows,
      recent_orders: recentOrders.rows,
    });
  } catch (err) {
    console.error("Error en stats:", err);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

// ===== GET /api/admin/orders =====
router.get("/orders", async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT o.*, u.email, u.first_name, u.last_name,
             json_agg(json_build_object(
               'id', oi.id,
               'product_title', oi.product_title,
               'product_artist', oi.product_artist,
               'quantity', oi.quantity,
               'unit_price', oi.unit_price
             )) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON oi.order_id = o.id
    `;
    const params = [];

    if (status) {
      query += " WHERE o.status = $1";
      params.push(status);
    }

    query += ` GROUP BY o.id, u.email, u.first_name, u.last_name
               ORDER BY o.created_at DESC
               LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    const countResult = await db.query(
      "SELECT COUNT(*) as total FROM orders" + (status ? " WHERE status=$1" : ""),
      status ? [status] : []
    );

    res.json({
      orders: result.rows,
      total: parseInt(countResult.rows[0].total),
      page: parseInt(page),
      pages: Math.ceil(countResult.rows[0].total / limit),
    });
  } catch (err) {
    console.error("Error al obtener órdenes:", err);
    res.status(500).json({ error: "Error al obtener órdenes" });
  }
});

// ===== GET /api/admin/users =====
router.get("/users", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.is_active, u.created_at,
             COUNT(o.id) as total_orders,
             COALESCE(SUM(o.total), 0) as total_gastado
      FROM users u
      LEFT JOIN orders o ON o.user_id = u.id AND o.status != 'cancelled'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    res.json({ users: result.rows });
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// ===== POST /api/admin/products  (crear vinilo individual) =====
router.post("/products", upload.array("images", 10), async (req, res) => {
  try {
    const {
      title, artist, price, installments, installment_price,
      label, country, condition_cover, condition_media,
      category_id, stock, is_featured, is_on_sale, discount_percentage, description,
    } = req.body;

    if (!title || !artist || !price) {
      return res.status(400).json({ error: "Título, artista y precio son requeridos" });
    }

    // Insertar producto
    const result = await db.query(
      `INSERT INTO products
         (title, artist, price, installments, installment_price, label, country,
          condition_cover, condition_media, category_id, stock,
          is_featured, is_on_sale, discount_percentage, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING *`,
      [
        title, artist, parseFloat(price),
        installments ? parseInt(installments) : 3,
        installment_price ? parseFloat(installment_price) : null,
        label || null, country || null,
        condition_cover || null, condition_media || null,
        category_id ? parseInt(category_id) : null,
        stock ? parseInt(stock) : 0,
        is_featured === "true" || is_featured === true,
        is_on_sale === "true" || is_on_sale === true,
        discount_percentage ? parseInt(discount_percentage) : 0,
        description || null,
      ]
    );

    const product = result.rows[0];

    // Subir imágenes a Cloudinary si vienen
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "bb-discos/products", public_id: `product_${product.id}_${Date.now()}_${i}` },
              (error, result) => (error ? reject(error) : resolve(result))
            )
            .end(file.buffer);
        });

        await db.query(
          `INSERT INTO product_images (product_id, image_url, public_id, is_main, display_order)
           VALUES ($1, $2, $3, $4, $5)`,
          [product.id, uploadResult.secure_url, uploadResult.public_id, i === 0, i]
        );

        // Actualizar image_url principal en products
        if (i === 0) {
          await db.query("UPDATE products SET image_url=$1 WHERE id=$2", [uploadResult.secure_url, product.id]);
        }
      }
    }

    res.status(201).json({ message: "Vinilo creado", product });
  } catch (err) {
    console.error("Error al crear producto:", err);
    res.status(500).json({ error: "Error al crear el vinilo" });
  }
});

// ===== PUT /api/admin/products/:id =====
router.put("/products/:id", upload.array("images", 10), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, artist, price, installments, installment_price,
      label, country, condition_cover, condition_media,
      category_id, stock, is_featured, is_on_sale, discount_percentage, description,
    } = req.body;

    const result = await db.query(
      `UPDATE products SET
         title=$1, artist=$2, price=$3, installments=$4, installment_price=$5,
         label=$6, country=$7, condition_cover=$8, condition_media=$9,
         category_id=$10, stock=$11, is_featured=$12, is_on_sale=$13,
         discount_percentage=$14, description=$15, updated_at=NOW()
       WHERE id=$16 RETURNING *`,
      [
        title, artist, parseFloat(price),
        installments ? parseInt(installments) : 3,
        installment_price ? parseFloat(installment_price) : null,
        label || null, country || null,
        condition_cover || null, condition_media || null,
        category_id ? parseInt(category_id) : null,
        stock ? parseInt(stock) : 0,
        is_featured === "true" || is_featured === true,
        is_on_sale === "true" || is_on_sale === true,
        discount_percentage ? parseInt(discount_percentage) : 0,
        description || null, id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vinilo no encontrado" });
    }

    // Agregar nuevas imágenes si vienen
    if (req.files && req.files.length > 0) {
      const existingCount = await db.query(
        "SELECT COUNT(*) as cnt FROM product_images WHERE product_id=$1",
        [id]
      );
      const startOrder = parseInt(existingCount.rows[0].cnt);

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "bb-discos/products", public_id: `product_${id}_${Date.now()}_${i}` },
              (error, result) => (error ? reject(error) : resolve(result))
            )
            .end(file.buffer);
        });

        await db.query(
          `INSERT INTO product_images (product_id, image_url, public_id, is_main, display_order)
           VALUES ($1, $2, $3, $4, $5)`,
          [id, uploadResult.secure_url, uploadResult.public_id, startOrder === 0 && i === 0, startOrder + i]
        );

        if (startOrder === 0 && i === 0) {
          await db.query("UPDATE products SET image_url=$1 WHERE id=$2", [uploadResult.secure_url, id]);
        }
      }
    }

    res.json({ message: "Vinilo actualizado", product: result.rows[0] });
  } catch (err) {
    console.error("Error al actualizar producto:", err);
    res.status(500).json({ error: "Error al actualizar el vinilo" });
  }
});

// ===== DELETE /api/admin/products/:id =====
router.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Eliminar imágenes de Cloudinary
    const images = await db.query("SELECT public_id FROM product_images WHERE product_id=$1 AND public_id IS NOT NULL", [id]);
    for (const img of images.rows) {
      try { await cloudinary.uploader.destroy(img.public_id); } catch {}
    }

    await db.query("DELETE FROM products WHERE id=$1", [id]);
    res.json({ message: "Vinilo eliminado" });
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    res.status(500).json({ error: "Error al eliminar el vinilo" });
  }
});

// ===== POST /api/admin/products/csv  (importar desde CSV) =====
router.post("/products/csv", upload.single("csv"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Archivo CSV requerido" });
    }

    const csvContent = req.file.buffer.toString("utf-8");
    const lines = csvContent.split("\n").filter((l) => l.trim());

    if (lines.length < 2) {
      return res.status(400).json({ error: "El CSV debe tener al menos una fila de datos" });
    }

    // Parsear cabecera (normalizar nombres)
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/[^a-z_]/g, ""));

    const results = { created: 0, errors: [] };

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Parsear CSV respetando comillas
      const values = [];
      let current = "";
      let inQuotes = false;
      for (const char of line) {
        if (char === '"') { inQuotes = !inQuotes; }
        else if (char === "," && !inQuotes) { values.push(current.trim()); current = ""; }
        else { current += char; }
      }
      values.push(current.trim());

      const row = {};
      headers.forEach((h, idx) => { row[h] = values[idx] || ""; });

      const title = row.title || row.titulo;
      const artist = row.artist || row.artista;
      const price = parseFloat(row.price || row.precio || "0");

      if (!title || !artist || !price) {
        results.errors.push(`Fila ${i + 1}: falta título, artista o precio`);
        continue;
      }

      try {
        // Resolver categoría si viene como nombre
        let category_id = null;
        if (row.category || row.categoria || row.category_id) {
          const catValue = row.category || row.categoria || row.category_id;
          const catNum = parseInt(catValue);
          if (!isNaN(catNum)) {
            category_id = catNum;
          } else {
            const cat = await db.query(
              "SELECT id FROM categories WHERE LOWER(name)=LOWER($1) OR LOWER(slug)=LOWER($1)",
              [catValue]
            );
            if (cat.rows.length > 0) category_id = cat.rows[0].id;
          }
        }

        await db.query(
          `INSERT INTO products
             (title, artist, price, label, country, condition_cover, condition_media,
              category_id, stock, is_featured, is_on_sale, discount_percentage, description)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
           ON CONFLICT DO NOTHING`,
          [
            title, artist, price,
            row.label || null,
            row.country || row.pais || null,
            row.condition_cover || row.condicion_tapa || null,
            row.condition_media || row.condicion_disco || null,
            category_id,
            parseInt(row.stock || "1"),
            (row.is_featured || row.destacado || "").toLowerCase() === "true",
            (row.is_on_sale || row.oferta || "").toLowerCase() === "true",
            parseInt(row.discount_percentage || row.descuento || "0"),
            row.description || row.descripcion || null,
          ]
        );
        results.created++;
      } catch (rowErr) {
        results.errors.push(`Fila ${i + 1}: ${rowErr.message}`);
      }
    }

    res.json({
      message: `Importación completada: ${results.created} vinilos creados`,
      created: results.created,
      errors: results.errors,
    });
  } catch (err) {
    console.error("Error en importación CSV:", err);
    res.status(500).json({ error: "Error al importar CSV" });
  }
});

// ===== PATCH /api/admin/orders/:id/status =====
router.patch("/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    const result = await db.query(
      "UPDATE orders SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    res.json({ message: "Estado actualizado", order: result.rows[0] });
  } catch (err) {
    console.error("Error al actualizar estado:", err);
    res.status(500).json({ error: "Error al actualizar estado" });
  }
});

module.exports = router;
