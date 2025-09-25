package com.example.negocio.repository;

import com.example.negocio.entity.DetallePromocion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetallePromocionRepository extends JpaRepository<DetallePromocion, Long> {
}
