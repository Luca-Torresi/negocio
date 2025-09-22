package com.example.negocio.mapper;

import com.example.negocio.dto.descuento.DescuentoDTO;
import com.example.negocio.entity.Descuento;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DescuentoMapper {
    Descuento toEntity(DescuentoDTO dto);

    void updateFromDto(DescuentoDTO dto, @MappingTarget Descuento entity);
}
