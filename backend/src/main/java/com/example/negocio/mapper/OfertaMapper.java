package com.example.negocio.mapper;

import com.example.negocio.dto.oferta.NuevaOfertaDTO;
import com.example.negocio.dto.oferta.OfertaDTO;
import com.example.negocio.entity.Oferta;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface OfertaMapper {
    Oferta toEntity(NuevaOfertaDTO dto);
    OfertaDTO toDto(Oferta oferta);

    void updateFromDto(NuevaOfertaDTO dto, @MappingTarget Oferta entity);
}
