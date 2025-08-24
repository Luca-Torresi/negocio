package com.example.negocio.repository;

import com.example.negocio.entity.Compra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Long>, JpaSpecificationExecutor<Compra> {
}
