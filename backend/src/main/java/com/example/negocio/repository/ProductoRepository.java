package com.example.negocio.repository;

import com.example.negocio.dto.reporte.ReporteProductosDTO;
import com.example.negocio.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long>, JpaSpecificationExecutor<Producto> {
    List<Producto> findByEstadoTrue();
    Optional<Producto> findByCodigoDeBarras(String codigoDeBarras);
    Optional<Producto> findByNombre(String nombre);

    // KPI: Productos con stock bajo
    @Query(value = "SELECT COUNT(*) FROM producto WHERE stock <= stockMinimo AND estado = true",
            nativeQuery = true)
    Long countProductosConStockBajo();

    @Query(value = "SELECT nombre AS producto, stock, precio, costo FROM producto",
            nativeQuery = true)
    List<ReporteProductosDTO> findDatosParaReportesMensuales();

    // Calcula el valor total del inventario activo al costo
    @Query("SELECT COALESCE(SUM(p.costo * p.stock), 0) " +
            "FROM Producto p WHERE p.estado = true")
    BigDecimal findValorTotalEnStock();

    // Calcula el valor total del inventario activo al precio de venta
    @Query("SELECT COALESCE(SUM(p.precio * p.stock), 0) " +
            "FROM Producto p WHERE p.estado = true")
    BigDecimal findValorTotalEnPosiblesVentas();
}
