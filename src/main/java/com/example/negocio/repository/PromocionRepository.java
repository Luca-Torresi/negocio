package com.example.negocio.repository;

import com.example.negocio.entity.Promocion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PromocionRepository extends JpaRepository<Promocion, Long> {
    List<Promocion> findByEstadoTrue();
}
