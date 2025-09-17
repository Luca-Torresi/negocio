import apiClient from "./interceptors/apiClient"
import type { PaginaDeCompras, CompraDTO } from "../types/dto/Compra"

// Obtener compras con filtros y paginación
export const obtenerCompras = async (filtros: any): Promise<PaginaDeCompras> => {
  const params = new URLSearchParams()

  if (filtros.pagina !== undefined) params.append("page", filtros.pagina.toString())
  if (filtros.tamaño !== undefined) params.append("size", filtros.tamaño.toString())
  if (filtros.idProveedor) params.append("idProveedor", filtros.idProveedor.toString())
  if (filtros.fechaInicio) params.append("fechaInicio", filtros.fechaInicio)
  if (filtros.fechaFin) params.append("fechaFin", filtros.fechaFin)
  if (filtros.idUsuario) params.append("idUsuario", filtros.idUsuario.toString())

  const response = await apiClient.get(`/compra/obtener?${params}`)
  return response.data
}

// Crear nueva compra
export const crearCompra = async (data: CompraDTO): Promise<void> => {
  await apiClient.post(`/compra/nueva`, data)
}
