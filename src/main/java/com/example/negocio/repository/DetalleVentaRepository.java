package com.example.negocio.repository;

import com.example.negocio.dto.estadistica.GraficoGeneralDTO;
import com.example.negocio.dto.estadistica.VolumenVentasDTO;
import com.example.negocio.dto.producto.MesAnteriorDTO;
import com.example.negocio.dto.reporte.ReporteVentasDTO;
import com.example.negocio.entity.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {

    @Query(
            value = "SELECT " +
                    "    CAST(t.idProducto AS SIGNED) AS idProducto, " +
                    "    CAST(SUM(t.cantidad) AS SIGNED) AS total " +
                    "FROM ( " +
                    "    SELECT " +
                    "        dv.idProducto, " +
                    "        dv.cantidad " +
                    "    FROM detalleVenta dv " +
                    "    JOIN venta v ON dv.idVenta = v.idVenta " +
                    "    WHERE dv.idProducto IS NOT NULL " +
                    "      AND v.fechaHora >= :inicioMesPasado AND v.fechaHora < :inicioMesActual " +
                    " " +
                    "    UNION ALL " +
                    " " +
                    "    SELECT " +
                    "        dp.idProducto, " +
                    "        dv.cantidad * dp.cantidad AS cantidad " +
                    "    FROM detalleVenta dv " +
                    "    JOIN venta v ON dv.idVenta = v.idVenta " +
                    "    JOIN detallePromocion dp ON dv.idPromocion = dp.idPromocion " +
                    "    WHERE dv.idPromocion IS NOT NULL " +
                    "      AND v.fechaHora >= :inicioMesPasado AND v.fechaHora < :inicioMesActual " +
                    ") AS t " +
                    "GROUP BY t.idProducto",
            nativeQuery = true
    )
    List<MesAnteriorDTO> findCantidadVendidaMesAnterior (
            @Param("inicioMesPasado") LocalDateTime inicioMesPasado,
            @Param("inicioMesActual") LocalDateTime inicioMesActual
    );

    @Query(
            value = "SELECT " +
                    "    p.nombre AS etiqueta, " +
                    "    SUM((dv.precioUnitario - " +
                    "        IFNULL(" +
                    "            (" +
                    "                SELECT dc.costoUnitario " +
                    "                FROM detalleCompra dc " +
                    "                JOIN compra c ON dc.idCompra = c.idCompra " +
                    "                WHERE dc.idProducto = p.idProducto AND c.fechaHora <= v.fechaHora " +
                    "                ORDER BY c.fechaHora DESC " +
                    "                LIMIT 1" +
                    "            ), " +
                    "            p.costo" +
                    "        )" +
                    "    ) * dv.cantidad) AS valor " +
                    "FROM detalleVenta dv " +
                    "INNER JOIN producto p ON p.idProducto = dv.idProducto " +
                    "INNER JOIN venta v ON v.idVenta = dv.idVenta " +
                    "WHERE " +
                    "    dv.idProducto IS NOT NULL " +
                    "    AND v.fechaHora >= :fechaInicio " +
                    "    AND v.fechaHora < :fechaFin " +
                    "GROUP BY " +
                    "    p.idProducto, p.nombre " +
                    "ORDER BY " +
                    "    valor DESC " +
                    "LIMIT 7 OFFSET :offset",
            nativeQuery = true
    )
    List<GraficoGeneralDTO> findTopProductosMasRentables(
            @Param("offset") Integer offset,
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

    @Query(
            value = "SELECT " +
                    "    t.mes, " +
                    "    'Todos los Productos' AS nombre, " +
                    "    SUM(t.cantidad) AS cantidad " +
                    "FROM ( " +
                    "    SELECT " +
                    "        DATE_FORMAT(v.fechaHora, '%Y-%m') AS mes, " +
                    "        dv.cantidad " +
                    "    FROM detalleVenta dv " +
                    "    JOIN venta v ON dv.idVenta = v.idVenta " +
                    "    WHERE dv.idProducto IS NOT NULL " +
                    "      AND v.fechaHora >= :fechaInicio AND v.fechaHora < :fechaFin " +
                    "    UNION ALL " +
                    "    SELECT " +
                    "        DATE_FORMAT(v.fechaHora, '%Y-%m') AS mes, " +
                    "        dv.cantidad * dp.cantidad AS cantidad " +
                    "    FROM detalleVenta dv " +
                    "    JOIN venta v ON dv.idVenta = v.idVenta " +
                    "    JOIN promocion p ON dv.idPromocion = p.idPromocion " +
                    "    JOIN detallePromocion dp ON p.idPromocion = dp.idPromocion " +
                    "    WHERE dv.idPromocion IS NOT NULL " +
                    "      AND v.fechaHora >= :fechaInicio AND v.fechaHora < :fechaFin " +
                    ") AS t " +
                    "GROUP BY t.mes " +
                    "ORDER BY t.mes ASC",
            nativeQuery = true
    )
    List<VolumenVentasDTO> findVolumenVentasMensualTotal(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

    @Query(
            value = "SELECT " +
                    "    t.mes, " +
                    "    t.nombre, " +
                    "    SUM(t.cantidad) AS cantidad " +
                    "FROM ( " +
                    "    SELECT " +
                    "        DATE_FORMAT(v.fechaHora, '%Y-%m') AS mes, " +
                    "        p.nombre AS nombre, " +
                    "        dv.cantidad " +
                    "    FROM detalleVenta dv " +
                    "    JOIN venta v ON dv.idVenta = v.idVenta " +
                    "    JOIN producto p ON dv.idProducto = p.idProducto " +
                    "    WHERE dv.idProducto = :idProducto " +
                    "      AND v.fechaHora >= :fechaInicio AND v.fechaHora < :fechaFin " +
                    "    UNION ALL " +
                    "    SELECT " +
                    "        DATE_FORMAT(v.fechaHora, '%Y-%m') AS mes, " +
                    "        p_en_promo.nombre AS nombre, " +
                    "        dv.cantidad * dp.cantidad AS cantidad " +
                    "    FROM detalleVenta dv " +
                    "    JOIN venta v ON dv.idVenta = v.idVenta " +
                    "    JOIN promocion promo ON dv.idPromocion = promo.idPromocion " +
                    "    JOIN detallePromocion dp ON promo.idPromocion = dp.idPromocion " +
                    "    JOIN producto p_en_promo ON dp.idProducto = p_en_promo.idProducto " +
                    "    WHERE dp.idProducto = :idProducto " +
                    "      AND v.fechaHora >= :fechaInicio AND v.fechaHora < :fechaFin " +
                    ") AS t " +
                    "GROUP BY t.mes, t.nombre " +
                    "ORDER BY t.mes ASC",
            nativeQuery = true
    )
    List<VolumenVentasDTO> findVolumenVentasMensualPorProducto(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin,
            @Param("idProducto") Long idProducto
    );

    @Query(
            value = "SELECT " +
                    "    t.producto, " +
                    "    CAST(SUM(t.cantidad) AS SIGNED) AS cantidad, " +
                    "    t.precio " +
                    "FROM ( " +
                    "    SELECT " +
                    "        p.nombre AS producto, " +
                    "        dv.cantidad AS cantidad, " +
                    "        p.precio AS precio " +
                    "    FROM detalleVenta dv " +
                    "    JOIN producto p ON dv.idProducto = p.idProducto " +
                    "    JOIN venta v ON dv.idVenta = v.idVenta " +
                    "    WHERE dv.idProducto IS NOT NULL " +
                    "      AND v.fechaHora >= :fechaInicio AND v.fechaHora < :fechaFin " +
                    " " +
                    "    UNION ALL " +
                    " " +
                    "    SELECT " +
                    "        p_promo.nombre AS producto, " +
                    "        (dv.cantidad * dp.cantidad) AS cantidad, " +
                    "        p_promo.precio AS precio " +
                    "    FROM detalleVenta dv " +
                    "    JOIN venta v ON dv.idVenta = v.idVenta " +
                    "    JOIN detallePromocion dp ON dv.idPromocion = dp.idPromocion " +
                    "    JOIN producto p_promo ON dp.idProducto = p_promo.idProducto " +
                    "    WHERE dv.idPromocion IS NOT NULL " +
                    "      AND v.fechaHora >= :fechaInicio AND v.fechaHora < :fechaFin " +
                    ") AS t " +
                    "GROUP BY t.producto, t.precio " +
                    "ORDER BY t.producto ASC",
            nativeQuery = true
    )
    List<ReporteVentasDTO> findDatosParaReporteVentas(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

    @Query(
            value = "SELECT IFNULL(SUM(t.costo_total_linea), 0) " +
                    "FROM ( " +
                    "    SELECT SUM(p.costo * dv.cantidad) AS costo_total_linea " +
                    "    FROM detalleVenta dv " +
                    "    JOIN producto p ON dv.idProducto = p.idProducto " +
                    "    JOIN venta v ON dv.idVenta = v.idVenta " +
                    "    WHERE dv.idProducto IS NOT NULL " +
                    "      AND v.fechaHora >= :fechaInicio AND v.fechaHora < :fechaFin " +
                    " " +
                    "    UNION ALL " +
                    " " +
                    "    SELECT SUM(p_promo.costo * dp.cantidad * dv.cantidad) AS costo_total_linea " +
                    "    FROM detalleVenta dv " +
                    "    JOIN venta v ON dv.idVenta = v.idVenta " +
                    "    JOIN detallePromocion dp ON dv.idPromocion = dp.idPromocion " +
                    "    JOIN producto p_promo ON dp.idProducto = p_promo.idProducto " +
                    "    WHERE dv.idPromocion IS NOT NULL " +
                    "      AND v.fechaHora >= :fechaInicio AND v.fechaHora < :fechaFin " +
                    ") AS t",
            nativeQuery = true
    )
    BigDecimal findCostoTotalDeVentasEnRango(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

    @Query(
            value = "SELECT " +
                    "    cat.nombre AS etiqueta, " +
                    "    SUM(dv.precioUnitario * dv.cantidad) AS valor " +
                    "FROM detalleVenta dv " +
                    "JOIN producto p ON dv.idProducto = p.idProducto " +
                    "JOIN categoria cat ON p.idCategoria = cat.idCategoria " + // Join para llegar a la categoría
                    "JOIN venta v ON dv.idVenta = v.idVenta " +
                    "WHERE " +
                    "    dv.idProducto IS NOT NULL " + // Nos aseguramos de contar solo productos
                    "    AND v.fechaHora >= :fechaInicio AND v.fechaHora < :fechaFin " +
                    "GROUP BY " +
                    "    cat.idCategoria, cat.nombre " +
                    "ORDER BY " +
                    "    valor DESC",
            nativeQuery = true
    )
    List<GraficoGeneralDTO> findVentasPorCategoria(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

}
