package com.example.negocio.mapper;

import com.example.negocio.dto.oferta.OfertaDTO;
import com.example.negocio.entity.Oferta;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface OfertaMapper {

    Oferta toEntity(OfertaDTO dto);

    void updateFromDto(OfertaDTO dto, @MappingTarget Oferta entity);
}
