package com.example.negocio.mapper;

import com.example.negocio.dto.venta.DetalleVentaDTO;
import com.example.negocio.dto.venta.DetalleVentaListaDTO;
import com.example.negocio.entity.DetalleVenta;
import com.example.negocio.entity.Producto;
import com.example.negocio.entity.Promocion;
import com.example.negocio.repository.ProductoRepository;
import com.example.negocio.repository.PromocionRepository;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface DetalleVentaMapper {

    @Mapping(source = "idProducto", target = "producto")
    @Mapping(source = "idPromocion", target = "promocion")
    DetalleVenta toEntity(DetalleVentaDTO dto,
                          @Context ProductoRepository productoRepository,
                          @Context PromocionRepository promocionRepository
    );

    @Mapping(source = "producto.nombre", target = "producto")
    @Mapping(source = "promocion.nombre", target = "promocion")
    DetalleVentaListaDTO toDto(DetalleVenta detalleVenta);

    default Producto mapProducto(Long idProducto, @Context ProductoRepository productoRepository) {
        return productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    default Promocion mapPromocion(Long idPromocion, @Context PromocionRepository promocionRepository) {
        return promocionRepository.findById(idPromocion)
                .orElseThrow(() -> new RuntimeException("Promocion no encontrada"));
    }
}
