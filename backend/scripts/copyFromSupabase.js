// Script para copiar datos desde Supabase a PostgreSQL local
require('dotenv').config({ path: '.env.production' });
const { Pool } = require('pg');

// Conexión a Supabase (producción)
const supabase = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

// Conexión a PostgreSQL local (desarrollo)
const local = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'bb_discos',
  user: 'postgres',
  password: 'Tobi.2003',
});

async function copyData() {
  try {
    console.log('🔄 Conectando a Supabase...');
    await supabase.connect();
    console.log('✅ Conectado a Supabase');

    console.log('🔄 Conectando a PostgreSQL local...');
    await local.connect();
    console.log('✅ Conectado a PostgreSQL local');

    // 1. Copiar estructura (schema)
    console.log('\n📋 Copiando estructura de tablas...');
    
    // Obtener el schema de categorías
    const categories = await supabase.query('SELECT * FROM categories ORDER BY id');
    console.log(`   Categorías encontradas: ${categories.rows.length}`);

    // Obtener el schema de productos
    const products = await supabase.query('SELECT * FROM products ORDER BY id');
    console.log(`   Productos encontrados: ${products.rows.length}`);

    // 2. Insertar en base local
    console.log('\n💾 Insertando categorías...');
    for (const cat of categories.rows) {
      await local.query(
        `INSERT INTO categories (id, name, slug, description, image_url, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           name = $2,
           slug = $3,
           description = $4,
           image_url = $5,
           updated_at = $7`,
        [cat.id, cat.name, cat.slug, cat.description, cat.image_url, cat.created_at, cat.updated_at]
      );
    }
    console.log('✅ Categorías copiadas');

    console.log('\n💾 Insertando productos...');
    for (const prod of products.rows) {
      await local.query(
        `INSERT INTO products (
          id, title, artist, price, installments, installment_price,
          category_id, description, year, stock, image_url,
          is_featured, is_on_sale, discount_percentage, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (id) DO UPDATE SET
          title = $2,
          artist = $3,
          price = $4,
          installments = $5,
          installment_price = $6,
          category_id = $7,
          description = $8,
          year = $9,
          stock = $10,
          image_url = $11,
          is_featured = $12,
          is_on_sale = $13,
          discount_percentage = $14,
          updated_at = $16`,
        [
          prod.id, prod.title, prod.artist, prod.price, prod.installments,
          prod.installment_price, prod.category_id, prod.description, prod.year,
          prod.stock, prod.image_url, prod.is_featured, prod.is_on_sale,
          prod.discount_percentage, prod.created_at, prod.updated_at
        ]
      );
    }
    console.log('✅ Productos copiados');

    // Actualizar secuencias
    console.log('\n🔢 Actualizando secuencias...');
    await local.query(`SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories))`);
    await local.query(`SELECT setval('products_id_seq', (SELECT MAX(id) FROM products))`);
    console.log('✅ Secuencias actualizadas');

    console.log('\n✨ ¡Datos copiados exitosamente de Supabase a PostgreSQL local!');
    console.log(`   📊 Total: ${categories.rows.length} categorías, ${products.rows.length} productos`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await supabase.end();
    await local.end();
  }
}

copyData();
