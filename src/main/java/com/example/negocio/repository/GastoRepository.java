package com.example.negocio.repository;

import com.example.negocio.dto.estadistica.ResultadoMensualDTO;
import com.example.negocio.entity.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GastoRepository extends JpaRepository<Gasto,Long>, JpaSpecificationExecutor<Gasto> {

    @Query(value = "SELECT DATE_FORMAT(fechaHora, '%Y-%m') AS mes, IFNULL(SUM(monto), 0) AS total " +
            "FROM gasto " +
            "WHERE fechaHora >= :fechaInicio AND fechaHora < :fechaFin " +
            "GROUP BY mes " +
            "ORDER BY mes ASC",
            nativeQuery = true)
    List<ResultadoMensualDTO> findEgresosPorGastosMensuales(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

    // KPI: Total gastado este mes (solo la parte de 'gastos')
    @Query(value = "SELECT IFNULL(SUM(monto), 0) FROM gasto " +
            "WHERE fechaHora >= DATE_FORMAT(CURDATE(), '%Y-%m-01') " +
            "  AND fechaHora < DATE_FORMAT(CURDATE(), '%Y-%m-01') + INTERVAL 1 MONTH",
            nativeQuery = true)
    BigDecimal findTotalGastosMesActual();
}
