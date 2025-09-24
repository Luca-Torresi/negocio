package com.example.negocio.service;

import com.example.negocio.dto.compra.CompraDTO;
import com.example.negocio.dto.compra.CompraFullDTO;
import com.example.negocio.dto.compra.DetalleCompraDTO;
import com.example.negocio.entity.*;
import com.example.negocio.exception.ProductoNoEncontradoException;
import com.example.negocio.exception.ProveedorNoEncontradoException;
import com.example.negocio.exception.UsuarioNoEncontradoException;
import com.example.negocio.mapper.CompraMapper;
import com.example.negocio.mapper.DetalleCompraMapper;
import com.example.negocio.repository.*;
import com.example.negocio.specification.CompraSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompraService {
    private final CompraRepository compraRepository;
    private final ProveedorRepository proveedorRepository;
    private final ProductoRepository productoRepository;
    private final CompraMapper compraMapper;
    private final DetalleCompraMapper detalleCompraMapper;
    private final UsuarioRepository usuarioRepository;

    public Compra nuevaCompra(Long idUsuario, CompraDTO dto){
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new UsuarioNoEncontradoException());
        Proveedor proveedor = proveedorRepository.findById(dto.getIdProveedor()).orElseThrow(() -> new ProveedorNoEncontradoException());

        Compra compra = compraMapper.toEntity(dto);
        compra.setFechaHora(LocalDateTime.now());
        compra.setUsuario(usuario);
        compra.setProveedor(proveedor);

        BigDecimal total = BigDecimal.ZERO;

        List<DetalleCompra> detalles = new ArrayList<>();
        for(DetalleCompraDTO detalleDto :dto.getDetalles()){
            Producto producto = productoRepository.findById(detalleDto.getIdProducto()).orElseThrow(() -> new ProductoNoEncontradoException());

            DetalleCompra detalle = detalleCompraMapper.toEntity(detalleDto);
            detalle.setProducto(producto);
            detalle.setCostoUnitario(producto.getCosto());
            detalle.setCompra(compra);

            producto.setStock(producto.getStock() + detalle.getCantidad());
            productoRepository.save(producto);

            BigDecimal cantidad = new BigDecimal(detalle.getCantidad());
            BigDecimal subtotal = detalle.getCostoUnitario().multiply(cantidad);
            total = total.add(subtotal);

            detalles.add(detalle);
        }
        compra.setDetalles(detalles);

        if (dto.getDescuento() != null && dto.getDescuento() > 0) {
            BigDecimal descuentoPorcentaje = new BigDecimal(dto.getDescuento());
            BigDecimal cien = new BigDecimal("100");

            BigDecimal multiplicador = BigDecimal.ONE.subtract(descuentoPorcentaje.divide(cien));

            total = total.multiply(multiplicador);
        }

        compra.setTotal(total);

        return compraRepository.save(compra);
    }

    public Page<CompraFullDTO> obtenerCompras(Integer page, Integer size, LocalDate fechaInicio, LocalDate fechaFin, Long idProveedor, Long idUsuario){
        Pageable pageable = PageRequest.of(page, size, Sort.by("fechaHora").descending());
        Specification<Compra> spec = CompraSpecification.porFechaInicio(fechaInicio)
                .and(CompraSpecification.porFechaFin(fechaFin))
                .and(CompraSpecification.porProveedor(idProveedor))
                .and(CompraSpecification.conUsuario(idUsuario));

        return compraRepository.findAll(spec, pageable)
                .map(compraMapper::toFullDto);
    }
}
