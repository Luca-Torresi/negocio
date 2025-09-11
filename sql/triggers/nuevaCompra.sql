/*
# Cuando se realiza una compra a un proveedor, se debe cargar el stock ingresado
DROP TRIGGER IF EXISTS nuevaCompra_ai;

DELIMITER $$
CREATE TRIGGER nuevaCompra_ai
    AFTER INSERT ON detalleCompra
    FOR EACH ROW
BEGIN
    UPDATE Producto SET stock = (stock + NEW.cantidad) WHERE idProducto = NEW.idProducto;
END $$