package com.example.negocio.mapper;

import com.example.negocio.dto.venta.DetalleVentaDTO;
import com.example.negocio.dto.venta.DetalleVentaListaDTO;
import com.example.negocio.entity.DetalleVenta;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DetalleVentaMapper {

    DetalleVenta toEntity(DetalleVentaDTO dto);

    @Mapping(source = "producto.nombre", target = "producto")
    @Mapping(source = "promocion.nombre", target = "promocion")
    DetalleVentaListaDTO toDto(DetalleVenta detalleVenta);

}
