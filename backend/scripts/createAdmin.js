/**
 * Script para crear el primer usuario administrador
 * Uso: node scripts/createAdmin.js
 */
const bcrypt = require("bcryptjs");
const db = require("../src/config/database");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@bbdiscos.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME || "Admin";
const ADMIN_LAST_NAME = process.env.ADMIN_LAST_NAME || "BB Discos";

async function createAdmin() {
  try {
    console.log("🔧 Creando usuario administrador...");

    // Verificar si ya existe
    const existing = await db.query(
      "SELECT id, role FROM users WHERE email = $1",
      [ADMIN_EMAIL],
    );

    if (existing.rows.length > 0) {
      if (existing.rows[0].role === "admin") {
        console.log(`✅ Ya existe un admin con email: ${ADMIN_EMAIL}`);
      } else {
        // Promover a admin
        await db.query("UPDATE users SET role = 'admin' WHERE email = $1", [
          ADMIN_EMAIL,
        ]);
        console.log(`✅ Usuario ${ADMIN_EMAIL} promovido a admin`);
      }
      process.exit(0);
    }

    const password_hash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const result = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, 'admin')
       RETURNING id, email, role`,
      [ADMIN_EMAIL, password_hash, ADMIN_FIRST_NAME, ADMIN_LAST_NAME],
    );

    console.log("✅ Administrador creado exitosamente:");
    console.log(`   Email: ${result.rows[0].email}`);
    console.log(`   Contraseña: ${ADMIN_PASSWORD}`);
    console.log(`   ⚠️  Cambiá la contraseña en producción!`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

createAdmin();
