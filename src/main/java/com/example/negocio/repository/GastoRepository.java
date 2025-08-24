package com.example.negocio.repository;

import com.example.negocio.entity.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface GastoRepository extends JpaRepository<Gasto,Long>, JpaSpecificationExecutor<Gasto> {
}
