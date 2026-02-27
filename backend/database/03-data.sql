SET search_path TO public;

BEGIN;

INSERT INTO categories (name, slug, description) VALUES
('Periféricos', 'perifericos', 'Teclados, ratones y accesorios gaming de alta precisión'),
('Audio', 'audio', 'Auriculares y sistemas de sonido envolvente'),
('Monitores', 'monitores', 'Pantallas de alto rendimiento con tasas de refresco elevadas'),
('Streaming', 'streaming', 'Equipamiento profesional para creadores de contenido'),
('Muebles gaming', 'muebles', 'Sillas y escritorios ergonómicos para largas sesiones'),
('Iluminación', 'iluminacion', 'Iluminación RGB y ambientes personalizables'),
('Accesorios', 'accesorios', 'Complementos esenciales para tu setup gaming');

INSERT INTO products (name, price, original_price, main_image, badge, description, category_id, stock)
VALUES (
    'Teclado Mecánico RGB Gaming',
    149.99,
    199.99,
    '/images/products/keyboards/teclado-mecanico-rgb-1.png',
    'Más vendido',
    'Teclado mecánico gaming con switches azules, iluminación RGB personalizable y reposamuñecas magnético. Diseñado para gamers profesionales con teclas anti-ghosting y construcción de aluminio premium.',
    (SELECT id FROM categories WHERE slug = 'perifericos'),
    50
);

INSERT INTO product_images (product_id, image_url, display_order) VALUES
(1, '/images/products/keyboards/teclado-mecanico-rgb-1.png', 0),
(1, '/images/products/keyboards/teclado-mecanico-rgb-2.png', 1),
(1, '/images/products/keyboards/teclado-mecanico-rgb-3.png', 2),
(1, '/images/products/keyboards/teclado-mecanico-rgb-4.webp', 3);

INSERT INTO product_colors (product_id, name, hex_value, display_order) VALUES
(1, 'Negro', '#000000', 0),
(1, 'Blanco', '#FFFFFF', 1),
(1, 'RGB', '#FF00FF', 2);

INSERT INTO product_sizes (product_id, size_name, display_order) VALUES
(1, 'Tamaño Completo', 0),
(1, 'TKL', 1),
(1, '60%', 2);

INSERT INTO product_features (product_id, feature_text, display_order) VALUES
(1, 'Switches mecánicos Cherry MX', 0),
(1, 'Iluminación RGB por tecla', 1),
(1, 'Anti-ghosting completo', 2),
(1, 'Cable trenzado desmontable', 3),
(1, 'Reposamuñecas magnético', 4);

INSERT INTO products (name, price, original_price, main_image, badge, description, category_id, stock)
VALUES (
    'Mouse Gaming Inalámbrico Pro',
    89.99,
    119.99,
    '/images/products/mice/mouse-gaming-pro-1.png',
    'Nuevo',
    'Mouse gaming inalámbrico de alta precisión con sensor óptico de 25,600 DPI, batería de 70 horas y peso ajustable.',
    (SELECT id FROM categories WHERE slug = 'perifericos'),
    60
);

INSERT INTO product_images (product_id, image_url, display_order) VALUES
(2, '/images/products/mice/mouse-gaming-pro-1.png', 0),
(2, '/images/products/mice/mouse-gaming-pro-2.png', 1),
(2, '/images/products/mice/mouse-gaming-pro-3.webp', 2);

INSERT INTO product_colors (product_id, name, hex_value, display_order) VALUES
(2, 'Negro', '#000000', 0),
(2, 'Blanco', '#FFFFFF', 1);

INSERT INTO product_features (product_id, feature_text, display_order) VALUES
(2, 'Sensor óptico 25,600 DPI', 0),
(2, 'Batería 70 horas', 1),
(2, 'Conexión inalámbrica 2.4GHz', 2),
(2, '8 botones programables', 3),
(2, 'Peso ajustable', 4);

INSERT INTO products (name, price, main_image, badge, description, category_id, stock)
VALUES (
    'Auriculares Gaming 7.1 Surround',
    179.99,
    '/images/products/headsets/auriculares-71.png',
    'Popular',
    'Auriculares gaming con sonido envolvente 7.1, micrófono retráctil con cancelación de ruido y almohadillas de gel refrigerante.',
    (SELECT id FROM categories WHERE slug = 'audio'),
    40
);

