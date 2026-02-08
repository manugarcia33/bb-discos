-- ===================================
-- POBLAR BASE DE DATOS CON PRODUCTOS
-- ===================================

-- Insertar productos de prueba
-- Nota: category_id corresponde a:
-- 1 = Bandas Internacionales
-- 2 = Solistas Masculinos
-- 3 = Solistas Femeninas
-- 4 = Jazz
-- 5 = Música Nacional
-- 6 = Música Brasilera
-- 7 = Otros

INSERT INTO products (title, artist, price, installment_price, category_id, stock, year) VALUES
('Abbey Road', 'The Beatles', 30000, 10000, 1, 15, 1969),
('The Dark Side of the Moon', 'Pink Floyd', 35000, 11667, 1, 12, 1973),
('Rumours', 'Fleetwood Mac', 28000, 9333, 1, 18, 1977),
('Thriller', 'Michael Jackson', 32000, 10667, 2, 20, 1982),
('Back in Black', 'AC/DC', 29000, 9667, 1, 16, 1980),
('The Wall', 'Pink Floyd', 38000, 12667, 1, 10, 1979),
('Kind of Blue', 'Miles Davis', 42000, 14000, 4, 8, 1959),
('Legend', 'Bob Marley & The Wailers', 26000, 8667, 1, 22, 1984),
('Master of Puppets', 'Metallica', 31000, 10333, 1, 14, 1986),
('Born to Run', 'Bruce Springsteen', 27000, 9000, 2, 19, 1975),
('Blue Lines', 'Massive Attack', 33000, 11000, 1, 11, 1991),
('Illmatic', 'Nas', 25000, 8333, 2, 17, 1994),
('The Velvet Underground & Nico', 'The Velvet Underground', 45000, 15000, 1, 6, 1967),
('Random Access Memories', 'Daft Punk', 39000, 13000, 1, 13, 2013),
('Blue', 'Joni Mitchell', 36000, 12000, 3, 9, 1971),
('A Love Supreme', 'John Coltrane', 48000, 16000, 4, 7, 1965),
('The Rise and Fall of Ziggy Stardust', 'David Bowie', 34000, 11333, 2, 12, 1972),
('Paranoid', 'Black Sabbath', 29500, 9833, 1, 15, 1970),
('AM', 'Arctic Monkeys', 24000, 8000, 1, 25, 2013),
('Elis & Tom', 'Elis Regina & Tom Jobim', 28500, 9500, 6, 10, 1974),
('Soda Stereo', 'Soda Stereo', 41000, 13667, 5, 8, 1984),
('The Miseducation of Lauryn Hill', 'Lauryn Hill', 30500, 10167, 3, 14, 1998),
('Artaud', 'Pescado Rabioso', 23000, 7667, 5, 11, 1973),
('Unplugged', 'Eric Clapton', 52000, 17333, 2, 6, 1992);

-- Marcar algunos como destacados
UPDATE products SET is_featured = true WHERE id IN (1, 2, 4, 7, 16);

-- Marcar algunos con descuento
UPDATE products SET is_on_sale = true, discount_percentage = 15 WHERE id IN (8, 12, 19);
UPDATE products SET is_on_sale = true, discount_percentage = 20 WHERE id IN (23);

-- Mostrar resumen
SELECT 
  (SELECT COUNT(*) FROM products) as total_productos,
  (SELECT COUNT(*) FROM products WHERE is_featured = true) as destacados,
  (SELECT COUNT(*) FROM products WHERE is_on_sale = true) as en_oferta;
