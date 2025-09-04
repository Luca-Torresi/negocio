package com.example.negocio.repository;
import com.example.negocio.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long>, JpaSpecificationExecutor<Venta> {

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
    @Query(value = "SELECT IFNULL(AVG(total), 0) FROM venta " +
            "WHERE fechaHora >= DATE_FORMAT(CURDATE(), '%Y-%m-01') " +
            "  AND fechaHora < DATE_FORMAT(CURDATE(), '%Y-%m-01') + INTERVAL 1 MONTH",
            nativeQuery = true)
    BigDecimal findTicketPromedioMesActual();

}