INSERT INTO product_images (product_id, image_url, display_order) VALUES
(3, '/images/products/headsets/auriculares-71.png', 0);

INSERT INTO product_features (product_id, feature_text, display_order) VALUES
(3, 'Sonido envolvente 7.1', 0),
(3, 'Micrófono con cancelación de ruido', 1),
(3, 'Almohadillas de gel refrigerante', 2),
(3, 'RGB personalizable', 3),
(3, 'Compatible multi-plataforma', 4);

INSERT INTO products (name, price, original_price, main_image, badge, description, category_id, stock)
VALUES (
    'Monitor Gaming 27" 165Hz',
    329.99,
    399.99,
    '/images/products/monitors/monitor-27-165hz.png',
    'Oferta',
    'Monitor gaming QHD 27 pulgadas con panel IPS, 165Hz, 1ms de respuesta y soporte para G-Sync/FreeSync.',
    (SELECT id FROM categories WHERE slug = 'monitores'),
    30
);

INSERT INTO product_images (product_id, image_url, display_order) VALUES
(4, '/images/products/monitors/monitor-27-165hz.png', 0);

INSERT INTO product_features (product_id, feature_text, display_order) VALUES
(4, 'Resolución 2560x1440 (QHD)', 0),
(4, 'Tasa de refresco 165Hz', 1),
(4, 'Tiempo de respuesta 1ms', 2),
(4, 'Panel IPS con HDR400', 3),
(4, 'Compatible G-Sync y FreeSync', 4);

INSERT INTO products (name, price, main_image, badge, description, category_id, stock)
VALUES (
    'Silla Gaming Ergonómica Pro',
    299.99,
    '/images/products/chairs/silla-gaming-pro.png',
    'Premium',
    'Silla gaming ergonómica con soporte lumbar ajustable, reposabrazos 4D y reclinación hasta 180 grados.',
    (SELECT id FROM categories WHERE slug = 'muebles'),
    25
);

INSERT INTO product_images (product_id, image_url, display_order) VALUES
(5, '/images/products/chairs/silla-gaming-pro.png', 0);

INSERT INTO product_features (product_id, feature_text, display_order) VALUES
(5, 'Soporte lumbar ajustable', 0),
(5, 'Reposabrazos 4D', 1),
(5, 'Reclinación hasta 180°', 2),
(5, 'Cojín de espuma de memoria', 3),
(5, 'Base de acero resistente', 4);

INSERT INTO products (name, price, original_price, main_image, description, category_id, stock)
VALUES (
    'Mousepad XXL Gaming',
    29.99,
    39.99,
    '/images/products/mousepads/mousepad-xxl.png',
    'Mousepad de tamaño extendido con superficie optimizada para gaming, base antideslizante y bordes cosidos.',
    (SELECT id FROM categories WHERE slug = 'accesorios'),
    80
);

INSERT INTO product_images (product_id, image_url, display_order) VALUES
(6, '/images/products/mousepads/mousepad-xxl.png', 0);

INSERT INTO product_features (product_id, feature_text, display_order) VALUES
(6, 'Tamaño XXL: 90x40cm', 0),
(6, 'Base de goma antideslizante', 1),
(6, 'Superficie de control suave', 2),
(6, 'Bordes cosidos resistentes', 3),
(6, 'Fácil de limpiar', 4);

INSERT INTO products (name, price, main_image, badge, description, category_id, stock)
VALUES (
    'Webcam 4K Streaming',
    119.99,
    '/images/products/webcams/webcam-4k-streaming.png',
    'Nuevo',
    'Webcam 4K con enfoque automático, corrección de luz y micrófono estéreo integrado, ideal para streaming profesional.',
    (SELECT id FROM categories WHERE slug = 'streaming'),
    45
);

INSERT INTO product_images (product_id, image_url, display_order) VALUES
(7, '/images/products/webcams/webcam-4k-streaming.png', 0);

INSERT INTO product_features (product_id, feature_text, display_order) VALUES
(7, 'Resolución 4K a 30fps', 0),
(7, 'Enfoque automático', 1),
(7, 'Corrección automática de luz', 2),
(7, 'Micrófono estéreo dual', 3),
(7, 'Compatible con OBS/Streamlabs', 4);

