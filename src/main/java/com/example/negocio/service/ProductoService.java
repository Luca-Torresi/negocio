package com.example.negocio.service;

import com.example.negocio.dto.producto.*;
import com.example.negocio.entity.Categoria;
import com.example.negocio.entity.Marca;
import com.example.negocio.entity.Producto;
import com.example.negocio.entity.Proveedor;
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
        Producto producto = productoMapper.toEntity(dto);
        producto.setEstado(true);

        if(dto.getIdMarca() != null){
            Marca marca = marcaRepository.findById(dto.getIdMarca())
                    .orElseThrow(() -> new RuntimeException("No existe una marca"));
            producto.setMarca(marca);
        } else{
            producto.setMarca(null);
        }

        Categoria categoria = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("No existe una categoria con ese id"));
        producto.setCategoria(categoria);

        Proveedor proveedor = proveedorRepository.findById(dto.getIdProveedor())
                .orElseThrow(() -> new RuntimeException("No existe una proveedor"));
        producto.setProveedor(proveedor);


        return productoRepository.save(producto);
    }

    public Producto modificarProducto(Long idProducto, ProductoDTO dto) {
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException());

        Categoria categoria = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("No existe una categoria con ese id"));

        Marca marca = marcaRepository.findById(dto.getIdMarca())
                .orElseThrow(() -> new RuntimeException("No existe una marca"));

        Proveedor proveedor = proveedorRepository.findById(dto.getIdProveedor())
                .orElseThrow(() -> new RuntimeException("No existe una proveedor"));

        productoMapper.updateFromDto(dto, producto);
        producto.setCategoria(categoria);
        producto.setMarca(marca);
        producto.setProveedor(proveedor);

        return productoRepository.save(producto);
    }

    public Page<ProductoAbmDTO> obtenerProductos(Integer page, Integer size, String nombre, Long idCategoria, Long idMarca, Long idProveedor) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Producto> spec = ProductoSpecification.conNombre(nombre)
                .and(ProductoSpecification.conCategoria(idCategoria))
                .and(ProductoSpecification.conMarca(idMarca))
                .and(ProductoSpecification.conProveedor(idProveedor));

        return productoRepository.findAll(spec, pageable)
                .map(productoMapper::toAbmDto);
    }

    public List<ProductoVentaDTO> listarProductosVenta(){
        List<Producto> productos = productoRepository.findByEstadoTrue();

        return productos.stream()
                .map(productoMapper::toVentaDto)
                .collect(Collectors.toList());
    }

    public List<ProductoCompraDTO> listarProductosCompra(Long idProveedor){
        List<Producto> productos = productoRepository.findByEstadoTrueAndProveedorIdProveedor(idProveedor);

        return productos.stream()
                .map(productoMapper::toCompraDto)
                .collect(Collectors.toList());
    }

    public void cambiarEstadoProducto(Long idProducto){
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException());

        producto.setEstado(!producto.getEstado());
        productoRepository.save(producto);
    }
}

