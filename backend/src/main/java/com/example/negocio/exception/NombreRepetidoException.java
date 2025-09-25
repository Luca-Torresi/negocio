package com.example.negocio.exception;

public class NombreRepetidoException extends RuntimeException {
  public NombreRepetidoException(String nombre) {
    super("El nombre " + nombre + " ya está en uso");
  }
}