INSERT INTO products (name, price, original_price, main_image, description, category_id, stock)
VALUES (
    'Micrófono Condensador USB',
    89.99,
    129.99,
    '/images/products/microphones/microfono-condensador-usb.png',
    'Micrófono condensador profesional con patrón cardioide, monitoreo en tiempo real y filtro anti-pop incluido.',
    (SELECT id FROM categories WHERE slug = 'streaming'),
    35
);

INSERT INTO product_images (product_id, image_url, display_order) VALUES
(8, '/images/products/microphones/microfono-condensador-usb.png', 0);

INSERT INTO product_features (product_id, feature_text, display_order) VALUES
(8, 'Patrón cardioide profesional', 0),
(8, 'Conexión USB plug-and-play', 1),
(8, 'Monitoreo sin latencia', 2),
(8, 'Filtro anti-pop incluido', 3),
(8, 'Brazo articulado ajustable', 4);

INSERT INTO products (name, price, main_image, description, category_id, stock)
VALUES (
    'Hub USB-C Gaming 7 en 1',
    69.99,
    '/images/products/hubs/hub-usbc-7en1.png',
    'Hub USB-C multifunción con puertos USB 3.0, HDMI 4K, lector SD/microSD y carga rápida PD 100W.',
    (SELECT id FROM categories WHERE slug = 'accesorios'),
    55
);

INSERT INTO product_images (product_id, image_url, display_order) VALUES
(9, '/images/products/hubs/hub-usbc-7en1.png', 0);

INSERT INTO product_features (product_id, feature_text, display_order) VALUES
(9, '3 puertos USB 3.0', 0),
(9, 'Salida HDMI 4K@60Hz', 1),
(9, 'Lector SD/microSD', 2),
(9, 'Puerto Ethernet Gigabit', 3),
(9, 'Carga rápida PD 100W', 4);

INSERT INTO products (name, price, main_image, badge, description, category_id, stock)
VALUES (
    'Tira LED RGB Gaming 3m',
    34.99,
    '/images/products/leds/tira-led-rgb-3m.png',
    'Popular',
    'Tira LED RGB inteligente con control por app, sincronización con música y 16 millones de colores.',
    (SELECT id FROM categories WHERE slug = 'iluminacion'),
    70
);

INSERT INTO product_images (product_id, image_url, display_order) VALUES
(10, '/images/products/leds/tira-led-rgb-3m.png', 0);

INSERT INTO product_features (product_id, feature_text, display_order) VALUES
(10, '3 metros de longitud', 0),
(10, 'Control WiFi por app', 1),
(10, 'Sincronización con música', 2),
(10, '16 millones de colores', 3),
(10, 'Compatible con Alexa/Google', 4);

INSERT INTO products (name, price, main_image, description, category_id, stock)
VALUES (
    'Soporte para Monitor Gaming',
    49.99,
    '/images/products/stands/soporte-monitor-brazo.png',
    'Brazo articulado para monitor con movimiento completo 360°, soporta hasta 32" y 9kg de peso.',
    (SELECT id FROM categories WHERE slug = 'accesorios'),
    40
);

INSERT INTO product_images (product_id, image_url, display_order) VALUES
(11, '/images/products/stands/soporte-monitor-brazo.png', 0);

INSERT INTO product_features (product_id, feature_text, display_order) VALUES
(11, 'Movimiento 360° completo', 0),
(11, 'Soporta monitores hasta 32"', 1),
(11, 'Capacidad de carga 9kg', 2),
(11, 'Gestión de cables integrada', 3),
(11, 'Montaje VESA estándar', 4);

INSERT INTO products (name, price, original_price, main_image, badge, description, category_id, stock)
VALUES (
    'Controlador Pro Inalámbrico',
    69.99,
    89.99,
    '/images/products/controllers/controlador-pro-inalambrico.png',
    'Oferta',
    'Controlador inalámbrico premium con gatillos adaptativos, vibración HD y batería de 12 horas.',
    (SELECT id FROM categories WHERE slug = 'accesorios'),
    50
);

INSERT INTO product_images (product_id, image_url, display_order) VALUES
(12, '/images/products/controllers/controlador-pro-inalambrico.png', 0);

INSERT INTO product_features (product_id, feature_text, display_order) VALUES
(12, 'Conexión Bluetooth/USB-C', 0),
(12, 'Batería 12 horas', 1),
(12, 'Gatillos adaptativos', 2),
(12, 'Vibración HD', 3),
(12, 'Compatible PC/consolas', 4);

