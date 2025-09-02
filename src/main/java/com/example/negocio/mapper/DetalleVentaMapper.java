package com.example.negocio.mapper;

import com.example.negocio.dto.venta.DetalleVentaDTO;
import com.example.negocio.dto.venta.DetalleVentaListaDTO;
import com.example.negocio.entity.DetalleVenta;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DetalleVentaMapper {

    DetalleVenta toEntity(DetalleVentaDTO dto);

    @Mapping(source = "detalleVenta", target = "nombre")
    DetalleVentaListaDTO toDto(DetalleVenta detalleVenta);

    default String mapNombreFromDetalle(DetalleVenta detalleVenta) {
        if (detalleVenta.getProducto() != null) {
            return detalleVenta.getProducto().getNombre();
        }
        if (detalleVenta.getPromocion() != null) {
            return detalleVenta.getPromocion().getNombre();
        }
        return "Item no identificado"; // O null, o lo que prefieras como fallback
    }
}
