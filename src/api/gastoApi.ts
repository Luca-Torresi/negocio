import axios from "axios"
import type { PaginaDeGastos, GastoDTO } from "../types/dto/Gasto"

const API_BASE_URL = "http://localhost:8080"

// Obtener tipos de gasto disponibles
export const obtenerTiposGasto = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/gasto/tipos`)
    return response.data
  } catch (error) {
    console.error("Error al obtener tipos de gasto:", error)
    throw new Error("No se pudieron cargar los tipos de gasto")
  }
}

// Obtener gastos con filtros y paginación
export const obtenerGastos = async (filtros: any): Promise<PaginaDeGastos> => {
  try {
    // Construir parámetros de URL dinámicamente, excluyendo valores null/undefined
    const params = new URLSearchParams()

    Object.keys(filtros).forEach((key) => {
      const valor = filtros[key]
      if (valor !== null && valor !== undefined && valor !== "") {
        params.append(key, valor.toString())
      }
    })

    const response = await axios.get(`${API_BASE_URL}/gasto/lista?${params.toString()}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener gastos:", error)
    throw new Error("No se pudieron cargar los gastos")
  }
}

// Crear nuevo gasto
export const crearGasto = async (data: GastoDTO): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/gasto/nuevo`, data)
    return response.data
  } catch (error) {
    console.error("Error al crear gasto:", error)
    throw new Error("No se pudo crear el gasto")
  }
}

// Modificar gasto existente
export const modificarGasto = async (id: number, data: GastoDTO): Promise<any> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/gasto/modificar/${id}`, data)
    return response.data
  } catch (error) {
    console.error("Error al modificar gasto:", error)
    throw new Error("No se pudo modificar el gasto")
  }
}
