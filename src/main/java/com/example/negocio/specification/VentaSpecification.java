package com.example.negocio.specification;

import com.example.negocio.entity.Venta;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalTime;

public class VentaSpecification {

    public static Specification<Venta> porFechaInicio(LocalDate fechaInicio) {
        return (root, query, cb) -> {
            if (fechaInicio == null) {
                return cb.conjunction();
            }
            return cb.greaterThanOrEqualTo(root.get("fechaHora"), fechaInicio.atStartOfDay());
        };
    }

    public static Specification<Venta> porFechaFin(LocalDate fechaFin) {
        return (root, query, cb) -> {
            if (fechaFin == null) {
                return cb.conjunction();
            }
            return cb.lessThanOrEqualTo(root.get("fechaHora"), fechaFin.atTime(LocalTime.MAX));
        };
    }
}

