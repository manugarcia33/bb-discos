// Configuración de la conexión a PostgreSQL
const { Pool } = require("pg");
require("dotenv").config();

// Creamos un pool de conexiones (más eficiente que crear/cerrar conexiones individuales)
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // Configuración adicional
  max: 20, // Máximo de conexiones en el pool
  idleTimeoutMillis: 30000, // Cerrar conexiones inactivas después de 30 segundos
  connectionTimeoutMillis: 2000, // Timeout para establecer conexión
});

// Evento cuando hay error en el pool
pool.on("error", (err) => {
  console.error("❌ Error inesperado en el cliente de PostgreSQL", err);
  process.exit(-1);
});

// Función para verificar la conexión a la base de datos
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log("✅ Conexión a PostgreSQL exitosa");
    console.log(`📅 Timestamp del servidor: ${result.rows[0].now}`);
    client.release();
    return true;
  } catch (error) {
    console.error("❌ Error al conectar a PostgreSQL:", error.message);
    return false;
  }
};

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  testConnection,
};
