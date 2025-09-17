package com.example.negocio.service;

import com.example.negocio.dto.promocion.DetallePromocionDTO;
import com.example.negocio.dto.promocion.PromocionAbmDTO;
import com.example.negocio.dto.promocion.PromocionDTO;
import com.example.negocio.dto.promocion.PromocionListaDTO;
import com.example.negocio.entity.DetallePromocion;
import com.example.negocio.entity.Producto;
import com.example.negocio.entity.Promocion;
import com.example.negocio.exception.ProductoNoEncontradoException;
import com.example.negocio.exception.PromocionNoEncontradaException;
import com.example.negocio.mapper.DetallePromocionMapper;
import com.example.negocio.mapper.PromocionMapper;
import com.example.negocio.repository.ProductoRepository;
import com.example.negocio.repository.PromocionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromocionService {
    private final PromocionRepository promocionRepository;
    private final ProductoRepository productoRepository;
    private final PromocionMapper promocionMapper;
    private final DetallePromocionMapper detallePromocionMapper;

    public Promocion nuevaPromocion(PromocionDTO dto) {
        Promocion promocion = promocionMapper.toEntity(dto);
        promocion.setEstado(true);

        List<DetallePromocion> detalles = new ArrayList<>();
        for(DetallePromocionDTO detalleDto: dto.getDetalles()){
            Producto producto = productoRepository.findById(detalleDto.getIdProducto()).orElseThrow(() -> new ProductoNoEncontradoException());

            DetallePromocion detallePromocion = detallePromocionMapper.toEntity(detalleDto);
            detallePromocion.setProducto(producto);
            detallePromocion.setPromocion(promocion);

            detalles.add(detallePromocion);
        }
        promocion.setDetalles(detalles);

        return promocionRepository.save(promocion);
    }

    public Promocion modificarPromocion(Long idPromocion, PromocionDTO dto) {
        Promocion promocion = promocionRepository.findById(idPromocion).orElseThrow(() -> new PromocionNoEncontradaException());

        promocionMapper.updateFromDto(dto, promocion);
        promocion.getDetalles().clear();

        for(DetallePromocionDTO detalleDto: dto.getDetalles()){
            Producto producto = productoRepository.findById(detalleDto.getIdProducto()).orElseThrow(() -> new ProductoNoEncontradoException());

            DetallePromocion detallePromocion = detallePromocionMapper.toEntity(detalleDto);
            detallePromocion.setProducto(producto);
            detallePromocion.setPromocion(promocion);

            promocion.getDetalles().add(detallePromocion);
        }

        return promocionRepository.save(promocion);
    }

    public List<PromocionAbmDTO> obtenerPromociones(){
        List<Promocion> promociones = promocionRepository.findAll();

        return promociones.stream()
                .map(promocionMapper::toAbmDto)
                .collect(Collectors.toList());
    }

    public List<PromocionListaDTO> listarPromociones(){
        List<Promocion> promociones = promocionRepository.findByEstadoTrue();

        return promociones.stream()
                .map(promocionMapper::toListaDto)
                .collect(Collectors.toList());
    }

    public void cambiarEstadoPromocion(Long idPromocion){
        Promocion promocion = promocionRepository.findById(idPromocion).orElseThrow(() -> new PromocionNoEncontradaException());

        promocion.setEstado(!promocion.getEstado());
        promocionRepository.save(promocion);
    }
}
