package com.example.negocio.controller;

import com.example.negocio.dto.producto.ProductoDTO;
import com.example.negocio.dto.producto.ProductoAbmDTO;
import com.example.negocio.dto.producto.ProductoItemDTO;
import com.example.negocio.dto.producto.ProductoListaDTO;
import com.example.negocio.entity.Producto;
import com.example.negocio.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/producto")
public class ProductoController {
    private final ProductoService productoService;

    @PostMapping("/nuevo")
    public ResponseEntity<Producto> nuevoProducto(@RequestBody ProductoDTO dto) {
        return ResponseEntity.ok(productoService.nuevoProducto(dto));
    }

    @PutMapping("/modificar/{idProducto}")
    public ResponseEntity<Producto> modificarProducto(@PathVariable Long idProducto, @RequestBody ProductoDTO dto) {
        return ResponseEntity.ok(productoService.modificarProducto(idProducto, dto));
    }

    @GetMapping("/abm")
    public Page<ProductoAbmDTO> obtenerProductos(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Long idCategoria) {
        return productoService.obtenerProductos(page, size, nombre, idCategoria);
    }

    @GetMapping("/listaVenta")
    public ResponseEntity<List<ProductoListaDTO>> listarProductosVenta(){
        return ResponseEntity.ok(productoService.listarProductosVenta());
    }

    @GetMapping("/listaCompra/{idProveedor}")
    public ResponseEntity<List<ProductoItemDTO>> listarProductosCompra(@PathVariable Long idProveedor){
        return ResponseEntity.ok(productoService.listarProductosCompra(idProveedor));
    }

    @PatchMapping("/cambiarEstado/{idProducto}")
    public ResponseEntity<Void> cambiarEstadoProducto(@PathVariable Long idProducto){
        productoService.cambiarEstadoProducto(idProducto);
        return ResponseEntity.ok().build();
    }

}
