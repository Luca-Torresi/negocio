package com.example.negocio.service;

import com.example.negocio.dto.compra.CompraDTO;
import com.example.negocio.dto.compra.CompraFullDTO;
import com.example.negocio.dto.compra.DetalleCompraDTO;
import com.example.negocio.entity.Compra;
import com.example.negocio.entity.DetalleCompra;
import com.example.negocio.entity.Producto;
import com.example.negocio.entity.Proveedor;
import com.example.negocio.exception.CompraNoEncontradaException;
import com.example.negocio.exception.ProductoNoEncontradoException;
import com.example.negocio.exception.ProveedorNoEncontradoException;
import com.example.negocio.mapper.CompraMapper;
import com.example.negocio.mapper.DetalleCompraMapper;
import com.example.negocio.repository.CompraRepository;
import com.example.negocio.repository.DetalleCompraRepository;
import com.example.negocio.repository.ProductoRepository;
import com.example.negocio.repository.ProveedorRepository;
import com.example.negocio.specification.CompraSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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

    public Compra nuevaCompra(CompraDTO dto){
        Proveedor proveedor = proveedorRepository.findById(dto.getIdProveedor()).orElseThrow(() -> new ProveedorNoEncontradoException());

        Compra compra = compraMapper.toEntity(dto);
        compra.setFechaHora(LocalDateTime.now());
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
        compra.setTotal(total);

        return compraRepository.save(compra);
    }

    public Compra modificarCompra(Long idCompra, CompraDTO dto){
        Compra compra = compraRepository.findById(idCompra).orElseThrow(() -> new CompraNoEncontradaException());

        compraMapper.updateFromDto(dto, compra);
        compra.getDetalles().clear();

        BigDecimal total = BigDecimal.ZERO;

        List<DetalleCompra> detalles = new ArrayList<>();
        for(DetalleCompraDTO detalleDto :dto.getDetalles()){
            Producto producto = productoRepository.findById(detalleDto.getIdProducto()).orElseThrow(() -> new ProductoNoEncontradoException());

            DetalleCompra detalle = detalleCompraMapper.toEntity(detalleDto);
            detalle.setProducto(producto);
            detalle.setCostoUnitario(producto.getCosto());

            BigDecimal cantidad = new BigDecimal(detalle.getCantidad());
            BigDecimal subtotal = detalle.getCostoUnitario().multiply(cantidad);
            total = total.add(subtotal);

            detalles.add(detalle);
        }
        compra.setDetalles(detalles);
        compra.setTotal(total);

        return compraRepository.save(compra);
    }

    public Page<CompraFullDTO> obtenerCompras(Integer page, Integer size, LocalDate fechaInicio, LocalDate fechaFin, Long idProveedor, Long idUsuario){
        Pageable pageable = PageRequest.of(page, size);
        Specification<Compra> spec = CompraSpecification.porFechaInicio(fechaInicio)
                .and(CompraSpecification.porFechaFin(fechaFin))
                .and(CompraSpecification.porProveedor(idProveedor))
                .and(CompraSpecification.conUsuario(idUsuario));

        return compraRepository.findAll(spec, pageable)
                .map(compraMapper::toFullDto);
    }
}
