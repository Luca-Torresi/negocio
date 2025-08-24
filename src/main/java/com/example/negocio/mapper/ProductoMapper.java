package com.example.negocio.mapper;

import com.example.negocio.dto.producto.ProductoDTO;
import com.example.negocio.dto.producto.ProductoAbmDTO;
import com.example.negocio.dto.producto.ProductoItemDTO;
import com.example.negocio.dto.producto.ProductoListaDTO;
import com.example.negocio.entity.Categoria;
import com.example.negocio.entity.Marca;
import com.example.negocio.entity.Producto;
import com.example.negocio.entity.Proveedor;
import com.example.negocio.repository.CategoriaRepository;
import com.example.negocio.repository.MarcaRepository;
import com.example.negocio.repository.ProveedorRepository;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductoMapper {

    @Mapping(source = "idMarca", target = "marca")
    @Mapping(source = "idCategoria", target = "categoria")
    @Mapping(source = "idProveedor", target = "proveedor")
    Producto toEntity(
            ProductoDTO dto,
            @Context MarcaRepository marcaRepository,
            @Context CategoriaRepository categoriaRepository,
            @Context ProveedorRepository proveedorRepository
    );

    @Mapping(source = "idMarca", target = "marca")
    @Mapping(source = "idCategoria", target = "categoria")
    @Mapping(source = "idProveedor", target = "proveedor")
    void updateFromDto(
            ProductoDTO dto,
            @MappingTarget Producto entity,
            @Context MarcaRepository marcaRepository,
            @Context CategoriaRepository categoriaRepository,
            @Context ProveedorRepository proveedorRepository
    );

    @Mapping(source = "categoria.color", target = "color")
    @Mapping(source = "marca.nombre", target = "marca")
    @Mapping(source = "categoria.nombre", target = "categoria")
    @Mapping(source = "proveedor.nombre", target = "proveedor")
    @Mapping(target = "precioConDescuento", expression = "java(mapPrecioConDescuentoAbm(entity))")
    ProductoAbmDTO toAbmDto(Producto entity);

    @Mapping(source = "categoria.color", target = "color")
    @Mapping(target = "precio", expression = "java(mapPrecioConDescuentoLista(entity))")
    ProductoListaDTO toListaDto(Producto entity);

    ProductoItemDTO toItemDto(Producto entity);

    default Marca mapMarca(Long idMarca, @Context MarcaRepository marcaRepository) {
        return marcaRepository.findById(idMarca)
                .orElseThrow(() -> new RuntimeException("Marca no encontrada"));
    }

    default Categoria mapCategoria(Long idCategoria, @Context CategoriaRepository categoriaRepository) {
        return categoriaRepository.findById(idCategoria)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    }

    default Proveedor mapProveedor(Long idProveedor, @Context ProveedorRepository proveedorRepository) {
        return proveedorRepository.findById(idProveedor)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
    }

    default Double mapPrecioConDescuentoAbm(Producto producto) {
        if (producto.getDescuento() != null) {
            Double porcentaje = producto.getDescuento().getPorcentaje();
            return producto.getPrecio() * (1 - porcentaje / 100);
        }
        return null;
    }

    default Double mapPrecioConDescuentoLista(Producto producto) {
        if (producto.getDescuento() != null) {
            Double porcentaje = producto.getDescuento().getPorcentaje();
            return producto.getPrecio() * (1 - porcentaje / 100);
        }
        return producto.getPrecio();
    }
}


