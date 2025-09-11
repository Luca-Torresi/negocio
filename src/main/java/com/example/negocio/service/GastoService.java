package com.example.negocio.service;

import com.example.negocio.dto.gasto.GastoDTO;
import com.example.negocio.dto.gasto.GastoListaDTO;
import com.example.negocio.entity.Gasto;
import com.example.negocio.entity.Usuario;
import com.example.negocio.enums.TipoGasto;
import com.example.negocio.exception.GastoNoEncontradoException;
import com.example.negocio.exception.UsuarioNoEncontradoException;
import com.example.negocio.mapper.GastoMapper;
import com.example.negocio.repository.GastoRepository;
import com.example.negocio.repository.UsuarioRepository;
import com.example.negocio.specification.GastoSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GastoService {
    private final GastoRepository gastoRepository;
    private final GastoMapper gastoMapper;
    private final UsuarioRepository usuarioRepository;

    public Gasto nuevoGasto(Long idUsuario, GastoDTO dto){
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new UsuarioNoEncontradoException());

        Gasto gasto = gastoMapper.toEntity(dto);
        gasto.setFechaHora(LocalDateTime.now());
        gasto.setUsuario(usuario);

        return gastoRepository.save(gasto);
    }

    public Gasto modificarGasto(Long idGasto, GastoDTO dto){
        Gasto gasto = gastoRepository.findById(idGasto).orElseThrow(() -> new GastoNoEncontradoException());

        gastoMapper.updateFromDto(dto, gasto);
        return gastoRepository.save(gasto);
    }

    public Page<GastoListaDTO> listarGastos(Integer page, Integer size, TipoGasto tipoGasto, LocalDate fechaInicio, LocalDate fechaFin, Long idUsuario) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("fechaHora").descending());
        Specification<Gasto> spec = GastoSpecification.conTipoGasto(tipoGasto)
                .and(GastoSpecification.porFechaInicio(fechaInicio))
                .and(GastoSpecification.porFechaFin(fechaFin))
                .and(GastoSpecification.conUsuario(idUsuario));

        return gastoRepository.findAll(spec, pageable)
                .map(gastoMapper::toDto);
    }

    public List<String> listarTipoGastos(){
        return Arrays.stream(TipoGasto.values())
                .map(Enum::name)
                .toList();
    }
}
