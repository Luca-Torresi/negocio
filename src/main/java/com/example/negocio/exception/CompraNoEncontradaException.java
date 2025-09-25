package com.example.negocio.exception;

public class CompraNoEncontradaException extends RuntimeException {
    public CompraNoEncontradaException() {
        super("Compra no encontrada");
    }
}
