package com.example.negocio.mapper;

import com.example.negocio.dto.producto.*;
import com.example.negocio.entity.Producto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import java.math.BigDecimal;

@Mapper(componentModel = "spring")
public interface ProductoMapper {
    Producto toEntity(ProductoDTO dto);
    ProductoVentaDTO toVentaDto(Producto entity);
    ProductoCompraDTO toCompraDto(Producto entity);

    void updateFromDto(ProductoDTO dto,@MappingTarget Producto entity);

    @Mapping(source = "marca.nombre", target = "marca")
    @Mapping(source = "categoria.nombre", target = "categoria")
    @Mapping(source = "proveedor.nombre", target = "proveedor")
    @Mapping(source = "descuento.porcentaje", target = "porcentaje")
    @Mapping(target = "precioConDescuento", expression = "java(mapPrecioAbm(entity))")
    @Mapping(source = "oferta.cantidadMinima", target = "cantidadMinima")
    @Mapping(source = "oferta.nuevoPrecio", target = "nuevoPrecio")
    @Mapping(source = "categoria.idCategoria", target = "idCategoria")
    @Mapping(source = "descuento.idDescuento", target = "idDescuento")
    @Mapping(source = "oferta.idOferta", target = "idOferta")
    ProductoAbmDTO toAbmDto(Producto entity);

    default BigDecimal mapPrecioAbm(Producto producto) {
        if (producto.getDescuento() == null) {
            return null;
        }

        BigDecimal precioOriginal = producto.getPrecio();
        BigDecimal porcentaje = new BigDecimal(producto.getDescuento().getPorcentaje());
        BigDecimal cien = new BigDecimal("100");
        BigDecimal factorDescuento = porcentaje.divide(cien);
        BigDecimal multiplicador = BigDecimal.ONE.subtract(factorDescuento);
        BigDecimal precioFinal = precioOriginal.multiply(multiplicador);

        return precioFinal;
    }
}


