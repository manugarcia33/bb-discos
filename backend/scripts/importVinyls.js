const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

// Configurar conexión a Supabase
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Función simple para parsear CSV manualmente
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim());
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ? values[index].trim() : null;
    });
    rows.push(row);
  }

  return rows;
}

// Función para importar vinilos desde CSV
async function importVinyls() {
  const csvFilePath = path.join(__dirname, "../data/vinyls.csv");

  console.log("📀 Iniciando importación de vinilos...\n");

  try {
    const vinyls = parseCSV(csvFilePath);
    console.log(`✅ CSV leído: ${vinyls.length} vinilos encontrados\n`);

    let imported = 0;
    let errors = 0;

    for (const vinyl of vinyls) {
      try {
        const query = `
          INSERT INTO products (
            title, artist, price, installments, installment_price,
            category_id, label, country,
            condition_cover, condition_media, stock, image_url,
            is_featured, is_on_sale, discount_percentage, description
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          RETURNING id;
        `;

        const values = [
          vinyl.title,
          vinyl.artist,
          parseFloat(vinyl.price),
          parseInt(vinyl.installments) || 3,
          parseFloat(vinyl.installment_price) || null,
          parseInt(vinyl.category_id),
          vinyl.label || null,
          vinyl.country || null,
          vinyl.condition_cover || null,
          vinyl.condition_media || null,
          parseInt(vinyl.stock) || 0,
          vinyl.image_url || null,
          vinyl.is_featured === "true" || vinyl.is_featured === "1",
          vinyl.is_on_sale === "true" || vinyl.is_on_sale === "1",
          parseInt(vinyl.discount_percentage) || 0,
          vinyl.description || null,
        ];

        await pool.query(query, values);
        imported++;
        console.log(`✅ ${imported}. ${vinyl.title} - ${vinyl.artist}`);
      } catch (error) {
        errors++;
        console.error(`❌ Error en "${vinyl.title}":`, error.message);
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`✅ Importación completada!`);
    console.log(`📊 Total importados: ${imported}`);
    console.log(`❌ Errores: ${errors}`);
    console.log("=".repeat(50) + "\n");
  } catch (error) {
    console.error("❌ Error al leer el CSV:", error.message);
  } finally {
    await pool.end();
  }
}

// Ejecutar la importación
importVinyls()
  .then(() => {
    console.log("🎉 Proceso finalizado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Error fatal:", error);
    process.exit(1);
  });
