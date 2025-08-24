package com.example.negocio.service;

import com.example.negocio.dto.descuento.DescuentoAbmDTO;
import com.example.negocio.dto.descuento.DescuentoDTO;
import com.example.negocio.entity.Descuento;
import com.example.negocio.mapper.DescuentoMapper;
import com.example.negocio.repository.DescuentoRepository;
import com.example.negocio.repository.ProductoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DescuentoService {
    private final DescuentoRepository descuentoRepository;
    private final ProductoRepository productoRepository;
    private final DescuentoMapper descuentoMapper;

    public Descuento nuevoDescuento(DescuentoDTO dto) {
        Descuento descuento = descuentoMapper.toEntity(dto, productoRepository);
        return descuentoRepository.save(descuento);
    }

    public Descuento modificarDescuento(Long idDescuento, DescuentoDTO dto) {
        Descuento descuento = descuentoRepository.findById(idDescuento)
                .orElseThrow(() -> new RuntimeException("Descuento no encontrado"));

        descuentoMapper.updateFromDto(dto, descuento, productoRepository);
        return descuentoRepository.save(descuento);
    }

    public List<DescuentoAbmDTO> obtenerDescuentos() {
        List<Descuento> descuentos = descuentoRepository.findAll();

        return descuentos.stream()
                .map(descuentoMapper::toAbmDto)
                .collect(Collectors.toList());
    }

    public void eliminarDescuento(Long idDescuento) {
        if (!descuentoRepository.existsById(idDescuento)) {
            throw new EntityNotFoundException("El descuento no existe");
        }
        descuentoRepository.deleteById(idDescuento);
    }
}
