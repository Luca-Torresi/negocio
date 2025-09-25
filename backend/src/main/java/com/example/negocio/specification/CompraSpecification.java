package com.example.negocio.specification;

import com.example.negocio.entity.Compra;
import com.example.negocio.entity.Proveedor;
import com.example.negocio.entity.Usuario;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDate;
import java.time.LocalTime;

public class CompraSpecification {

    public static Specification<Compra> porProveedor(Long idProveedor) {
        return (root, query, cb) -> {
            if (idProveedor == null) {
                return cb.conjunction();
            }
            Join<Compra, Proveedor> proveedorJoin = root.join("proveedor");
            return cb.equal(proveedorJoin.get("idProveedor"), idProveedor);
        };
    }

    public static Specification<Compra> porFechaInicio(LocalDate fechaInicio) {
        return (root, query, cb) -> {
            if (fechaInicio == null) {
                return cb.conjunction();
            }
            return cb.greaterThanOrEqualTo(root.get("fechaHora"), fechaInicio.atStartOfDay());
        };
    }

    public static Specification<Compra> porFechaFin(LocalDate fechaFin) {
        return (root, query, cb) -> {
            if (fechaFin == null) {
                return cb.conjunction();
            }
            return cb.lessThanOrEqualTo(root.get("fechaHora"), fechaFin.atTime(LocalTime.MAX));
        };
    }

    public static Specification<Compra> conUsuario(Long idUsuario) {
        return (root, query, cb) -> {
            if (idUsuario == null) {
                return cb.conjunction();
            }
            Join<Compra, Usuario> usuarioJoin = root.join("usuario");
            return cb.equal(usuarioJoin.get("idUsuario"), idUsuario);
        };
    }
}