INSERT INTO users (first_name, last_name, email, phone, address, firebase_uid, auth_provider, email_verified, photo_url) VALUES
('Alejandro', 'Vargas', 'alejandro.vargas@mail.com', '555-1001', 'Av. Gamer 123, Ciudad A', 'quKJk8AA34UTFsrjqizcJ0nAAJi1', 'password', TRUE, NULL),
('Belen', 'Quiroga', 'belen.quiroga@mail.com', '555-1002', 'Calle RGB 45, Ciudad B', 'TaZ1qsBqoUXjUIUoDtIHgY3YnHz2', 'password', TRUE, NULL),
('Carlos', 'Molina', 'carlos.molina@mail.com', '555-1003', 'Jirón Pixel 678, Ciudad C', 'qbO21IX9ywhQhHdWxbfn4KflHf73', 'password', TRUE, NULL),
('Daniela', 'Flores', 'daniela.flores@mail.com', '555-1004', 'Pasaje E-Sports 90, Ciudad D', 'aDsGr1wuKGOIqS3HplCcKl5DRFd2', 'password', TRUE, NULL),
('Emilio', 'Gutiérrez', 'emilio.gutierrez@mail.com', '555-1005', 'Av. Latencia 101, Ciudad A', 'eYBD6sICicXZPyv2GMlHzYv1XRx1', 'password', TRUE, NULL),
('Jason', 'Vila', 'jasonvila2007@gmail.com', '555-1006', 'Calle Backend 321, Ciudad E', 'VgdlpqoBlQdyisJukUipS5g3Us33', 'password', TRUE, NULL),
('Jason', 'Vila', 'jasonvila2007s@gmail.com', '555-1007', 'Av. Microservicios 654, Ciudad F', 'x5tPw1mOhWNIfLQnyVoxND2QZms1', 'password', TRUE, NULL),
('Andy', 'GP06002423', 'andygp06002423@gmail.com', '555-1008', 'Jirón API 777, Ciudad G', 'U2Nq2MDhBmOeGQgfkbQArRUSKm02', 'password', TRUE, NULL),
('Andy', 'GP0600209', 'andygp0600209@gmail.com', '555-1009', 'Pasaje Gateway 888, Ciudad H', 'fziJoIm8IbWjKdtADVaPUgFrLUs2', 'password', TRUE, NULL),
('Andy', 'GP06002', 'andygp06002@gmail.com', '555-1010', 'Av. Node 999, Ciudad I', 'ya9aV8mYYudRHBDLCq66jGDrFSF3', 'password', TRUE, NULL),
('Juan Jose', 'Blas', 'juanjoseblas345@gmail.com', '555-1011', 'Calle React 222, Ciudad J', 'mwup6yI9VTSuP1v6hBV3UXRPYO53', 'password', TRUE, NULL);

UPDATE users SET role = 'ADMIN' WHERE email = 'jasonvila2007@gmail.com';

INSERT INTO orders (user_id, order_date, status, total, pickup_method) VALUES
(1, '2024-10-01 10:00:00', 'completed', 239.98, 'delivery'),
(2, '2024-10-02 11:30:00', 'completed', 179.99, 'store'),
(3, '2024-10-03 14:45:00', 'pending', 459.98, 'delivery'),
(4, '2024-10-04 16:00:00', 'confirmed', 89.99, 'store'),
(5, '2024-10-05 09:15:00', 'completed', 299.99, 'delivery');

INSERT INTO order_details (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 149.99),
(1, 2, 1, 89.99),
(2, 3, 1, 179.99),
(3, 4, 1, 329.99),
(3, 5, 1, 129.99),
(4, 2, 1, 89.99),
(5, 5, 1, 299.99);

INSERT INTO payments (order_id, method, amount, payment_date) VALUES
(1, 'Credit Card', 239.98, '2024-10-01 10:05:00'),
(2, 'PayPal', 179.99, '2024-10-02 11:35:00'),
(4, 'Debit Card', 89.99, '2024-10-04 16:05:00'),
(5, 'Credit Card', 299.99, '2024-10-05 09:20:00');

