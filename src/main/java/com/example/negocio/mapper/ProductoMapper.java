package com.example.negocio.mapper;

import com.example.negocio.dto.producto.*;
import com.example.negocio.entity.Producto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductoMapper {

    Producto toEntity(ProductoDTO dto);

    void updateFromDto(
            ProductoDTO dto,
            @MappingTarget Producto entity
    );

    @Mapping(source = "categoria.color", target = "color")
    @Mapping(source = "marca.nombre", target = "marca")
    @Mapping(source = "categoria.nombre", target = "categoria")
    @Mapping(source = "proveedor.nombre", target = "proveedor")
    @Mapping(source = "descuento.porcentaje", target = "porcentaje")
    @Mapping(target = "precioConDescuento", expression = "java(mapPrecioConDescuento(entity))")
    ProductoAbmDTO toAbmDto(Producto entity);

    @Mapping(source = "categoria.color", target = "color")
    @Mapping(target = "precioFinal", expression = "java(mapPrecioFinal(entity))")
    ProductoVentaDTO toVentaDto(Producto entity);

    ProductoCompraDTO toCompraDto(Producto entity);

    ProductoItemDTO toItemDto(Producto entity);

    default Double mapPrecioConDescuento(Producto producto) {
        if (producto.getDescuento() != null) {
            Double porcentaje = producto.getDescuento().getPorcentaje();
            return producto.getPrecio() * (1 - porcentaje / 100);
        }
        return null;
    }

    default Double mapPrecioFinal(Producto producto) {
        if (producto.getDescuento() != null) {
            Double porcentaje = producto.getDescuento().getPorcentaje();
            return producto.getPrecio() * (1 - porcentaje / 100);
        }
        return producto.getPrecio();
    }
}


