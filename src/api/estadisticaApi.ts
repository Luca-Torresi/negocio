import axios from "axios"
import type { KpiDTO, DatosParaGrafico, FiltrosFecha } from "../types/dto/Estadisticas"

const API_BASE_URL = "http://localhost:8080"

// Obtener KPIs del dashboard
export const obtenerKpis = async (): Promise<KpiDTO[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/estadistica/kpis`)
    return response.data
  } catch (error) {
    console.error("Error al obtener KPIs:", error)
    throw new Error("No se pudieron cargar los indicadores clave")
  }
}

// Obtener datos de ingresos vs egresos
export const obtenerIngresosVsEgresos = async (fechas: FiltrosFecha): Promise<DatosParaGrafico> => {
  try {
    const params = new URLSearchParams()
    params.append("fechaInicio", fechas.fechaInicio)
    params.append("fechaFin", fechas.fechaFin)

    const response = await axios.get(`${API_BASE_URL}/estadistica/ingresosVsEgresos?${params.toString()}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener datos de ingresos vs egresos:", error)
    throw new Error("No se pudieron cargar los datos de ingresos vs egresos")
  }
}

// Obtener productos más rentables
export const obtenerProductosRentables = async (fechas: FiltrosFecha): Promise<DatosParaGrafico> => {
  try {
    const params = new URLSearchParams()
    params.append("fechaInicio", fechas.fechaInicio)
    params.append("fechaFin", fechas.fechaFin)

    const response = await axios.get(`${API_BASE_URL}/estadistica/productosRentables?${params.toString()}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener productos rentables:", error)
    throw new Error("No se pudieron cargar los productos más rentables")
  }
}

// Obtener volumen de ventas mensual
export const obtenerVolumenVentas = async (
  fechas: FiltrosFecha,
  idProducto?: number | null,
): Promise<DatosParaGrafico> => {
  try {
    const params = new URLSearchParams()
    params.append("fechaInicio", fechas.fechaInicio)
    params.append("fechaFin", fechas.fechaFin)

    if (idProducto !== null && idProducto !== undefined) {
      params.append("idProducto", idProducto.toString())
    }

    const response = await axios.get(`${API_BASE_URL}/estadistica/volumenVentas?${params.toString()}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener volumen de ventas:", error)
    throw new Error("No se pudieron cargar los datos de volumen de ventas")
  }
}

// Obtener ventas por hora del día
export const obtenerVentasPorHora = async (fechas: FiltrosFecha): Promise<DatosParaGrafico> => {
  try {
    const params = new URLSearchParams()
    params.append("fechaInicio", fechas.fechaInicio)
    params.append("fechaFin", fechas.fechaFin)

    const response = await axios.get(`${API_BASE_URL}/estadistica/ventasPorHora?${params.toString()}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener ventas por hora:", error)
    throw new Error("No se pudieron cargar los datos de ventas por hora")
  }
}