-- ─────────────────────────────────────────────────────────────────────────────
-- DELIVERY DRIVERS
-- NOTA: Reemplaza el firebase_uid del driver 1 con el tuyo real para ver tus stats
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO delivery_drivers (full_name, phone, email, firebase_uid, auth_provider, email_verified, vehicle_type, license_number, company_name, is_available, is_active)
VALUES
  ('Carlos Repartidor', '555-2001', 'carlos.delivery@areska.com', 'DRIVER_UID_001_REPLACE_ME', 'password', TRUE, 'Moto',      'LIC-MOTO-001', 'Areska Express', TRUE,  TRUE),
  ('María Repartidora', '555-2002', 'maria.delivery@areska.com',  'DRIVER_UID_002_REPLACE_ME', 'password', TRUE, 'Bicicleta', 'LIC-BICI-002', 'Areska Express', TRUE,  TRUE);

-- ─────────────────────────────────────────────────────────────────────────────
-- ÓRDENES ADICIONALES CON PICKUP_METHOD = 'delivery'
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO orders (user_id, order_date, status, total, pickup_method) VALUES
(1, '2025-09-15 08:30:00', 'completed', 149.99, 'delivery'),   -- order 6
(2, '2025-10-20 10:00:00', 'completed', 89.99,  'delivery'),   -- order 7
(3, '2025-11-05 14:15:00', 'completed', 329.99, 'delivery'),   -- order 8
(4, '2025-11-18 16:45:00', 'completed', 69.99,  'delivery'),   -- order 9
(5, '2025-12-03 09:00:00', 'completed', 119.99, 'delivery'),   -- order 10
(1, '2025-12-20 11:30:00', 'completed', 179.99, 'delivery'),   -- order 11
(2, '2026-01-08 08:00:00', 'completed', 299.99, 'delivery'),   -- order 12
(3, '2026-01-22 15:30:00', 'cancelled', 149.99, 'delivery'),   -- order 13 (cancelado)
(4, '2026-02-21 09:10:00', 'completed', 89.99,  'delivery'),   -- order 14 (esta semana)
(5, '2026-02-23 11:45:00', 'completed', 49.99,  'delivery'),   -- order 15 (esta semana)
(1, '2026-02-25 14:00:00', 'completed', 119.99, 'delivery'),   -- order 16 (esta semana)
(2, '2026-02-26 10:30:00', 'cancelled', 69.99,  'delivery'),   -- order 17 (esta semana - cancelado)
(3, '2026-02-27 09:00:00', 'pending',   249.99, 'delivery');   -- order 18 (pendiente hoy)

INSERT INTO payments (order_id, method, amount, payment_date) VALUES
(6,  'Credit Card', 149.99, '2025-09-15 08:35:00'),
(7,  'PayPal',       89.99, '2025-10-20 10:05:00'),
(8,  'Credit Card', 329.99, '2025-11-05 14:20:00'),
(9,  'Debit Card',   69.99, '2025-11-18 16:50:00'),
(10, 'PayPal',      119.99, '2025-12-03 09:05:00'),
(11, 'Credit Card', 179.99, '2025-12-20 11:35:00'),
(12, 'Debit Card',  299.99, '2026-01-08 08:05:00'),
(14, 'PayPal',       89.99, '2026-02-21 09:15:00'),
(15, 'Credit Card',  49.99, '2026-02-23 11:50:00'),
(16, 'PayPal',      119.99, '2026-02-25 14:05:00'),
(18, 'Debit Card',  249.99, '2026-02-27 09:05:00');

-- ─────────────────────────────────────────────────────────────────────────────
-- ORDER DELIVERY DETAILS  (delivery_driver_id = 1 → primer driver registrado)
-- Modifica delivery_driver_id si tu cuenta tiene un ID diferente
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO order_delivery_details
  (order_id, delivery_driver_id, destination_address, destination_lat, destination_lng,
   destination_reference, customer_name, customer_phone, status,
   assigned_at, accepted_at, picked_up_at, out_for_delivery_at, arrived_at, delivered_at, cancelled_at, cancellation_reason,
   created_at, updated_at)
