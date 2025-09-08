package com.example.negocio.repository;

import com.example.negocio.dto.estadisticas.GraficoGeneralDTO;
import com.example.negocio.dto.estadisticas.VolumenVentasDTO;
import com.example.negocio.entity.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {

    @Query(
            value = "SELECT " +
                    "    p.nombre AS etiqueta, " +
                    "    SUM((dv.precioUnitario - p.costo) * dv.cantidad) AS valor " +
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
                    "LIMIT 7",
            nativeQuery = true
    )
    List<GraficoGeneralDTO> findTopProductosMasRentables(
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

}
