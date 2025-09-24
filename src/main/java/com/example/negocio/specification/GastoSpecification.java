package com.example.negocio.specification;

import com.example.negocio.entity.Gasto;
import com.example.negocio.entity.Usuario;
import com.example.negocio.enums.TipoGasto;
import jakarta.persistence.criteria.Join;
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

    public static Specification<Gasto> conUsuario(Long idUsuario) {
        return (root, query, cb) -> {
            if (idUsuario == null) {
                return cb.conjunction();
            }
            Join<Gasto, Usuario> usuarioJoin = root.join("usuario");
            return cb.equal(usuarioJoin.get("idUsuario"), idUsuario);
        };
    }
}
