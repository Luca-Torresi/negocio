# Se descuente el stock correspondiente a la promoción dentro de una venta
DROP PROCEDURE IF EXISTS recorrerDetallesPromocion;

DELIMITER $$
CREATE PROCEDURE recorrerDetallesPromocion(IN _idPromocion INT, IN _cantidad INT)
BEGIN
    DECLARE _idProducto INT;
    DECLARE _cantProducto INT;
    DECLARE finCursor INT DEFAULT 0;

    DECLARE nuevoCursor CURSOR FOR
        SELECT idProducto, cantidad
        FROM detallePromocion
        WHERE idPromocion = _idPromocion;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET finCursor = 1;

    OPEN nuevoCursor;
        bucle: LOOP
            FETCH nuevoCursor INTO _idProducto, _cantProducto;
            IF finCursor THEN
                LEAVE bucle;
            END IF;

            UPDATE producto SET stock = (stock - _cantidad * _cantProducto) WHERE idProducto = _idProducto;

        END LOOP;
    CLOSE nuevoCursor;
END $$