package com.example.negocio.repository;

import com.example.negocio.entity.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;

@Repository
public interface GastoRepository extends JpaRepository<Gasto,Long>, JpaSpecificationExecutor<Gasto> {

    // KPI: Total gastado este mes (solo la parte de 'gastos')
    @Query(value = "SELECT IFNULL(SUM(monto), 0) FROM gasto " +
            "WHERE fechaHora >= DATE_FORMAT(CURDATE(), '%Y-%m-01') " +
            "  AND fechaHora < DATE_FORMAT(CURDATE(), '%Y-%m-01') + INTERVAL 1 MONTH",
            nativeQuery = true)
    BigDecimal findTotalGastosMesActual();
}
