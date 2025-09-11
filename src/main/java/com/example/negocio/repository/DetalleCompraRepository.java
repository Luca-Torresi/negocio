package com.example.negocio.repository;

import com.example.negocio.dto.producto.MesAnteriorDTO;
import com.example.negocio.entity.DetalleCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DetalleCompraRepository extends JpaRepository<DetalleCompra, Long> {

    @Query(
            value = "SELECT " +
                    "    CAST(dc.idProducto AS SIGNED) AS idProducto, " +
                    "    CAST(IFNULL(SUM(dc.cantidad), 0) AS SIGNED) AS total " +
                    "FROM detalleCompra dc " +
                    "JOIN compra c ON dc.idCompra = c.idCompra " +
                    "WHERE c.fechaHora >= :inicioMesPasado AND c.fechaHora < :inicioMesActual " +
                    "GROUP BY dc.idProducto", // <-- AÑADE ESTA LÍNEA
            nativeQuery = true
    )
    List<MesAnteriorDTO> findCantidadCompradaMesAnterior(
            @Param("inicioMesPasado") LocalDateTime inicioMesPasado,
            @Param("inicioMesActual") LocalDateTime inicioMesActual
    );

}
