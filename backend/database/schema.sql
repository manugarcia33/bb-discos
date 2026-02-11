-- ===================================
-- BB DISCOS - Database Schema
-- ===================================

-- Eliminar tablas existentes (si quieres empezar de cero)
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Tabla de Categorías/Géneros
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Productos (Vinilos)
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  installments INTEGER DEFAULT 3,
  installment_price DECIMAL(10, 2),
  
  -- Descripción del vinilo
  label VARCHAR(150),
  catalog_number VARCHAR(50),
  country VARCHAR(100),
  year INTEGER,
  condition_cover VARCHAR(50),
  condition_media VARCHAR(50),
  
  -- Comercial
  category_id INTEGER REFERENCES categories(id),
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_on_sale BOOLEAN DEFAULT FALSE,
  discount_percentage INTEGER DEFAULT 0,
  description TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_on_sale ON products(is_on_sale);
CREATE INDEX IF NOT EXISTS idx_products_artist ON products(artist);
CREATE INDEX IF NOT EXISTS idx_products_year ON products(year);

-- Insertar categorías iniciales
INSERT INTO categories (name, slug) VALUES
  ('Bandas Internacionales', 'international'),
  ('Solistas Masculinos', 'solistas-masculinos'),
  ('Solistas Femeninas', 'solistas-femeninas'),
  ('Jazz', 'jazz'),
  ('Música Nacional', 'nacional'),
  ('Música Brasilera', 'brasilera'),
  ('Otros', 'others')
ON CONFLICT (slug) DO NOTHING;
