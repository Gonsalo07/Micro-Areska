-- Migration: Add customer name and phone to order_delivery_details
-- Date: 2025-01-14
-- Purpose: Allow delivery drivers to see customer information in chat

ALTER TABLE order_delivery_details 
ADD COLUMN IF NOT EXISTS customer_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20);

-- Add comments for documentation
COMMENT ON COLUMN order_delivery_details.customer_name IS 'Full name of the customer for delivery identification';
COMMENT ON COLUMN order_delivery_details.customer_phone IS 'Contact phone number of the customer';
