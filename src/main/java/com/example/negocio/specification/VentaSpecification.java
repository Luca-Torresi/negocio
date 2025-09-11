package com.example.negocio.specification;

import com.example.negocio.entity.Compra;
import com.example.negocio.entity.Gasto;
import com.example.negocio.entity.Usuario;
import com.example.negocio.entity.Venta;
import com.example.negocio.enums.MetodoDePago;
import com.example.negocio.enums.TipoGasto;
import jakarta.persistence.criteria.Join;
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

    public static Specification<Venta> conUsuario(Long idUsuario) {
        return (root, query, cb) -> {
            if (idUsuario == null) {
                return cb.conjunction();
            }
            Join<Venta, Usuario> usuarioJoin = root.join("usuario");
            return cb.equal(usuarioJoin.get("idUsuario"), idUsuario);
        };
    }

    public static Specification<Venta> conMetodoDePago(MetodoDePago metodoDePago) {
        return (root, query, cb) -> {
            if (metodoDePago == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("metodoDePago"), metodoDePago);
        };
    }
}

