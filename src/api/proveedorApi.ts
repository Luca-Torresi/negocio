import axios from "axios"
import type { Proveedor, ProveedorDTO } from "../types/dto/Proveedor"

const API_BASE_URL = "http://localhost:8080"

// Obtener todos los proveedores
export const obtenerProveedores = async (): Promise<Proveedor[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/proveedor/abm`)
    return response.data
  } catch (error) {
    console.error("Error al obtener proveedores:", error)
    throw new Error("No se pudieron cargar los proveedores")
  }
}

// Crear un nuevo proveedor
export const crearProveedor = async (data: ProveedorDTO): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/proveedor/nuevo`, data)
    return response.data
  } catch (error) {
    console.error("Error al crear proveedor:", error)
    throw new Error("No se pudo crear el proveedor")
  }
}

// Modificar un proveedor existente
export const modificarProveedor = async (id: number, data: ProveedorDTO): Promise<any> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/proveedor/modificar/${id}`, data)
    return response.data
  } catch (error) {
    console.error("Error al modificar proveedor:", error)
    throw new Error("No se pudo modificar el proveedor")
  }
}

// Cambiar estado de un proveedor (activar/desactivar)
export const cambiarEstadoProveedor = async (id: number): Promise<any> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/proveedor/cambiarEstado/${id}`)
    return response.data
  } catch (error) {
    console.error("Error al cambiar estado del proveedor:", error)
    throw new Error("No se pudo cambiar el estado del proveedor")
  }
}

// Obtener lista de proveedores para filtros
export const obtenerListaProveedores = async (): Promise<{ idProveedor: number; nombre: string }[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/proveedor/lista`)
    return response.data
  } catch (error) {
    console.error("Error al obtener lista de proveedores:", error)
    throw new Error("No se pudieron cargar los proveedores")
  }
}