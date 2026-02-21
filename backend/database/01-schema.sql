SET search_path TO public;

BEGIN;

-- ==============================
-- USERS (SOLO CLIENTE / ADMIN)
-- ==============================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    firebase_uid VARCHAR(128) UNIQUE,
    auth_provider VARCHAR(32),
    email_verified BOOLEAN DEFAULT FALSE,
    photo_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'CLIENTE' 
        CHECK (role IN ('CLIENTE', 'ADMIN')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

CREATE INDEX idx_users_role ON users(role);

-- ==============================
-- DELIVERY DRIVERS (TERCERIZADO)
-- ==============================

CREATE TABLE delivery_drivers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(150) UNIQUE,
    firebase_uid VARCHAR(128) UNIQUE,
    auth_provider VARCHAR(32),
    email_verified BOOLEAN DEFAULT FALSE,
    photo_url TEXT,
    vehicle_type VARCHAR(50),
    license_number VARCHAR(100),
    company_name VARCHAR(150),
    is_available BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    current_lat DECIMAL(10,8),
    current_lng DECIMAL(11,8),
    last_location_update TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

CREATE INDEX idx_delivery_available ON delivery_drivers(is_available);
CREATE INDEX idx_delivery_active ON delivery_drivers(is_active);
CREATE INDEX idx_delivery_company ON delivery_drivers(company_name);
CREATE INDEX idx_delivery_firebase_uid ON delivery_drivers(firebase_uid);
-- ==============================
-- CATEGORIES
-- ==============================

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- ==============================
-- PRODUCTS
-- ==============================

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    main_image VARCHAR(255) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    badge VARCHAR(50),
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price ON products(price);

-- ==============================
-- ORDERS
-- ==============================

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    delivery_driver_id INT REFERENCES delivery_drivers(id) ON DELETE SET NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    delivery_status VARCHAR(30) DEFAULT 'PENDING_ASSIGNMENT',
    total DECIMAL(10,2) NOT NULL,
    pickup_method VARCHAR(50) DEFAULT 'store',
    assigned_at TIMESTAMP,
    accepted_at TIMESTAMP,
    out_for_delivery_at TIMESTAMP,
    arrived_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_delivery_driver ON orders(delivery_driver_id);
CREATE INDEX idx_orders_delivery_status ON orders(delivery_status);

-- ==============================
-- ORDER DETAILS
-- ==============================

CREATE TABLE order_details (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_order_details_order ON order_details(order_id);

-- ==============================
-- PAYMENTS
-- ==============================

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    method VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_order ON payments(order_id);

-- ==============================
-- CHAT POR PEDIDO
-- ==============================

CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL, 
    sender_id INT NOT NULL,
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'TEXT',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

CREATE INDEX idx_chat_order ON chat_messages(order_id);

-- ==============================
-- DELIVERY LOCATION HISTORY
-- ==============================

CREATE TABLE delivery_locations (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    delivery_driver_id INT REFERENCES delivery_drivers(id) ON DELETE CASCADE,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_delivery_locations_order ON delivery_locations(order_id);

-- ==============================
-- NOTIFICATIONS
-- ==============================

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150),
    message TEXT,
    type VARCHAR(50),
    related_order_id INT REFERENCES orders(id),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);

-- ==============================
-- DELIVERY DRIVER NOTIFICATIONS
-- ==============================

CREATE TABLE delivery_driver_notifications (
    id SERIAL PRIMARY KEY,
    delivery_driver_id INT REFERENCES delivery_drivers(id) ON DELETE CASCADE,
    title VARCHAR(150),
    message TEXT,
    type VARCHAR(50),
    related_order_id INT REFERENCES orders(id),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_delivery_driver_notifications_driver ON delivery_driver_notifications(delivery_driver_id);
CREATE INDEX idx_delivery_driver_notifications_order ON delivery_driver_notifications(related_order_id);

COMMIT;