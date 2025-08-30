package com.example.negocio.mapper;

import com.example.negocio.dto.promocion.DetallePromocionAbmDTO;
import com.example.negocio.dto.promocion.DetallePromocionDTO;
import com.example.negocio.entity.DetallePromocion;
import com.example.negocio.entity.Producto;
import com.example.negocio.repository.ProductoRepository;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DetallePromocionMapper {

    DetallePromocion toEntity(DetallePromocionDTO dto);

    @Mapping(source = "producto.nombre", target = "producto")
    DetallePromocionAbmDTO toAbmDTO(DetallePromocion detallePromocion);

}
