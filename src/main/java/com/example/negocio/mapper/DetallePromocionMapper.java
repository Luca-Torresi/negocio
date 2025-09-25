package com.example.negocio.mapper;

import com.example.negocio.dto.promocion.DetallePromocionAbmDTO;
import com.example.negocio.dto.promocion.DetallePromocionDTO;
import com.example.negocio.entity.DetallePromocion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DetallePromocionMapper {
    DetallePromocion toEntity(DetallePromocionDTO dto);

    @Mapping(source = "producto.idProducto", target = "idProducto")
    DetallePromocionAbmDTO toAbmDTO(DetallePromocion detallePromocion);
}
