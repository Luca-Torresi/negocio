package com.example.negocio.exception;

public class GastoNoEncontradoException extends RuntimeException {
    public GastoNoEncontradoException() {
        super("Gasto no encontrado");
    }
}
