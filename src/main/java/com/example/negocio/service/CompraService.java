package com.example.negocio.service;

import com.example.negocio.dto.compra.CompraDTO;
import com.example.negocio.dto.compra.CompraFullDTO;
import com.example.negocio.entity.Compra;
import com.example.negocio.mapper.CompraMapper;
import com.example.negocio.repository.CompraRepository;
import com.example.negocio.repository.ProductoRepository;
import com.example.negocio.repository.ProveedorRepository;
import com.example.negocio.specification.CompraSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class CompraService {
    private final CompraRepository compraRepository;
    private final ProveedorRepository proveedorRepository;
    private final ProductoRepository productoRepository;
    private final CompraMapper compraMapper;

    public Compra nuevaCompra(CompraDTO dto){
        Compra compra = compraMapper.toEntity(dto, proveedorRepository, productoRepository);
        compra.setFechaHora(LocalDateTime.now());

        return compraRepository.save(compra);
    }

    public Page<CompraFullDTO> obtenerCompras(Integer page, Integer size, LocalDate fechaInicio, LocalDate fechaFin, Long idProveedor){
        Pageable pageable = PageRequest.of(page, size);
        Specification<Compra> spec = CompraSpecification.porFechaInicio(fechaInicio)
                .and(CompraSpecification.porFechaFin(fechaFin))
                .and(CompraSpecification.porProveedor(idProveedor));

        return compraRepository.findAll(spec, pageable)
                .map(compraMapper::toFullDto);
    }
}
