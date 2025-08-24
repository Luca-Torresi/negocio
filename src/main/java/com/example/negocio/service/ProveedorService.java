package com.example.negocio.service;

import com.example.negocio.dto.proveedor.ProveedorAbmDTO;
import com.example.negocio.dto.proveedor.ProveedorDTO;
import com.example.negocio.dto.proveedor.ProveedorListaDTO;
import com.example.negocio.entity.Proveedor;
import com.example.negocio.mapper.ProveedorMapper;
import com.example.negocio.repository.ProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProveedorService {
    private final ProveedorRepository proveedorRepository;
    private final ProveedorMapper proveedorMapper;

    public Proveedor nuevoProveedor(ProveedorDTO dto) {
        Proveedor proveedor = proveedorMapper.toEntity(dto);
        proveedor.setEstado(true);

        return proveedorRepository.save(proveedor);
    }

    public Proveedor modificarProveedor(Long idProveedor, ProveedorDTO dto) {
        Proveedor proveedor = proveedorRepository.findById(idProveedor)
                .orElseThrow(() -> new RuntimeException("No existe el proveedor"));

        proveedorMapper.updateFromDto(dto, proveedor);
        return proveedorRepository.save(proveedor);
    }

    public List<ProveedorAbmDTO> obtenerProveedores() {
        List<Proveedor> proveedores = proveedorRepository.findAll();

        return proveedores.stream()
                .map(proveedorMapper::toAbmDto)
                .collect(Collectors.toList());
    }

    public List<ProveedorListaDTO> listarProveedores() {
        List<Proveedor> proveedores = proveedorRepository.findByEstadoTrue();

        return proveedores.stream()
                .map(proveedorMapper::toListaDTO)
                .collect(Collectors.toList());
    }

    public void cambiarEstadoProveedor(Long idProveedor) {
        Proveedor proveedor = proveedorRepository.findById(idProveedor)
                .orElseThrow(() -> new RuntimeException("No existe el proveedor"));

        proveedor.setEstado(!proveedor.getEstado());
        proveedorRepository.save(proveedor);
    }
}
