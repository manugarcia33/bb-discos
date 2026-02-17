// Script para actualizar la imagen de un producto
require("dotenv").config({ path: ".env.development" });
const db = require("../src/config/database");
const cloudinary = require("../src/config/cloudinary");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function updateProductImage() {
  try {
    console.log("🎵 Actualizar Imagen de Vinilo\n");

    // 1. Mostrar productos sin imagen
    const noImageProducts = await db.query(`
      SELECT id, title, artist, image_url
      FROM products
      WHERE image_url IS NULL OR image_url = ''
      ORDER BY id
      LIMIT 20
    `);

    console.log("📀 Productos SIN imagen:");
    noImageProducts.rows.forEach((p) => {
      console.log(`   [${p.id}] ${p.artist} - ${p.title}`);
    });

    // 2. También mostrar algunos con imagen
    const withImageProducts = await db.query(`
      SELECT id, title, artist
      FROM products
      WHERE image_url IS NOT NULL AND image_url != ''
      ORDER BY id
      LIMIT 10
    `);

    console.log("\n📀 Algunos productos CON imagen:");
    withImageProducts.rows.forEach((p) => {
      console.log(`   [${p.id}] ${p.artist} - ${p.title}`);
    });

    // 3. Pedir ID del producto
    const productId = await question("\n¿ID del producto a actualizar? ");

    // 4. Verificar que existe
    const product = await db.query("SELECT * FROM products WHERE id = $1", [
      productId,
    ]);

    if (product.rows.length === 0) {
      console.log("❌ Producto no encontrado");
      rl.close();
      await db.pool.end();
      return;
    }

    console.log(
      `\n✅ Producto seleccionado: ${product.rows[0].artist} - ${product.rows[0].title}`,
    );
    if (product.rows[0].image_url) {
      console.log(`   Imagen actual: ${product.rows[0].image_url}`);
    }

    // 5. Pedir URL de la imagen
    console.log("\n📋 Opciones:");
    console.log("   1. Pegar URL de una imagen ya subida a Cloudinary");
    console.log(
      "   2. Pegar ruta local de una imagen (se subirá automáticamente)",
    );

    const imageUrl = await question("\nURL o ruta de la imagen: ");

    let finalImageUrl = imageUrl;

    // Si es una ruta local, subir a Cloudinary
    if (!imageUrl.startsWith("http")) {
      console.log("\n📤 Subiendo imagen a Cloudinary...");
      try {
        const result = await cloudinary.uploader.upload(imageUrl, {
          folder: "bb-discos",
        });
        finalImageUrl = result.secure_url;
        console.log("✅ Imagen subida exitosamente!");
      } catch (err) {
        console.log("❌ Error al subir imagen:", err.message);
        rl.close();
        await db.pool.end();
        return;
      }
    }

    // 6. Actualizar en la base de datos
    console.log("\n💾 Actualizando producto...");
    await db.query(
      "UPDATE products SET image_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [finalImageUrl, productId],
    );

    console.log("✅ Producto actualizado exitosamente!");
    console.log(`   Nueva URL de imagen: ${finalImageUrl}`);

    rl.close();
    await db.pool.end();
  } catch (error) {
    console.error("❌ Error:", error.message);
    rl.close();
    await db.pool.end();
  }
}

updateProductImage();
