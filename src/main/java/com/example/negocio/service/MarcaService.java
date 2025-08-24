package com.example.negocio.service;

import com.example.negocio.dto.marca.MarcaAbmDTO;
import com.example.negocio.dto.marca.MarcaDTO;
import com.example.negocio.dto.marca.MarcaListaDTO;
import com.example.negocio.entity.Marca;
import com.example.negocio.mapper.MarcaMapper;
import com.example.negocio.repository.MarcaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarcaService {
    private final MarcaRepository marcaRepository;
    private final MarcaMapper marcaMapper;

    public Marca nuevaMarca(MarcaDTO dto){
        Marca marca = marcaMapper.toEntity(dto);
        marca.setEstado(true);

        return marcaRepository.save(marca);
    }

    public Marca modificarMarca(Long idMarca, MarcaDTO dto){
        Marca marca = marcaRepository.findById(idMarca)
                .orElseThrow(() -> new RuntimeException("Marca no encontrada"));

        marcaMapper.updateFromDto(dto, marca);
        return marcaRepository.save(marca);
    }

    public List<MarcaAbmDTO> obtenerMarcas(){
        List<Marca> marcas = marcaRepository.findAll();

        return marcas.stream()
                .map(marcaMapper::toAbmDto)
                .collect(Collectors.toList());
    }

    public List<MarcaListaDTO> listarMarcas(){
        List<Marca> marcas = marcaRepository.findByEstadoTrue();

        return marcas.stream()
                .map(marcaMapper::toListaDto)
                .collect(Collectors.toList());
    }

    public void cambiarEstadoMarca(Long idMarca){
        Marca marca = marcaRepository.findById(idMarca)
                .orElseThrow(() -> new RuntimeException("Marca no encontrada"));

        marca.setEstado(!marca.getEstado());
        marcaRepository.save(marca);
    }
}
