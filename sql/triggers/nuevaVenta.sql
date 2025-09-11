/*
# Cuando se realiza una venta, se deben descontar los productos del stock
DROP TRIGGER IF EXISTS nuevaVenta_ai;

DELIMITER $$
CREATE TRIGGER nuevaVenta_ai
    AFTER INSERT ON detalleVenta
    FOR EACH ROW
BEGIN
    IF NEW.idProducto IS NOT NULL THEN
        UPDATE producto SET stock = (stock - NEW.cantidad) WHERE idProducto = NEW.idProducto;
    ELSEIF NEW.idPromocion IS NOT NULL THEN
        CALL recorrerDetallesPromocion(NEW.idPromocion, NEW.cantidad);
    END IF;
END $$