VALUES
-- Orden 1 – DELIVERED (oct 2024)
(1,  1, 'Av. Gamer 123, Ciudad A',          -12.046374, -77.042793, 'Frente al parque',         'Alejandro Vargas', '555-1001', 'DELIVERED',
 '2024-10-01 10:08:00', '2024-10-01 10:10:00', '2024-10-01 10:28:00', '2024-10-01 10:33:00', '2024-10-01 10:52:00', '2024-10-01 10:58:00', NULL, NULL,
 '2024-10-01 10:05:00', '2024-10-01 10:58:00'),

-- Orden 3 – CANCELLED (oct 2024)
(3,  1, 'Jirón Pixel 678, Ciudad C',         -12.122972, -77.030556, 'Edificio azul',            'Carlos Molina',    '555-1003', 'CANCELLED',
 '2024-10-03 14:50:00', '2024-10-03 14:52:00', NULL, NULL, NULL, NULL, '2024-10-03 15:10:00', 'Cliente no disponible',
 '2024-10-03 14:48:00', '2024-10-03 15:10:00'),

-- Orden 5 – DELIVERED (oct 2024)
(5,  1, 'Av. Latencia 101, Ciudad A',        -12.055100, -77.038100, 'Casa verde entrada',       'Emilio Gutiérrez', '555-1005', 'DELIVERED',
 '2024-10-05 09:22:00', '2024-10-05 09:24:00', '2024-10-05 09:40:00', '2024-10-05 09:45:00', '2024-10-05 10:05:00', '2024-10-05 10:10:00', NULL, NULL,
 '2024-10-05 09:20:00', '2024-10-05 10:10:00'),

-- Orden 6 – DELIVERED (sep 2025)
(6,  1, 'Calle RGB 45, Ciudad B',            -12.101234, -77.021111, 'Piso 3 departamento 301',  'Belen Quiroga',    '555-1002', 'DELIVERED',
 '2025-09-15 08:35:00', '2025-09-15 08:37:00', '2025-09-15 08:55:00', '2025-09-15 09:00:00', '2025-09-15 09:22:00', '2025-09-15 09:28:00', NULL, NULL,
 '2025-09-15 08:32:00', '2025-09-15 09:28:00'),

-- Orden 7 – DELIVERED (oct 2025)
(7,  1, 'Pasaje E-Sports 90, Ciudad D',      -12.135678, -77.062345, 'Puerta naranja',           'Daniela Flores',   '555-1004', 'DELIVERED',
 '2025-10-20 10:05:00', '2025-10-20 10:07:00', '2025-10-20 10:22:00', '2025-10-20 10:28:00', '2025-10-20 10:48:00', '2025-10-20 10:55:00', NULL, NULL,
 '2025-10-20 10:03:00', '2025-10-20 10:55:00'),

-- Orden 8 – DELIVERED (nov 2025)
(8,  1, 'Jirón Pixel 678, Ciudad C',         -12.122972, -77.030556, 'Portón negro',             'Carlos Molina',    '555-1003', 'DELIVERED',
 '2025-11-05 14:20:00', '2025-11-05 14:22:00', '2025-11-05 14:40:00', '2025-11-05 14:46:00', '2025-11-05 15:05:00', '2025-11-05 15:12:00', NULL, NULL,
 '2025-11-05 14:18:00', '2025-11-05 15:12:00'),

-- Orden 9 – DELIVERED (nov 2025)
(9,  1, 'Pasaje Gateway 888, Ciudad H',      -12.088765, -77.055432, 'Condominio Las Flores',    'Alejandro Vargas', '555-1001', 'DELIVERED',
 '2025-11-18 16:50:00', '2025-11-18 16:52:00', '2025-11-18 17:10:00', '2025-11-18 17:16:00', '2025-11-18 17:35:00', '2025-11-18 17:42:00', NULL, NULL,
 '2025-11-18 16:48:00', '2025-11-18 17:42:00'),

-- Orden 10 – DELIVERED (dic 2025)
(10, 1, 'Av. Node 999, Ciudad I',            -12.065432, -77.078901, 'Cerca al grifo Repsol',    'Emilio Gutiérrez', '555-1005', 'DELIVERED',
 '2025-12-03 09:05:00', '2025-12-03 09:07:00', '2025-12-03 09:25:00', '2025-12-03 09:31:00', '2025-12-03 09:52:00', '2025-12-03 09:58:00', NULL, NULL,
 '2025-12-03 09:03:00', '2025-12-03 09:58:00'),

