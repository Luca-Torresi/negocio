package com.example.negocio.repository;

import com.example.negocio.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    @Query(value = "WITH RECURSIVE CategoriaDescendientes AS (" +
            "    SELECT idCategoria, idCategoriaPadre FROM categoria WHERE idCategoria = :idCategoria " +
            "    UNION ALL " +
            "    SELECT c.idCategoria, c.idCategoriaPadre FROM categoria c " +
            "    INNER JOIN CategoriaDescendientes cd ON c.idCategoriaPadre = cd.idCategoria" +
            ")" +
            "SELECT idCategoria FROM CategoriaDescendientes",
            nativeQuery = true)
    List<Long> findSelfAndDescendantIds(@Param("idCategoria") Long idCategoria);
}
