package com.example.negocio.mapper;

import com.example.negocio.dto.venta.VentaDTO;
import com.example.negocio.dto.venta.VentaListaDTO;
import com.example.negocio.entity.Venta;
import com.example.negocio.repository.ProductoRepository;
import com.example.negocio.repository.PromocionRepository;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {DetalleVentaMapper.class})
public interface VentaMapper {

    @Mapping(source = "detalles", target = "detalles")
    Venta toEntity(VentaDTO dto,
                   @Context ProductoRepository productoRepository,
                   @Context PromocionRepository promocionRepository
    );

    @Mapping(source = "usuario.nombre", target = "usuario")
    VentaListaDTO toDto(Venta entity);

    @AfterMapping
    default void setVentaEnDetalles(@MappingTarget Venta venta) {
        if (venta.getDetalles() != null) {
            venta.getDetalles().forEach(detalle -> detalle.setVenta(venta));
        }
    }

}
