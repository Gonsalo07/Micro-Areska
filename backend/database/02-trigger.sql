SET search_path TO public;

CREATE OR REPLACE FUNCTION sync_order_status_from_delivery()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = OLD.status THEN
        RETURN NEW;
    END IF;

    IF NEW.status = 'DELIVERED' THEN
        UPDATE orders
           SET status     = 'completed',
               updated_at = NOW()
         WHERE id = NEW.order_id
           AND status NOT IN ('completed', 'cancelled');

    ELSIF NEW.status = 'CANCELLED' THEN
        UPDATE orders
           SET status     = 'cancelled',
               updated_at = NOW()
         WHERE id = NEW.order_id
           AND status NOT IN ('completed', 'cancelled');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_order_status
AFTER UPDATE OF status ON order_delivery_details
FOR EACH ROW
EXECUTE FUNCTION sync_order_status_from_delivery();
