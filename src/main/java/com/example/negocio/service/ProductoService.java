package com.example.negocio.service;

import com.example.negocio.dto.producto.*;
import com.example.negocio.dto.venta.CatalogoDTO;
import com.example.negocio.entity.*;
import com.example.negocio.exception.*;
import com.example.negocio.mapper.ProductoMapper;
import com.example.negocio.mapper.VentaMapper;
import com.example.negocio.repository.*;
import com.example.negocio.specification.ProductoSpecification;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductoService {
    private final ProductoRepository productoRepository;
    private final MarcaRepository marcaRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProveedorRepository proveedorRepository;
    private final ProductoMapper productoMapper;
    private final DetalleVentaRepository detalleVentaRepository;
    private final DetalleCompraRepository detalleCompraRepository;
    private final VentaMapper ventaMapper;

    @Transactional
    public Producto nuevoProducto(ProductoDTO dto) {
        validarCodigoDeBarrasUnico(dto.getCodigoDeBarras(), null);

        Producto producto = productoMapper.toEntity(dto);
        producto.setEstado(true);

        if(dto.getIdMarca() != null){
            Marca marca = marcaRepository.findById(dto.getIdMarca()).orElseThrow(() -> new MarcaNoEncontradaException());
            producto.setMarca(marca);
        } else{
            producto.setMarca(null);
        }

        Categoria categoria = categoriaRepository.findById(dto.getIdCategoria()).orElseThrow(() -> new CategoriaNoEncontradaException());
        producto.setCategoria(categoria);

        Proveedor proveedor = proveedorRepository.findById(dto.getIdProveedor()).orElseThrow(() -> new ProveedorNoEncontradoException());
        producto.setProveedor(proveedor);

        return productoRepository.save(producto);
    }

    @Transactional
    public Producto modificarProducto(Long idProducto, ProductoDTO dto) {
        validarCodigoDeBarrasUnico(dto.getCodigoDeBarras(), idProducto);

        Producto producto = productoRepository.findById(idProducto).orElseThrow(() -> new ProductoNoEncontradoException());
        Categoria categoria = categoriaRepository.findById(dto.getIdCategoria()).orElseThrow(() -> new CategoriaNoEncontradaException());
        Marca marca = marcaRepository.findById(dto.getIdMarca()).orElseThrow(() -> new MarcaNoEncontradaException());
        Proveedor proveedor = proveedorRepository.findById(dto.getIdProveedor()).orElseThrow(() -> new ProveedorNoEncontradoException());

        productoMapper.updateFromDto(dto, producto);
        producto.setCategoria(categoria);
        producto.setMarca(marca);
        producto.setProveedor(proveedor);

        return productoRepository.save(producto);
    }

    public Page<ProductoAbmDTO> obtenerProductos(Integer page, Integer size, String nombre, Long idCategoria, Long idMarca, Long idProveedor, Boolean bajoStock) {
        LocalDate hoy = LocalDate.now();
        LocalDate primerDiaMesActual = hoy.withDayOfMonth(1);
        LocalDate primerDiaMesPasado = primerDiaMesActual.minusMonths(1);

        LocalDateTime inicioMesActual = primerDiaMesActual.atStartOfDay();
        LocalDateTime inicioMesPasado = primerDiaMesPasado.atStartOfDay();

        System.out.println("ANTES");
        List<MesAnteriorDTO> cantVendida = detalleVentaRepository.findCantidadVendidaMesAnterior(inicioMesPasado, inicioMesActual);
        System.out.println("DESPUÉS");
        Map<Long, Long> mapaDeVentas = cantVendida.stream()
                .collect(Collectors.toMap(MesAnteriorDTO::getIdProducto, MesAnteriorDTO::getTotal));

        List<MesAnteriorDTO> cantComprada = detalleCompraRepository.findCantidadCompradaMesAnterior(inicioMesPasado, inicioMesActual);
        Map<Long, Long> mapaDeCompras = cantComprada.stream()
                .collect(Collectors.toMap(MesAnteriorDTO::getIdProducto, MesAnteriorDTO::getTotal));

        List<Long> idsCategoriasFiltrar = null;
        if (idCategoria != null && idCategoria != 0) {
            idsCategoriasFiltrar = categoriaRepository.findSelfAndDescendantIds(idCategoria);
        }

        Pageable pageable = PageRequest.of(page, size);
        Specification<Producto> spec = ProductoSpecification.conNombre(nombre)
                .and(ProductoSpecification.conCategoria(idsCategoriasFiltrar))
                .and(ProductoSpecification.conMarca(idMarca))
                .and(ProductoSpecification.conProveedor(idProveedor))
                .and(ProductoSpecification.conBajoStock(bajoStock));

        Page<Producto> productos = productoRepository.findAll(spec, pageable);

        return productos.map(producto -> {
            ProductoAbmDTO dto = productoMapper.toAbmDto(producto);
            Long totalVendido = mapaDeVentas.getOrDefault(producto.getIdProducto(), 0L);
            dto.setCantVendida(totalVendido);
            Long totalComprado = mapaDeCompras.getOrDefault(producto.getIdProducto(), 0L);
            dto.setCantComprada(totalComprado);
            return dto;
        });
    }

    public List<ProductoCompraDTO> listarProductosCompra(){
        List<Producto> productos = productoRepository.findByEstadoTrue();

        return productos.stream()
                .map(productoMapper::toCompraDto)
                .collect(Collectors.toList());
    }

    public List<ProductoVentaDTO> listarProductosVenta(){
        List<Producto> productos = productoRepository.findByEstadoTrue();

        return productos.stream()
                .map(productoMapper::toVentaDto)
                .collect(Collectors.toList());
    }

    public void cambiarEstadoProducto(Long idProducto){
        Producto producto = productoRepository.findById(idProducto).orElseThrow(() -> new ProductoNoEncontradoException());

        producto.setEstado(!producto.getEstado());
        productoRepository.save(producto);
    }

    @Transactional
    public void descontarStock(Long idProducto, Integer cantidadADescontar) {
        Producto producto = productoRepository.findById(idProducto).orElseThrow(() -> new ProductoNoEncontradoException());

        if (producto.getStock() < cantidadADescontar) {
            throw new StockInsuficienteException(producto.getNombre());
        }

        int nuevoStock = producto.getStock() - cantidadADescontar;
        producto.setStock(nuevoStock);

        productoRepository.save(producto);
    }

    public CatalogoDTO buscarPorCodigo(String codigoDeBarras){
        Producto producto = productoRepository.findByCodigoDeBarras(codigoDeBarras).orElseThrow(() -> new ProductoNoEncontradoException());

        return ventaMapper.productoToCalalogoDto(producto);
    }

    private void validarCodigoDeBarrasUnico(String codigoDeBarras, Long idProductoActual) {
        // Si el código de barras es nulo o vacío, no hay nada que validar.
        if (codigoDeBarras == null || codigoDeBarras.trim().isEmpty()) {
            return;
        }

        Optional<Producto> productoExistente = productoRepository.findByCodigoDeBarras(codigoDeBarras);

        if (productoExistente.isPresent()) {
            // Si estamos modificando, debemos asegurarnos de que el código encontrado
            // no pertenezca al mismo producto que estamos editando.
            if (idProductoActual == null || !productoExistente.get().getIdProducto().equals(idProductoActual)) {
                throw new DataIntegrityViolationException("El código de barras '" + codigoDeBarras + "' ya está en uso.");
            }
        }
    }
}

