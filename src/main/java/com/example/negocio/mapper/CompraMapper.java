package com.example.negocio.mapper;

import com.example.negocio.dto.compra.CompraDTO;
import com.example.negocio.dto.compra.CompraFullDTO;
import com.example.negocio.entity.Compra;
import com.example.negocio.entity.Proveedor;
import com.example.negocio.repository.ProductoRepository;
import com.example.negocio.repository.ProveedorRepository;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {DetalleCompraMapper.class})
public interface CompraMapper {

    @Mapping(source = "idProveedor", target = "proveedor")
    @Mapping(source = "detalles", target = "detalles")
    Compra toEntity(CompraDTO dto,
                    @Context ProveedorRepository proveedorRepository,
                    @Context ProductoRepository productoRepository
    );

    @Mapping(source = "proveedor.nombre", target = "proveedor")
    @Mapping(source = "usuario.nombre", target = "usuario")
    CompraFullDTO toFullDto(Compra entity);

    default Proveedor mapProveedor(Long idProveedor, @Context ProveedorRepository proveedorRepository) {
        return proveedorRepository.findById(idProveedor)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
    }

    @AfterMapping
    default void setCompraEnDetalles(@MappingTarget Compra compra) {
        if (compra.getDetalles() != null) {
            compra.getDetalles().forEach(detalle -> detalle.setCompra(compra));
        }
    }
}