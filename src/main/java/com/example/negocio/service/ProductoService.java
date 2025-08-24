package com.example.negocio.service;

import com.example.negocio.dto.producto.ProductoDTO;
import com.example.negocio.dto.producto.ProductoAbmDTO;
import com.example.negocio.dto.producto.ProductoItemDTO;
import com.example.negocio.dto.producto.ProductoListaDTO;
import com.example.negocio.entity.Producto;
import com.example.negocio.mapper.ProductoMapper;
import com.example.negocio.repository.CategoriaRepository;
import com.example.negocio.repository.MarcaRepository;
import com.example.negocio.repository.ProductoRepository;
import com.example.negocio.repository.ProveedorRepository;
import com.example.negocio.specification.ProductoSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductoService {
    private final ProductoRepository productoRepository;
    private final MarcaRepository marcaRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProveedorRepository proveedorRepository;
    private final ProductoMapper productoMapper;

    public Producto nuevoProducto(ProductoDTO dto) {
        Producto producto = productoMapper.toEntity(dto, marcaRepository, categoriaRepository, proveedorRepository);
        producto.setEstado(true);

        return productoRepository.save(producto);
    }

    public Producto modificarProducto(Long idProducto, ProductoDTO dto) {
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException());

        productoMapper.updateFromDto(dto, producto, marcaRepository, categoriaRepository, proveedorRepository);
        return productoRepository.save(producto);
    }

    public Page<ProductoAbmDTO> obtenerProductos(Integer page, Integer size, String nombre, Long idCategoria){
        Pageable pageable = PageRequest.of(page, size);
        Specification<Producto> spec = ProductoSpecification.conNombre(nombre)
                .and(ProductoSpecification.conCategoria(idCategoria));

        return productoRepository.findAll(spec, pageable)
                .map(productoMapper::toAbmDto);
    }

    public List<ProductoListaDTO> listarProductosVenta(){
        List<Producto> productos = productoRepository.findByEstadoTrue();

        return productos.stream()
                .map(productoMapper::toListaDto)
                .collect(Collectors.toList());
    }

    public List<ProductoItemDTO> listarProductosCompra(Long idProveedor){
        List<Producto> productos = productoRepository.findByEstadoTrueAndProveedorIdProveedor(idProveedor);

        return productos.stream()
                .map(productoMapper::toItemDto)
                .collect(Collectors.toList());
    }

    public void cambiarEstadoProducto(Long idProducto){
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException());

        producto.setEstado(!producto.getEstado());
        productoRepository.save(producto);
    }
}

