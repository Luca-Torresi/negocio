package com.example.negocio.controller;

import com.example.negocio.dto.producto.*;
import com.example.negocio.dto.venta.CatalogoDTO;
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
            @RequestParam(required = false) Long idCategoria,
            @RequestParam(required = false) Long idMarca,
            @RequestParam(required = false) Long idProveedor,
            @RequestParam(required = false) Boolean bajoStock) {
        return productoService.obtenerProductos(page, size, nombre, idCategoria, idMarca, idProveedor, bajoStock);
    }

    @GetMapping("/listaCompra/{idProveedor}")
    public ResponseEntity<List<ProductoCompraDTO>> listarProductosCompra(@PathVariable Long idProveedor){
        return ResponseEntity.ok(productoService.listarProductosCompra(idProveedor));
    }

    @GetMapping("/listaVenta")
    public ResponseEntity<List<ProductoVentaDTO>> listarProductosVenta(){
        return ResponseEntity.ok(productoService.listarProductosVenta());
    }

    @PatchMapping("/cambiarEstado/{idProducto}")
    public ResponseEntity<Void> cambiarEstadoProducto(@PathVariable Long idProducto){
        productoService.cambiarEstadoProducto(idProducto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/buscarPorCodigo/{codigoDeBarras}")
    public ResponseEntity<CatalogoDTO> buscarPorCodigo(@PathVariable String codigoDeBarras){
        return ResponseEntity.ok(productoService.buscarPorCodigo(codigoDeBarras));
    }

}
