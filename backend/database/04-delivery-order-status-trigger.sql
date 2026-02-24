-- ======================================================
-- TRIGGER: Sincroniza orders.status cuando la entrega
--          cambia a DELIVERED o CANCELLED
-- ======================================================

-- Función que ejecuta el trigger
CREATE OR REPLACE FUNCTION sync_order_status_from_delivery()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo actúa cuando el estado realmente cambia
    IF NEW.status = OLD.status THEN
        RETURN NEW;
    END IF;

    -- Entrega completada → orden completada
    IF NEW.status = 'DELIVERED' THEN
        UPDATE orders
           SET status     = 'completed',
               updated_at = NOW()
         WHERE id = NEW.order_id
           AND status NOT IN ('completed', 'cancelled');

    -- Entrega cancelada → orden cancelada
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

-- Eliminar el trigger si ya existía (para re-ejecuciones seguras)
DROP TRIGGER IF EXISTS trg_sync_order_status ON order_delivery_details;

-- Crear el trigger: se dispara AFTER UPDATE en order_delivery_details
CREATE TRIGGER trg_sync_order_status
AFTER UPDATE OF status ON order_delivery_details
FOR EACH ROW
EXECUTE FUNCTION sync_order_status_from_delivery();
