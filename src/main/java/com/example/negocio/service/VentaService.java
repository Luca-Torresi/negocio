package com.example.negocio.service;

import com.example.negocio.dto.venta.VentaDTO;
import com.example.negocio.dto.venta.VentaListaDTO;
import com.example.negocio.entity.Venta;
import com.example.negocio.mapper.VentaMapper;
import com.example.negocio.repository.ProductoRepository;
import com.example.negocio.repository.PromocionRepository;
import com.example.negocio.repository.VentaRepository;
import com.example.negocio.specification.VentaSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VentaService {
    private final VentaRepository ventaRepository;
    private final VentaMapper ventaMapper;
    private final ProductoRepository productoRepository;
    private final PromocionRepository promocionRepository;

    public Venta nuevaVenta(VentaDTO dto){
        Venta venta = ventaMapper.toEntity(dto, productoRepository, promocionRepository);
        venta.setFechaHora(LocalDateTime.now());

        return ventaRepository.save(venta);
    }

    public Page<VentaListaDTO> obtenerVentas(Integer page, Integer size, LocalDate fechaInicio, LocalDate fechaFin){
        Pageable pageable = PageRequest.of(page, size);
        Specification<Venta> spec = VentaSpecification.porFechaInicio(fechaInicio)
                .and(VentaSpecification.porFechaFin(fechaFin));

        return ventaRepository.findAll(spec, pageable)
                .map(ventaMapper::toDto);
    }

}
