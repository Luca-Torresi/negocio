import apiClient from "./interceptors/apiClient";
import type { Usuario } from "../types/dto/Usuario";

// Obtener la lista de todos los usuarios para la pantalla de selección
export const obtenerUsuarios = async (): Promise<Usuario[]> => {
  try {
    const response = await apiClient.get<Usuario[]>('/usuario/lista'); 
    return response.data;
  } catch (error) {
    console.error("Error al obtener la lista de usuarios:", error);
    throw new Error("No se pudo cargar la lista de usuarios");
  }
};