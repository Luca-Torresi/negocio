package com.example.negocio.mapper;

import com.example.negocio.dto.venta.CatalogoDTO;
import com.example.negocio.dto.venta.VentaDTO;
import com.example.negocio.dto.venta.VentaListaDTO;
import com.example.negocio.entity.Producto;
import com.example.negocio.entity.Promocion;
import com.example.negocio.entity.Venta;
import org.mapstruct.*;
import java.math.BigDecimal;

@Mapper(componentModel = "spring", uses = {DetalleVentaMapper.class})
public interface VentaMapper {

    Venta toEntity(VentaDTO dto);

    @Mapping(source = "usuario.nombre", target = "usuario")
    @Mapping(source = "detalles", target = "detalles")
    VentaListaDTO toDto(Venta entity);

    @Mapping(target = "tipo", expression = "java(\"PRODUCTO\")")
    @Mapping(source = "idProducto", target = "id")
    @Mapping(target = "precioFinal", expression = "java(calcularPrecioFinalProducto(producto))")
    @Mapping(source = "oferta", target = "oferta")
    CatalogoDTO productoToCalalogoDto(Producto producto);

    @Mapping(target = "tipo", expression = "java(\"PROMOCION\")")
    @Mapping(source = "idPromocion", target = "id")
    @Mapping(source = "precio", target = "precioFinal")
    @Mapping(target = "oferta", ignore = true)
    CatalogoDTO promocionToCatalogoDto(Promocion promocion);

    default BigDecimal calcularPrecioFinalProducto(Producto producto) {
        if (producto.getDescuento() != null) {
            BigDecimal precioOriginal = producto.getPrecio();
            BigDecimal porcentaje = new BigDecimal(producto.getDescuento().getPorcentaje());
            BigDecimal cien = new BigDecimal("100");
            BigDecimal multiplicador = BigDecimal.ONE.subtract(porcentaje.divide(cien));
            return precioOriginal.multiply(multiplicador);
        }

        return producto.getPrecio();
    }
}