-- Orden 11 – DELIVERED (dic 2025)
(11, 1, 'Calle Backend 321, Ciudad E',       -12.149012, -77.013456, 'Segundo piso',             'Belen Quiroga',    '555-1002', 'DELIVERED',
 '2025-12-20 11:35:00', '2025-12-20 11:37:00', '2025-12-20 11:55:00', '2025-12-20 12:01:00', '2025-12-20 12:22:00', '2025-12-20 12:28:00', NULL, NULL,
 '2025-12-20 11:33:00', '2025-12-20 12:28:00'),

-- Orden 12 – DELIVERED (ene 2026)
(12, 1, 'Av. Microservicios 654, Ciudad F',  -12.072345, -77.094567, 'Al costado del colegio',   'Daniela Flores',   '555-1004', 'DELIVERED',
 '2026-01-08 08:05:00', '2026-01-08 08:07:00', '2026-01-08 08:26:00', '2026-01-08 08:32:00', '2026-01-08 08:55:00', '2026-01-08 09:02:00', NULL, NULL,
 '2026-01-08 08:03:00', '2026-01-08 09:02:00'),

-- Orden 13 – CANCELLED (ene 2026)
(13, 1, 'Jirón API 777, Ciudad G',           -12.113456, -77.048765, 'Frente a la farmacia',     'Carlos Molina',    '555-1003', 'CANCELLED',
 '2026-01-22 15:35:00', '2026-01-22 15:37:00', '2026-01-22 15:55:00', NULL, NULL, NULL, '2026-01-22 16:10:00', 'Dirección incorrecta',
 '2026-01-22 15:33:00', '2026-01-22 16:10:00'),

-- Orden 14 – DELIVERED (feb 21, 2026 – esta semana)
(14, 1, 'Av. Gamer 123, Ciudad A',           -12.046374, -77.042793, 'Timbre nombre Vargas',     'Alejandro Vargas', '555-1001', 'DELIVERED',
 '2026-02-21 09:15:00', '2026-02-21 09:17:00', '2026-02-21 09:35:00', '2026-02-21 09:41:00', '2026-02-21 10:00:00', '2026-02-21 10:06:00', NULL, NULL,
 '2026-02-21 09:13:00', '2026-02-21 10:06:00'),

-- Orden 15 – DELIVERED (feb 23, 2026 – esta semana)
(15, 1, 'Calle RGB 45, Ciudad B',            -12.101234, -77.021111, 'Departamento 204',         'Belen Quiroga',    '555-1002', 'DELIVERED',
 '2026-02-23 11:50:00', '2026-02-23 11:52:00', '2026-02-23 12:10:00', '2026-02-23 12:15:00', '2026-02-23 12:35:00', '2026-02-23 12:41:00', NULL, NULL,
 '2026-02-23 11:48:00', '2026-02-23 12:41:00'),

-- Orden 16 – DELIVERED (feb 25, 2026 – esta semana)
(16, 1, 'Av. Latencia 101, Ciudad A',        -12.055100, -77.038100, 'Casa blanca',              'Emilio Gutiérrez', '555-1005', 'DELIVERED',
 '2026-02-25 14:05:00', '2026-02-25 14:07:00', '2026-02-25 14:26:00', '2026-02-25 14:32:00', '2026-02-25 14:52:00', '2026-02-25 14:58:00', NULL, NULL,
 '2026-02-25 14:03:00', '2026-02-25 14:58:00'),

-- Orden 17 – CANCELLED (feb 26, 2026 – esta semana)
(17, 1, 'Pasaje E-Sports 90, Ciudad D',      -12.135678, -77.062345, 'Edificio rojo',            'Daniela Flores',   '555-1004', 'CANCELLED',
 '2026-02-26 10:35:00', '2026-02-26 10:37:00', NULL, NULL, NULL, NULL, '2026-02-26 10:50:00', 'Cliente canceló el pedido',
 '2026-02-26 10:33:00', '2026-02-26 10:50:00'),

-- Orden 18 – PENDING_ASSIGNMENT (hoy feb 27, 2026 – sin driver aún)
(18, NULL, 'Jirón Pixel 678, Ciudad C',      -12.122972, -77.030556, 'Portón madera',            'Carlos Molina',    '555-1003', 'PENDING_ASSIGNMENT',
 NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
 '2026-02-27 09:00:00', '2026-02-27 09:00:00');

COMMIT;
