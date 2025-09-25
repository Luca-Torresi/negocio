package com.example.negocio.exception;

public class CodigoDeBarrasEnUsoException extends RuntimeException {
    public CodigoDeBarrasEnUsoException(String producto) {
        super("El código de barras ingresado ya está en uso por el producto: " + producto);
    }
}
