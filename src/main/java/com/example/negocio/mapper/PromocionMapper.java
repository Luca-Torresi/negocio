package com.example.negocio.mapper;

import com.example.negocio.dto.promocion.PromocionAbmDTO;
import com.example.negocio.dto.promocion.PromocionDTO;
import com.example.negocio.dto.promocion.PromocionListaDTO;
import com.example.negocio.entity.Promocion;
import com.example.negocio.repository.ProductoRepository;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {DetallePromocionMapper.class})
public interface PromocionMapper {

    @Mapping(source = "detalles", target = "detalles")
    Promocion toEntity(PromocionDTO dto, @Context ProductoRepository productoRepository);

    void updateFromDto(PromocionDTO dto, @MappingTarget Promocion entity, @Context ProductoRepository productoRepository);

    PromocionAbmDTO toAbmDto(Promocion entity);

    PromocionListaDTO toListaDto(Promocion entity);

    @AfterMapping
    default void setPromocionInDetalles(@MappingTarget Promocion promocion) {
        if (promocion.getDetalles() != null) {
            promocion.getDetalles().forEach(det -> det.setPromocion(promocion));
        }
    }
}
