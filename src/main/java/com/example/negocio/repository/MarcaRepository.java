package com.example.negocio.repository;

import com.example.negocio.entity.Marca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MarcaRepository extends JpaRepository<Marca, Long> {
}
