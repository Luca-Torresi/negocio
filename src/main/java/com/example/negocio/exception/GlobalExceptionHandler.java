package com.example.negocio.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        e.printStackTrace();
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error inesperado");
    }

    @ExceptionHandler(CategoriaNoEncontradaException.class)
    public ResponseEntity<String> handleCategoriaNoEncontradaException(CategoriaNoEncontradaException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(ProductoNoEncontradoException.class)
    public ResponseEntity<String> handleProductoNoEncontradoException(ProductoNoEncontradoException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(ProveedorNoEncontradoException.class)
    public ResponseEntity<String> handleProveedorNoEncontradoException(ProveedorNoEncontradoException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(CompraNoEncontradaException.class)
    public ResponseEntity<String> handleCompraNoEncontradaException(CompraNoEncontradaException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(DescuentoNoEncontradoException.class)
    public ResponseEntity<String> handleDescuentoNoEncontradaException(DescuentoNoEncontradoException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(GastoNoEncontradoException.class)
    public ResponseEntity<String> handleGastoNoEncontradaException(GastoNoEncontradoException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(MarcaNoEncontradaException.class)
    public ResponseEntity<String> handleMarcaNoEncontradaException(MarcaNoEncontradaException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(PromocionNoEncontradaException.class)
    public ResponseEntity<String> handlePromocionNoEncontradaException(PromocionNoEncontradaException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(OfertaNoEncontradaException.class)
    public ResponseEntity<String> handleOfertaNoEncontradaException(OfertaNoEncontradaException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(UsuarioNoEncontradoException.class)
    public ResponseEntity<String> handleUsuarioNoEncontradaException(UsuarioNoEncontradoException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(StockInsuficienteException.class)
    public ResponseEntity<String> handleStockInsuficienteException(StockInsuficienteException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }

    @ExceptionHandler(NombreRepetidoException.class)
    public ResponseEntity<String> handleNombreRepetidoException(NombreRepetidoException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }

    @ExceptionHandler(CodigoDeBarrasEnUsoException.class)
    public ResponseEntity<String> handleCodigoDeBarrasEnUsoException(CodigoDeBarrasEnUsoException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }

    @ExceptionHandler(ValorNuloException.class)
    public ResponseEntity<String> handleValorNuloException(ValorNuloException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }
}
