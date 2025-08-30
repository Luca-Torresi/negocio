import axios from "axios"
import type { PaginaDeCompras, CompraDTO } from "../types/dto/Compra"

const API_BASE_URL = "http://localhost:8080"

// Obtener compras con filtros y paginación
export const obtenerCompras = async (filtros: any): Promise<PaginaDeCompras> => {
  try {
    const params = new URLSearchParams()

    if (filtros.pagina !== undefined) params.append("page", filtros.pagina.toString())
    if (filtros.tamaño !== undefined) params.append("size", filtros.tamaño.toString())
    if (filtros.idProveedor) params.append("idProveedor", filtros.idProveedor.toString())
    if (filtros.fechaInicio) params.append("fechaInicio", filtros.fechaInicio)
    if (filtros.fechaFin) params.append("fechaFin", filtros.fechaFin)

    const response = await axios.get(`${API_BASE_URL}/compra/obtener?${params}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener compras:", error)
    throw error
  }
}

// Crear nueva compra
export const crearCompra = async (data: CompraDTO): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/compra/nueva`, data)
  } catch (error) {
    console.error("Error al crear compra:", error)
    throw error
  }
}

// Modificar compra existente
export const modificarCompra = async (id: number, data: CompraDTO): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/compra/modificar/${id}`, data)
  } catch (error) {
    console.error("Error al modificar compra:", error)
    throw error
  }
}

// Obtener compra por ID
export const obtenerCompraPorId = async (id: number): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/compra/${id}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener compra por ID:", error)
    throw error
  }
}
