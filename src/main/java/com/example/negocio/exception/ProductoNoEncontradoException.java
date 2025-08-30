package com.example.negocio.exception;

public class ProductoNoEncontradoException extends RuntimeException {
    public ProductoNoEncontradoException() {
        super("No se encontró el producto");
    }
}
