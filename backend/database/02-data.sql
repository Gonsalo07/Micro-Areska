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
('Alejandro', 'Vargas', 'alejandro.vargas@mail.com', '555-1001', 'Av. Gamer 123, Ciudad A', NULL, 'password', TRUE, NULL),
('Belen', 'Quiroga', 'belen.quiroga@mail.com', '555-1002', 'Calle RGB 45, Ciudad B', NULL, 'password', TRUE, NULL),
('Carlos', 'Molina', 'carlos.molina@mail.com', '555-1003', 'Jirón Pixel 678, Ciudad C', NULL, 'password', TRUE, NULL),
('Daniela', 'Flores', 'daniela.flores@mail.com', '555-1004', 'Pasaje E-Sports 90, Ciudad D', NULL, 'password', TRUE, NULL),
('Emilio', 'Gutiérrez', 'emilio.gutierrez@mail.com', '555-1005', 'Av. Latencia 101, Ciudad A', NULL, 'password', TRUE, NULL);

INSERT INTO orders (user_id, order_date, status, total, pickup_method) VALUES
(1, '2024-10-01 10:00:00', 'completed', 239.98, 'shipping'),
(2, '2024-10-02 11:30:00', 'completed', 179.99, 'store'),
(3, '2024-10-03 14:45:00', 'pending', 459.98, 'shipping'),
(4, '2024-10-04 16:00:00', 'shipped', 89.99, 'store'),
(5, '2024-10-05 09:15:00', 'completed', 299.99, 'shipping');

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

COMMIT;