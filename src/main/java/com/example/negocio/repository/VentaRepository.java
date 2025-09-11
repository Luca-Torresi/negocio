package com.example.negocio.repository;
import com.example.negocio.dto.estadisticas.GraficoDeConteoDTO;
import com.example.negocio.dto.estadisticas.GraficoGeneralDTO;
import com.example.negocio.dto.estadisticas.ResultadoMensualDTO;
import com.example.negocio.dto.estadisticas.VentasPorHoraDTO;
import com.example.negocio.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long>, JpaSpecificationExecutor<Venta> {

    @Query(value = "SELECT DATE_FORMAT(fechaHora, '%Y-%m') AS mes, IFNULL(SUM(total), 0) AS total " +
            "FROM venta " +
            "WHERE fechaHora >= :fechaInicio AND fechaHora < :fechaFin " +
            "GROUP BY mes " +
            "ORDER BY mes ASC",
            nativeQuery = true)
    List<ResultadoMensualDTO> findIngresosMensuales(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

    @Query(
            value = "SELECT " +
                    "    HOUR(fechaHora) AS hora, " +
                    "    COUNT(*) AS cantidad " +
                    "FROM venta " +
                    "WHERE " +
                    "    fechaHora >= :fechaInicio " +
                    "    AND fechaHora < :fechaFin " +
                    "GROUP BY " +
                    "    hora " +
                    "ORDER BY " +
                    "    hora ASC",
            nativeQuery = true
    )
    List<VentasPorHoraDTO> findVentasPorHora(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

    @Query(
            value = "SELECT metodoDePago AS etiqueta, COUNT(*) AS valor FROM venta\n" +
                    "WHERE fechaHora >= :fechaInicio AND fechaHora < :fechaFin\n" +
                    "GROUP BY metodoDePago",
            nativeQuery = true
    )
    List<GraficoDeConteoDTO> findVentasPorMetodoDePago(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

    // KPI: Total recaudado este mes
    @Query(value = "SELECT IFNULL(SUM(total), 0) FROM venta " +
            "WHERE fechaHora >= DATE_FORMAT(CURDATE(), '%Y-%m-01') " +
            "  AND fechaHora < DATE_FORMAT(CURDATE(), '%Y-%m-01') + INTERVAL 1 MONTH",
            nativeQuery = true)
    BigDecimal findTotalRecaudadoMesActual();

    // KPI: Cantidad de ventas en el mes
    @Query(value = "SELECT COUNT(*) FROM venta " +
            "WHERE fechaHora >= DATE_FORMAT(CURDATE(), '%Y-%m-01') " +
            "  AND fechaHora < DATE_FORMAT(CURDATE(), '%Y-%m-01') + INTERVAL 1 MONTH",
            nativeQuery = true)
    Long countVentasMesActual();

    // KPI: Ticket promedio
    @Query(value = "SELECT IFNULL(ROUND(AVG(total), -2), 0) FROM venta " +
            "WHERE fechaHora >= DATE_FORMAT(CURDATE(), '%Y-%m-01') " +
            "  AND fechaHora < DATE_FORMAT(CURDATE(), '%Y-%m-01') + INTERVAL 1 MONTH",
            nativeQuery = true)
    BigDecimal findTicketPromedioMesActual();

}
