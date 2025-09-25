package com.example.negocio.specification;

import com.example.negocio.entity.Categoria;
import com.example.negocio.entity.Marca;
import com.example.negocio.entity.Producto;
import com.example.negocio.entity.Proveedor;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import java.util.List;

public class ProductoSpecification {

    public static Specification<Producto> conNombre(String nombre) {
        return (root, query, cb) -> {
            if (nombre == null || nombre.isBlank()) {
                return cb.conjunction();
            }
            return cb.like(cb.lower(root.get("nombre")), "%" + nombre.toLowerCase() + "%");
        };
    }

    public static Specification<Producto> conBajoStock(Boolean soloStockBajo) {
        if (soloStockBajo == null || !soloStockBajo) {
            return null;
        }

        return (root, query, criteriaBuilder) -> {
            Predicate stockBajo = criteriaBuilder.lessThanOrEqualTo(root.get("stock"), root.get("stockMinimo"));
            Predicate estaActivo = criteriaBuilder.isTrue(root.get("estado"));

            return criteriaBuilder.and(stockBajo, estaActivo);
        };
    }

    public static Specification<Producto> conCategoria(List<Long> idsCategorias) {
        return (root, query, cb) -> {
            if (idsCategorias == null || idsCategorias.isEmpty()) {
                return cb.conjunction();
            }
            Join<Producto, Categoria> categoriaJoin = root.join("categoria");
            return categoriaJoin.get("idCategoria").in(idsCategorias);
        };
    }

    public static Specification<Producto> conMarca(Long idMarca) {
        return (root, query, cb) -> {
            if (idMarca == null) {
                return cb.conjunction();
            }
            Join<Producto, Marca> marcaJoin = root.join("marca");
            return cb.equal(marcaJoin.get("idMarca"), idMarca);
        };
    }

    public static Specification<Producto> conProveedor(Long idProveedor) {
        return (root, query, cb) -> {
            if (idProveedor == null) {
                return cb.conjunction();
            }
            Join<Producto, Proveedor> proveedorJoin = root.join("proveedor");
            return cb.equal(proveedorJoin.get("idProveedor"), idProveedor);
        };
    }
}
