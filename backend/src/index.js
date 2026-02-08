// Importamos las dependencias
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Cargamos las variables de entorno del archivo .env
dotenv.config();

// Creamos la aplicación Express
const app = express();

// Definimos el puerto (viene del .env o usa 5000 por defecto)
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARES =====
// CORS permite que tu frontend (React) se comunique con este backend
app.use(cors());

// Permite que el servidor entienda JSON en las peticiones
app.use(express.json());

// ===== RUTAS =====
// Ruta de prueba para verificar que el servidor funciona
app.get("/", (req, res) => {
  res.json({
    message: "🎵 BB Discos API funcionando correctamente",
    version: "1.0.0",
  });
});

// Ruta de health check (para verificar que está vivo)
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// ===== INICIAR SERVIDOR =====
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}\n`);
});
