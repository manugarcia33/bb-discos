// Importamos las dependencias
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/database");
// Cargamos las variables de entorno del archivo .env
dotenv.config();

// Creamos la aplicación Express
const app = express();

// Definimos el puerto (viene del .env o usa 5000 por defecto)
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARES =====
// CORS permite que tu frontend (React) se comunique con este backend
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Permite que el servidor entienda JSON en las peticiones
app.use(express.json());

// ===== RUTAS =====
// Importar rutas
const productsRoutes = require("./routes/products");
const categoriesRoutes = require("./routes/categories");
const uploadRoutes = require("./routes/upload");

// Ruta de prueba para verificar que el servidor funciona
app.get("/", (req, res) => {
  res.json({
    message: "🎵 BB Discos API funcionando correctamente",
    version: "1.0.0",
    endpoints: {
      products: "/api/products",
      categories: "/api/categories",
      health: "/api/health",
      upload: "/api/upload",
    },
  });
});

// Ruta de health check (para verificar que está vivo)
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Montar rutas de la API
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api", uploadRoutes);

// ===== INICIAR SERVIDOR =====
app.listen(PORT, async () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);

  // Probar conexión a la base de datos
  await db.testConnection();
  console.log("");
});
