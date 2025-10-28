package com.example.negocio.service;

import com.example.negocio.dto.venta.CatalogoDTO;
import com.example.negocio.dto.venta.DetalleVentaDTO;
import com.example.negocio.dto.venta.VentaDTO;
import com.example.negocio.dto.venta.VentaListaDTO;
import com.example.negocio.entity.*;
import com.example.negocio.enums.MetodoDePago;
import com.example.negocio.exception.ProductoNoEncontradoException;
import com.example.negocio.exception.PromocionNoEncontradaException;
import com.example.negocio.exception.UsuarioNoEncontradoException;
import com.example.negocio.mapper.DetalleVentaMapper;
import com.example.negocio.mapper.ProductoMapper;
import com.example.negocio.mapper.VentaMapper;
import com.example.negocio.repository.ProductoRepository;
import com.example.negocio.repository.PromocionRepository;
import com.example.negocio.repository.UsuarioRepository;
import com.example.negocio.repository.VentaRepository;
import com.example.negocio.specification.VentaSpecification;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
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
    private final ProductoMapper productoMapper;
    private final ProductoService productoService;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public Venta nuevaVenta(Long idUsuario, VentaDTO dto) {
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new UsuarioNoEncontradoException());

        Venta venta = ventaMapper.toEntity(dto);
        venta.setFechaHora(LocalDateTime.now());
        venta.setUsuario(usuario);

        List<DetalleVenta> detalles = dto.getDetalles().stream()
                .map(detalleDto -> procesarDetalle(detalleDto, venta))
                .collect(Collectors.toList());
        venta.setDetalles(detalles);

        BigDecimal total = detalles.stream()
                .map(detalle -> detalle.getPrecioUnitario().multiply(new BigDecimal(detalle.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal descuento = dto.getDescuento();
        if (descuento != null && descuento.compareTo(BigDecimal.ZERO) > 0) {
            total = total.subtract(descuento);
        }

        venta.setTotal(total.setScale(0, RoundingMode.HALF_UP));

        Venta ventaGuardada = ventaRepository.save(venta);

        for (DetalleVenta detalle : ventaGuardada.getDetalles()) {
            if (detalle.getProducto() != null) {
                productoService.descontarStock(
                        detalle.getProducto().getIdProducto(),
                        detalle.getCantidad()
                );
            } else if (detalle.getPromocion() != null) {
                for (DetallePromocion detallePromo : detalle.getPromocion().getDetalles()) {

                    int cantidadTotalADescontar = detalle.getCantidad() * detallePromo.getCantidad();

                    productoService.descontarStock(
                            detallePromo.getProducto().getIdProducto(),
                            cantidadTotalADescontar
                    );
                }
            }
        }

        return ventaGuardada;
    }

    private DetalleVenta procesarDetalle(DetalleVentaDTO dto, Venta venta) {
        DetalleVenta detalle = detalleVentaMapper.toEntity(dto);
        detalle.setVenta(venta);

        if (dto.getIdProducto() != null) {
            Producto producto = productoRepository.findById(dto.getIdProducto()).orElseThrow(() -> new ProductoNoEncontradoException());
            detalle.setProducto(producto);

            boolean ofertaAplicada = false;
            Oferta oferta = producto.getOferta();
            if (oferta != null && detalle.getCantidad() >= oferta.getCantidadMinima()) {
                detalle.setPrecioUnitario(oferta.getNuevoPrecio());
                ofertaAplicada = true;
            }

            if (!ofertaAplicada && producto.getDescuento() != null) {
                BigDecimal precioConDescuento = productoMapper.mapPrecioAbm(producto);
                detalle.setPrecioUnitario(precioConDescuento);
            } else if (!ofertaAplicada) {
                detalle.setPrecioUnitario(producto.getPrecio());
            }

        } else if (dto.getIdPromocion() != null) {
            Promocion promocion = promocionRepository.findById(dto.getIdPromocion()).orElseThrow(() -> new PromocionNoEncontradaException());
            detalle.setPromocion(promocion);
            detalle.setPrecioUnitario(promocion.getPrecio());
        }
        return detalle;
    }

    public List<CatalogoDTO> obtenerCatalogo() {
        List<Producto> productos = productoRepository.findByEstadoTrue();
        List<Promocion> promociones = promocionRepository.findByEstadoTrue();

        List<CatalogoDTO> catalogoProductos = productos.stream()
                .map(ventaMapper::productoToCalalogoDto)
                .toList();

        List<CatalogoDTO> catalogoPromociones = promociones.stream()
                .map(ventaMapper::promocionToCatalogoDto)
                .toList();

        List<CatalogoDTO> catalogo = new ArrayList<>();
        catalogo.addAll(catalogoProductos);
        catalogo.addAll(catalogoPromociones);

        return catalogo;
    }

    public Page<VentaListaDTO> obtenerVentas(Integer page, Integer size, LocalDate fechaInicio, LocalDate fechaFin, Long idUsuario, MetodoDePago metodoDePago) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("fechaHora").descending());
        Specification<Venta> spec = VentaSpecification.porFechaInicio(fechaInicio)
                .and(VentaSpecification.porFechaFin(fechaFin))
                .and(VentaSpecification.conUsuario(idUsuario))
                .and(VentaSpecification.conMetodoDePago(metodoDePago));

        return ventaRepository.findAll(spec, pageable)
                .map(ventaMapper::toDto);
    }

    public List<String> listarMetodosDePago() {
        return Arrays.stream(MetodoDePago.values())
                .map(Enum::name)
                .toList();
    }

}
