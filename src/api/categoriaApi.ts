import axios from "axios"
import type { Categoria, CrearCategoriaDTO, ModificarCategoriaDTO } from "../types/dto/Categoria"

// Configuración base de axios (ajustar según tu configuración)
const api = axios.create({
  baseURL: "http://localhost:8080", 
  headers: {
    "Content-Type": "application/json",
  },
})

// Obtener todas las categorías
export const obtenerCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await api.get<Categoria[]>("/categoria/abm")
    return response.data
  } catch (error) {
    console.error("Error al obtener categorías:", error)
    throw new Error("No se pudieron cargar las categorías")
  }
}

// Crear nueva categoría
export const crearCategoria = async (data: CrearCategoriaDTO): Promise<any> => {
  try {
    const response = await api.post("/categoria/nueva", data)
    return response.data
  } catch (error) {
    console.error("Error al crear categoría:", error)
    throw new Error("No se pudo crear la categoría")
  }
}

// Modificar categoría existente
export const modificarCategoria = async (id: number, data: ModificarCategoriaDTO): Promise<any> => {
  try {
    const response = await api.put(`/categoria/modificar/${id}`, data)
    return response.data
  } catch (error) {
    console.error("Error al modificar categoría:", error)
    throw new Error("No se pudo modificar la categoría")
  }
}

// Cambiar estado de categoría (activar/desactivar)
export const cambiarEstadoCategoria = async (id: number): Promise<any> => {
  try {
    const response = await api.patch(`/categoria/cambiarEstado/${id}`)
    return response.data
  } catch (error) {
    console.error("Error al cambiar estado de categoría:", error)
    throw new Error("No se pudo cambiar el estado de la categoría")
  }
}

// Obtener lista de categorías para filtros
export const obtenerListaCategorias = async (): Promise<{ idCategoria: number; nombre: string }[]> => {
  try {
    const response = await api.get("/categoria/lista")
    return response.data
  } catch (error) {
    console.error("Error al obtener lista de categorías:", error)
    throw new Error("No se pudieron cargar las categorías")
  }
}