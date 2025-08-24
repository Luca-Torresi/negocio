package com.example.negocio.specification;

import com.example.negocio.entity.Gasto;
import com.example.negocio.enums.TipoGasto;
import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDate;
import java.time.LocalTime;

public class GastoSpecification {

    public static Specification<Gasto> conTipoGasto(TipoGasto tipoGasto) {
        return (root, query, cb) -> {
            if (tipoGasto == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("tipoGasto"), tipoGasto);
        };
    }
    public static Specification<Gasto> porFechaInicio(LocalDate fechaInicio) {
        return (root, query, cb) -> {
            if (fechaInicio == null) {
                return cb.conjunction();
            }
            return cb.greaterThanOrEqualTo(root.get("fechaHora"), fechaInicio.atStartOfDay());
        };
    }

    public static Specification<Gasto> porFechaFin(LocalDate fechaFin) {
        return (root, query, cb) -> {
            if (fechaFin == null) {
                return cb.conjunction();
            }
            return cb.lessThanOrEqualTo(root.get("fechaHora"), fechaFin.atTime(LocalTime.MAX));
        };
    }
}
