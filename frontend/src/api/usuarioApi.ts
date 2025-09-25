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

export const crearUsuario = async (nombre: string): Promise<Usuario> => {
  try {
    const response = await apiClient.post<Usuario>("/usuario/nuevo", { nombre })
    return response.data
  } catch (error) {
    console.error("Error al crear el usuario:", error)
    throw new Error("No se pudo crear el usuario")
  }
}