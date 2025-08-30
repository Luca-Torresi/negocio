package com.example.negocio.service;

import com.example.negocio.dto.venta.DetalleVentaDTO;
import com.example.negocio.dto.venta.VentaDTO;
import com.example.negocio.dto.venta.VentaListaDTO;
import com.example.negocio.entity.DetalleVenta;
import com.example.negocio.entity.Producto;
import com.example.negocio.entity.Promocion;
import com.example.negocio.entity.Venta;
import com.example.negocio.exception.ProductoNoEncontradoException;
import com.example.negocio.exception.PromocionNoEncontradaException;
import com.example.negocio.mapper.DetalleVentaMapper;
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
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VentaService {
    private final VentaRepository ventaRepository;
    private final VentaMapper ventaMapper;
    private final DetalleVentaMapper detalleVentaMapper;
    private final ProductoRepository productoRepository;
    private final PromocionRepository promocionRepository;

    public Venta nuevaVenta(VentaDTO dto) {
        Venta venta = ventaMapper.toEntity(dto);
        venta.setFechaHora(LocalDateTime.now());

        List<DetalleVenta> detalles = dto.getDetalles().stream()
                .map(detalleDto -> procesarDetalle(detalleDto))
                .collect(Collectors.toList());

        venta.setDetalles(detalles);
        return ventaRepository.save(venta);
    }

    private DetalleVenta procesarDetalle(DetalleVentaDTO dto) {
        DetalleVenta detalle = detalleVentaMapper.toEntity(dto);

        if (dto.getIdProducto() != null) {
            Producto producto = productoRepository.findById(dto.getIdProducto()).orElseThrow(() -> new ProductoNoEncontradoException());
            detalle.setProducto(producto);
            detalle.setPrecioUnitario(producto.getPrecio());

        } else if (dto.getIdPromocion() != null) {
            Promocion promocion = promocionRepository.findById(dto.getIdPromocion()).orElseThrow(() -> new PromocionNoEncontradaException());
            detalle.setPromocion(promocion);
            detalle.setPrecioUnitario(promocion.getPrecio());
        }
        return detalle;
    }

    public Page<VentaListaDTO> obtenerVentas(Integer page, Integer size, LocalDate fechaInicio, LocalDate fechaFin){
        Pageable pageable = PageRequest.of(page, size);
        Specification<Venta> spec = VentaSpecification.porFechaInicio(fechaInicio)
                .and(VentaSpecification.porFechaFin(fechaFin));

        return ventaRepository.findAll(spec, pageable)
                .map(ventaMapper::toDto);
    }

}
