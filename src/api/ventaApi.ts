import axios from "axios"
import type { ItemCatalogo, VentaDTO, PaginaDeVentas, FiltrosVenta, VentaHistorial } from "../types/dto/Venta"

const API_BASE_URL = "http://localhost:8080"

// Obtener catálogo unificado para la terminal de venta
export const obtenerCatalogoVenta = async (): Promise<ItemCatalogo[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/venta/catalogo`)
    return response.data
  } catch (error) {
    console.error("Error al obtener catálogo de venta:", error)
    throw new Error("No se pudo cargar el catálogo de productos y promociones")
  }
}

// Obtener métodos de pago disponibles
export const obtenerMetodosDePago = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/venta/metodosDePago`)
    return response.data
  } catch (error) {
    console.error("Error al obtener métodos de pago:", error)
    throw new Error("No se pudieron cargar los métodos de pago")
  }
}

// Crear nueva venta
export const crearVenta = async (data: VentaDTO): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/venta/nueva`, data)
  } catch (error) {
    console.error("Error al crear venta:", error)
    throw new Error("No se pudo crear la venta")
  }
}

// Modificar venta existente
export const modificarVenta = async (id: number, data: VentaDTO): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/venta/modificar/${id}`, data)
  } catch (error) {
    console.error("Error al modificar venta:", error)
    throw new Error("No se pudo modificar la venta")
  }
}

// Obtener ventas con filtros y paginación
export const obtenerVentas = async (filtros: FiltrosVenta): Promise<PaginaDeVentas> => {
  try {
    const params = new URLSearchParams()

    if (filtros.fechaDesde) params.append("fechaDesde", filtros.fechaDesde)
    if (filtros.fechaHasta) params.append("fechaHasta", filtros.fechaHasta)
    if (filtros.metodoDePago) params.append("metodoDePago", filtros.metodoDePago)
    if (filtros.usuario) params.append("usuario", filtros.usuario)
    params.append("pagina", filtros.number.toString())
    params.append("tamanoPagina", filtros.size.toString())

    const response = await axios.get(`${API_BASE_URL}/venta/obtener?${params.toString()}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener ventas:", error)
    throw new Error("No se pudieron cargar las ventas")
  }
}

// Obtener venta por ID para edición
export const obtenerVentaPorId = async (id: number): Promise<VentaHistorial> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/venta/obtener/${id}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener venta por ID:", error)
    throw new Error("No se pudo cargar la venta")
  }
}
