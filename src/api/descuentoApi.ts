import apiClient from "./interceptors/apiClient"
import type { DescuentoDTO } from "../types/dto/Descuento"

export const crearDescuento = async (data: DescuentoDTO): Promise<any> => {
  await apiClient.post(`/descuento/nuevo`, data)
}

export const modificarDescuento = async (id: number, data: DescuentoDTO): Promise<any> => {
  const response = await apiClient.put(`/descuento/modificar/${id}`, data)
  return response.data
}

// Eliminar descuento
export const eliminarDescuento = async (idDescuento: number): Promise<void> => {
  await apiClient.delete(`/descuento/eliminar/${idDescuento}`)
}
