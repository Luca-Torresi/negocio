package com.example.negocio.validation;

import com.example.negocio.dto.venta.DetalleVentaDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ExactlyOneNotNullValidator implements ConstraintValidator<ExactlyOneNotNull, DetalleVentaDTO> {

    @Override
    public boolean isValid(DetalleVentaDTO detalle, ConstraintValidatorContext context) {
        if (detalle == null) {
            return true;
        }

        // Esta es la lógica clave (XOR): uno debe ser nulo y el otro no.
        boolean isProductoSet = detalle.getIdProducto() != null;
        boolean isPromocionSet = detalle.getIdPromocion() != null;

        return isProductoSet != isPromocionSet;
    }
}
