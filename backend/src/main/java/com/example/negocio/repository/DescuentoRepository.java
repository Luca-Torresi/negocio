package com.example.negocio.repository;

import com.example.negocio.entity.Descuento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DescuentoRepository extends JpaRepository<Descuento, Long> {
}
