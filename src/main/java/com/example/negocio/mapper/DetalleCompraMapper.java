package com.example.negocio.mapper;

import com.example.negocio.dto.compra.DetalleCompraDTO;
import com.example.negocio.dto.compra.DetalleCompraFullDTO;
import com.example.negocio.entity.DetalleCompra;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DetalleCompraMapper {
    DetalleCompra toEntity(DetalleCompraDTO dto);

    @Mapping(source = "producto.nombre", target = "producto")
    DetalleCompraFullDTO toFullDto(DetalleCompra entity);
}
