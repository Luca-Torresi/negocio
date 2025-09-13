package com.example.negocio.repository;

import com.example.negocio.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long>, JpaSpecificationExecutor<Producto> {
    List<Producto> findByEstadoTrue();
    Optional<Producto> findByCodigoDeBarras(String codigoDeBarras);

    // KPI: Productos con stock bajo
    @Query(value = "SELECT COUNT(*) FROM producto WHERE stock <= stockMinimo AND estado = true",
            nativeQuery = true)
    Long countProductosConStockBajo();

}
