-- Script para modificar la base de datos y soportar múltiples imágenes
-- OPCIÓN 2: Tabla separada (más profesional y escalable)

-- 1. Crear tabla de imágenes de productos
CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_main BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  alt_text VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, display_order)
);

-- 2. Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_main ON product_images(product_id, is_main);

-- 3. Migrar imágenes existentes a la nueva tabla
INSERT INTO product_images (product_id, image_url, is_main, display_order)
SELECT id, image_url, true, 0
FROM products
WHERE image_url IS NOT NULL AND image_url != ''
ON CONFLICT DO NOTHING;

-- 4. Agregar constraint: solo una imagen principal por producto
CREATE OR REPLACE FUNCTION check_single_main_image()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_main = true THEN
    UPDATE product_images 
    SET is_main = false 
    WHERE product_id = NEW.product_id 
      AND id != NEW.id 
      AND is_main = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_single_main_image
BEFORE INSERT OR UPDATE ON product_images
FOR EACH ROW
EXECUTE FUNCTION check_single_main_image();

-- El campo image_url en products lo puedes mantener para compatibilidad
-- o eliminarlo: ALTER TABLE products DROP COLUMN image_url;
