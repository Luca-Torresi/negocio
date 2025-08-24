package com.example.negocio.specification;

import com.example.negocio.entity.Categoria;
import com.example.negocio.entity.Producto;
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
}
