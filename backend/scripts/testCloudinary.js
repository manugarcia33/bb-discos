// Script de prueba para verificar que Cloudinary funciona
require("dotenv").config({ path: ".env.development" });
const cloudinary = require("../src/config/cloudinary");

async function testCloudinary() {
  try {
    console.log("🧪 Probando conexión a Cloudinary...\n");

    console.log("📋 Configuración:");
    console.log(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    console.log(`   API Key: ${process.env.CLOUDINARY_API_KEY}`);
    console.log(
      `   API Secret: ${process.env.CLOUDINARY_API_SECRET ? "***configurado***" : "❌ NO CONFIGURADO"}\n`,
    );

    // Obtener información de la cuenta
    const result = await cloudinary.api.resources({
      type: "upload",
      max_results: 5,
    });

    console.log("✅ Conexión exitosa a Cloudinary!\n");
    console.log(`📊 Estadísticas:`);
    console.log(`   Total de imágenes: ${result.resources.length}`);

    if (result.resources.length > 0) {
      console.log(`\n🖼️  Últimas imágenes subidas:`);
      result.resources.forEach((img, i) => {
        console.log(`   ${i + 1}. ${img.public_id}`);
      });
    } else {
      console.log(`\n💡 Aún no hay imágenes subidas.`);
    }

    console.log("\n🎉 Todo funcionando correctamente!");
  } catch (error) {
    console.error("❌ Error al conectar con Cloudinary:");
    console.error(`   ${error.message}`);
    console.error(
      "\n💡 Verifica que las credenciales en .env.development sean correctas.",
    );
  }
}

testCloudinary();
