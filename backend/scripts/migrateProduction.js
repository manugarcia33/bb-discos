// Script para ejecutar migraciones en Supabase (producción)
require('dotenv').config({ path: '.env.production' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🚀 Conectando a Supabase (producción)...\n');

    // Leer el archivo de migración
    const migrationPath = path.join(__dirname, '../database/migration_multiple_images_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📋 Ejecutando migración...\n');

    // Ejecutar el SQL
    await pool.query(migrationSQL);

    console.log('✅ Migración ejecutada exitosamente!\n');

    // Verificar que se creó la tabla
    const result = await pool.query(`
      SELECT COUNT(*) as count 
      FROM product_images
    `);

    console.log(`📊 Tabla 'product_images' creada correctamente`);
    console.log(`   Registros actuales: ${result.rows[0].count}\n`);

    // Verificar productos con imágenes migradas
    const migrated = await pool.query(`
      SELECT COUNT(*) as count 
      FROM product_images 
      WHERE is_main = true
    `);

    console.log(`✨ Imágenes principales migradas: ${migrated.rows[0].count}`);
    console.log(`\n🎉 ¡Base de datos de producción actualizada correctamente!`);

  } catch (error) {
    console.error('❌ Error al ejecutar migración:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

runMigration();
