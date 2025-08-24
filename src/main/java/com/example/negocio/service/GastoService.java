package com.example.negocio.service;

import com.example.negocio.dto.gasto.GastoDTO;
import com.example.negocio.dto.gasto.GastoListaDTO;
import com.example.negocio.entity.Gasto;
import com.example.negocio.enums.TipoGasto;
import com.example.negocio.mapper.GastoMapper;
import com.example.negocio.repository.GastoRepository;
import com.example.negocio.specification.GastoSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GastoService {
    private final GastoRepository gastoRepository;
    private final GastoMapper gastoMapper;

    public Gasto nuevoGasto(GastoDTO dto){
        Gasto gasto = gastoMapper.toEntity(dto);
        gasto.setFechaHora(LocalDateTime.now());

        return gastoRepository.save(gasto);
    }

    public Gasto modificarGasto(Long idGasto, GastoDTO dto){
        Gasto gasto = gastoRepository.findById(idGasto)
                .orElseThrow(() -> new RuntimeException("Gasto no encontrado"));

        gastoMapper.updateFromDto(dto, gasto);
        return gastoRepository.save(gasto);
    }

    public Page<GastoListaDTO> listarGastos(Integer page, Integer size, TipoGasto tipoGasto, LocalDate fechaInicio, LocalDate fechaFin) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Gasto> spec = GastoSpecification.conTipoGasto(tipoGasto)
                .and(GastoSpecification.porFechaInicio(fechaInicio))
                .and(GastoSpecification.porFechaFin(fechaFin));

        return gastoRepository.findAll(spec, pageable)
                .map(gastoMapper::toDto);
    }
}
