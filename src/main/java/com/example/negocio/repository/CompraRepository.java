package com.example.negocio.repository;

import com.example.negocio.dto.estadisticas.ResultadoMensualDTO;
import com.example.negocio.entity.Compra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Long>, JpaSpecificationExecutor<Compra> {

    @Query(value = "SELECT DATE_FORMAT(fechaHora, '%Y-%m') AS mes, IFNULL(SUM(total), 0) AS total " +
            "FROM compra " +
            "WHERE fechaHora >= :fechaInicio AND fechaHora < :fechaFin " +
            "GROUP BY mes " +
            "ORDER BY mes ASC",
            nativeQuery = true)
    List<ResultadoMensualDTO> findEgresosPorComprasMensuales(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

    // KPI: Total gastado este mes (solo la parte de 'compras')
    @Query(value = "SELECT IFNULL(SUM(total), 0) FROM compra " +
            "WHERE fechaHora >= DATE_FORMAT(CURDATE(), '%Y-%m-01') " +
            "  AND fechaHora < DATE_FORMAT(CURDATE(), '%Y-%m-01') + INTERVAL 1 MONTH",
            nativeQuery = true)
    BigDecimal findTotalComprasMesActual();

}
