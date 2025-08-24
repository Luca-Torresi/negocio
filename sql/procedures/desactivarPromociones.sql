# Desactiva las promociones que contienen un producto en particular
DROP PROCEDURE IF EXISTS desactivarPromociones;

DELIMITER $$
CREATE PROCEDURE desactivarPromociones(IN _idProducto INT)
BEGIN
    DECLARE _idPromocion INT;
    DECLARE _estado BOOLEAN;
    DECLARE finCursor INT DEFAULT 0;

    DECLARE nuevoCursor CURSOR FOR
        SELECT DISTINCT idPromocion, estado
        FROM promocion
                 INNER JOIN detallePromocion ON detallePromocion.idPromocion = promocion.idPromocion
        WHERE idProducto = _idProducto;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET finCursor = 1;

    OPEN nuevoCursor;
    bucle: LOOP
        FETCH nuevoCursor INTO _idPromocion;
        IF finCursor = 1 THEN
            LEAVE bucle;
        END IF;

        IF _estado THEN
            UPDATE promocion SET estado = FALSE WHERE idPromocion = _idPromocion;
        END IF;

    END LOOP;
    CLOSE nuevoCursor;
END $$