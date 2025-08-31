import axios from "axios"
import type { Promocion, PromocionDTO } from "../types/dto/Promocion"

const API_BASE_URL = "http://localhost:8080"

// Obtener todas las promociones
export const obtenerPromociones = async (): Promise<Promocion[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/promocion/abm`)
    return response.data
  } catch (error) {
    console.error("Error al obtener promociones:", error)
    throw new Error("No se pudieron cargar las promociones")
  }
}

// Crear nueva promoción
export const crearPromocion = async (data: PromocionDTO): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/promocion/nueva`, data)
  } catch (error) {
    console.error("Error al crear promoción:", error)
    throw new Error("No se pudo crear la promoción")
  }
}

// Modificar promoción existente
export const modificarPromocion = async (id: number, data: PromocionDTO): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/promocion/modificar/${id}`, data)
  } catch (error) {
    console.error("Error al modificar promoción:", error)
    throw new Error("No se pudo modificar la promoción")
  }
}

// Cambiar estado de la promoción
export const cambiarEstadoPromocion = async (id: number): Promise<void> => {
  try {
    await axios.patch(`${API_BASE_URL}/promocion/cambiarEstado/${id}`)
  } catch (error) {
    console.error("Error al cambiar estado de la promoción:", error)
    throw new Error("No se pudo cambiar el estado de la promoción")
  }
}
