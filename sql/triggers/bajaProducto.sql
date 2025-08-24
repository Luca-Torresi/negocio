# Cuando un producto es dado de baja, se deben desactivar todas las promociones que contengan dicho producto
DROP TRIGGER IF EXISTS bajaProducto_au;

DELIMITER $$
CREATE TRIGGER bajaProducto_au
    AFTER UPDATE ON producto
    FOR EACH ROW
BEGIN
    IF OLD.estado = TRUE AND NEW.estado = FALSE THEN
        CALL desactivarPromociones(NEW.idProducto);
    END IF;
END $$