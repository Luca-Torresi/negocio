package com.example.negocio.mapper;

import com.example.negocio.dto.promocion.PromocionAbmDTO;
import com.example.negocio.dto.promocion.PromocionDTO;
import com.example.negocio.dto.promocion.PromocionListaDTO;
import com.example.negocio.entity.Promocion;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {DetallePromocionMapper.class})
public interface PromocionMapper {
    Promocion toEntity(PromocionDTO dto);
    PromocionAbmDTO toAbmDto(Promocion entity);
    PromocionListaDTO toListaDto(Promocion entity);

    void updateFromDto(PromocionDTO dto, @MappingTarget Promocion entity);
}
