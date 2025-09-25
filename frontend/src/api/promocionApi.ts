import apiClient from "./interceptors/apiClient"
import type { Promocion, PromocionDTO } from "../types/dto/Promocion"

// Obtener todas las promociones
export const obtenerPromociones = async (): Promise<Promocion[]> => {
  const response = await apiClient.get(`/promocion/abm`)
  return response.data
}

// Crear nueva promoción
export const crearPromocion = async (data: PromocionDTO): Promise<void> => {
  await apiClient.post(`/promocion/nueva`, data)
}

// Modificar promoción existente
export const modificarPromocion = async (id: number, data: PromocionDTO): Promise<void> => {
  await apiClient.put(`/promocion/modificar/${id}`, data)
}

// Cambiar estado de la promoción
export const cambiarEstadoPromocion = async (id: number): Promise<void> => {
  await apiClient.patch(`/promocion/cambiarEstado/${id}`)
}
