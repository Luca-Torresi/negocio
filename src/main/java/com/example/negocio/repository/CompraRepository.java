package com.example.negocio.repository;

import com.example.negocio.entity.Compra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Long>, JpaSpecificationExecutor<Compra> {

    // KPI: Total gastado este mes (solo la parte de 'compras')
    @Query(value = "SELECT IFNULL(SUM(total), 0) FROM compra " +
            "WHERE fechaHora >= DATE_FORMAT(CURDATE(), '%Y-%m-01') " +
            "  AND fechaHora < DATE_FORMAT(CURDATE(), '%Y-%m-01') + INTERVAL 1 MONTH",
            nativeQuery = true)
    BigDecimal findTotalComprasMesActual();

}
