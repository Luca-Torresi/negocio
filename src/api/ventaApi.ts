import apiClient from "./interceptors/apiClient"
import type { ItemCatalogo, VentaDTO, PaginaDeVentas, FiltrosVenta, VentaHistorial } from "../types/dto/Venta"

// Obtener catálogo unificado para la terminal de venta
export const obtenerCatalogoVenta = async (): Promise<ItemCatalogo[]> => {
  const response = await apiClient.get(`/venta/catalogo`)
  return response.data
}

// Obtener métodos de pago disponibles
export const obtenerMetodosDePago = async (): Promise<string[]> => {
  const response = await apiClient.get(`/venta/metodosDePago`)
  return response.data
}

// Crear nueva venta
export const crearVenta = async (data: VentaDTO): Promise<void> => {
  await apiClient.post(`/venta/nueva`, data)
}

// Modificar venta existente
export const modificarVenta = async (id: number, data: VentaDTO): Promise<void> => {
  await apiClient.put(`/venta/modificar/${id}`, data)
}

// Obtener ventas con filtros y paginación
export const obtenerVentas = async (filtros: FiltrosVenta): Promise<PaginaDeVentas> => {
  const params = new URLSearchParams()

  if (filtros.fechaDesde) params.append("fechaDesde", filtros.fechaDesde)
  if (filtros.fechaHasta) params.append("fechaHasta", filtros.fechaHasta)
  if (filtros.metodoDePago) params.append("metodoDePago", filtros.metodoDePago)
  if (filtros.usuario) params.append("usuario", filtros.usuario)
  params.append("pagina", filtros.number.toString())
  params.append("tamanoPagina", filtros.size.toString())

  const response = await apiClient.get(`/venta/obtener?${params.toString()}`)
  return response.data
}

// Obtener venta por ID para edición
export const obtenerVentaPorId = async (id: number): Promise<VentaHistorial> => {
  const response = await apiClient.get(`/venta/obtener/${id}`)
  return response.data
}
