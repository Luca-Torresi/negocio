package com.example.negocio.mapper;

import com.example.negocio.dto.usuario.NuevoUsuarioDTO;
import com.example.negocio.dto.usuario.UsuarioDTO;
import com.example.negocio.entity.Usuario;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    Usuario toEntity(NuevoUsuarioDTO dto);

    UsuarioDTO toDto(Usuario usuario);
}
