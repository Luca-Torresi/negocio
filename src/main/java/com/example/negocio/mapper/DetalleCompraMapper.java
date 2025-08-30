package com.example.negocio.mapper;

import com.example.negocio.dto.compra.DetalleCompraDTO;
import com.example.negocio.dto.compra.DetalleCompraFullDTO;
import com.example.negocio.entity.DetalleCompra;
import com.example.negocio.entity.Producto;
import com.example.negocio.repository.ProductoRepository;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DetalleCompraMapper {

    DetalleCompra toEntity(DetalleCompraDTO dto);

    @Mapping(source = "producto.nombre", target = "producto")
    DetalleCompraFullDTO toFullDto(DetalleCompra entity);

}
