package com.example.negocio.specification;

import com.example.negocio.entity.Categoria;
import com.example.negocio.entity.Marca;
import com.example.negocio.entity.Producto;
import com.example.negocio.entity.Proveedor;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

public class ProductoSpecification {

    public static Specification<Producto> conNombre(String nombre) {
        return (root, query, cb) -> {
            if (nombre == null || nombre.isBlank()) {
                return cb.conjunction();
            }
            return cb.like(cb.lower(root.get("nombre")), "%" + nombre.toLowerCase() + "%");
        };
    }

    public static Specification<Producto> conCategoria(Long idCategoria) {
        return (root, query, cb) -> {
            if (idCategoria == null) {
                return cb.conjunction();
            }
            Join<Producto, Categoria> categoriaJoin = root.join("categoria");
            return cb.equal(categoriaJoin.get("idCategoria"), idCategoria);
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
