// Script para agregar múltiples imágenes a un producto
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

async function addProductImages() {
  try {
    console.log("🖼️  Agregar Múltiples Imágenes a un Producto\n");

    // 1. Mostrar productos
    const products = await db.query(`
      SELECT p.id, p.title, p.artist, 
             (SELECT COUNT(*) FROM product_images WHERE product_id = p.id) as image_count
      FROM products p
      ORDER BY p.id
      LIMIT 30
    `);

    console.log("📀 Productos disponibles:");
    products.rows.forEach((p) => {
      const imgInfo =
        p.image_count > 0 ? `(${p.image_count} imágenes)` : "(sin imágenes)";
      console.log(`   [${p.id}] ${p.artist} - ${p.title} ${imgInfo}`);
    });

    // 2. Seleccionar producto
    const productId = await question("\n¿ID del producto? ");

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
      `\n✅ Producto: ${product.rows[0].artist} - ${product.rows[0].title}`,
    );

    // 3. Mostrar imágenes actuales
    const currentImages = await db.query(
      "SELECT * FROM product_images WHERE product_id = $1 ORDER BY display_order",
      [productId],
    );

    if (currentImages.rows.length > 0) {
      console.log("\n📸 Imágenes actuales:");
      currentImages.rows.forEach((img, i) => {
        const main = img.is_main ? "⭐ PRINCIPAL" : "";
        console.log(`   ${i + 1}. ${img.image_url} ${main}`);
      });
    } else {
      console.log("\n💡 Este producto aún no tiene imágenes.");
    }

    // 4. Agregar imágenes
    console.log("\n📤 Agregar imágenes:");
    console.log("   Ingresa la URL o ruta local de cada imagen");
    console.log("   Presiona ENTER sin escribir nada para terminar\n");

    const images = [];
    let imageNum = 1;

    while (true) {
      const imagePath = await question(
        `Imagen ${imageNum} (o ENTER para terminar): `,
      );

      if (!imagePath.trim()) {
        break;
      }

      let imageUrl = imagePath.trim();

      // Si es ruta local, subir a Cloudinary
      if (!imageUrl.startsWith("http")) {
        console.log("   📤 Subiendo a Cloudinary...");
        try {
          const result = await cloudinary.uploader.upload(imageUrl, {
            folder: "bb-discos",
          });
          imageUrl = result.secure_url;
          console.log("   ✅ Subida exitosa!");
        } catch (err) {
          console.log(`   ❌ Error: ${err.message}`);
          continue;
        }
      }

      // ¿Es la imagen principal?
      let isMain = false;
      if (currentImages.rows.length === 0 && images.length === 0) {
        isMain = true;
        console.log("   ⭐ Esta será la imagen principal (primera imagen)");
      } else {
        const mainAnswer = await question("   ¿Marcar como principal? (s/n): ");
        isMain = mainAnswer.toLowerCase() === "s";
      }

      images.push({ url: imageUrl, isMain });
      imageNum++;
    }

    if (images.length === 0) {
      console.log("\n⚠️  No se agregaron imágenes.");
      rl.close();
      await db.pool.end();
      return;
    }

    // 5. Guardar en la base de datos
    console.log(`\n💾 Guardando ${images.length} imagen(es)...`);

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const nextOrder = currentImages.rows.length + i;

      await db.query(
        `INSERT INTO product_images (product_id, image_url, is_main, display_order)
         VALUES ($1, $2, $3, $4)`,
        [productId, img.url, img.isMain, nextOrder],
      );

      console.log(`   ${i + 1}. ${img.isMain ? "⭐" : "📷"} Guardada`);
    }

    // 6. Mostrar resultado final
    const finalImages = await db.query(
      "SELECT * FROM product_images WHERE product_id = $1 ORDER BY display_order",
      [productId],
    );

    console.log("\n✨ ¡Listo! Imágenes del producto:");
    finalImages.rows.forEach((img, i) => {
      const main = img.is_main ? "⭐ PRINCIPAL" : "";
      console.log(`   ${i + 1}. ${img.image_url} ${main}`);
    });

    console.log(`\n🎉 Total: ${finalImages.rows.length} imágenes`);

    rl.close();
    await db.pool.end();
  } catch (error) {
    console.error("❌ Error:", error.message);
    rl.close();
    await db.pool.end();
  }
}

addProductImages();
