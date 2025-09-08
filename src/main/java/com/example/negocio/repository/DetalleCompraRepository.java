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

    @Query(value = "SELECT idProducto, cantidad AS total FROM detalleCompra\n" +
            "INNER JOIN compra on compra.idCompra = detalleCompra.idCompra\n" +
            "WHERE fechaHora >= :inicioMesPasado AND fechaHora < :inicioMesActual",
            nativeQuery = true)
    List<MesAnteriorDTO> findCantidadCompradaMesAnterior(
            @Param("inicioMesPasado") LocalDateTime inicioMesPasado,
            @Param("inicioMesActual") LocalDateTime inicioMesActual
    );

}
