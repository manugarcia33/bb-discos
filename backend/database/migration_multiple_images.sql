-- Script para modificar la base de datos y soportar múltiples imágenes
-- OPCIÓN 1: Usar JSONB para array de imágenes

-- 1. Agregar nuevo campo para múltiples imágenes
ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- 2. Migrar imagen actual al array (si existe)
UPDATE products 
SET images = jsonb_build_array(
  jsonb_build_object(
    'url', image_url,
    'is_main', true,
    'order', 0
  )
)
WHERE image_url IS NOT NULL AND image_url != '';

-- 3. El campo image_url lo puedes dejar por compatibilidad
-- o eliminarlo después: ALTER TABLE products DROP COLUMN image_url;

-- Estructura del JSON:
-- images = [
--   { "url": "https://...", "is_main": true, "order": 0 },
--   { "url": "https://...", "is_main": false, "order": 1 },
--   { "url": "https://...", "is_main": false, "order": 2 }
-- ]

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_products_images ON products USING GIN (images);
