import apiClient from "./interceptors/apiClient"
import type { OfertaDTO } from "../types/dto/Oferta"

export const crearOferta = async (data: OfertaDTO): Promise<any> => {
  const response = await apiClient.post(`/oferta/nueva`, data)
  return response.data
}

export const modificarOferta = async (id: number, data: OfertaDTO): Promise<any> => {
  const response = await apiClient.put(`/oferta/modificar/${id}`, data)
  return response.data
}

export const eliminarOferta = async (id: number): Promise<any> => {
  const response = await apiClient.delete(`/oferta/eliminar/${id}`)
  return response.data
}
