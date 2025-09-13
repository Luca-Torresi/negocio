import apiClient from "./interceptors/apiClient"
import type { KpiDTO, DatosParaGrafico, FiltrosFecha } from "../types/dto/Estadisticas"

// Obtener KPIs del dashboard
export const obtenerKpis = async (): Promise<KpiDTO[]> => {
  const response = await apiClient.get(`/estadistica/kpis`)
  return response.data
}

// Obtener datos de ingresos vs egresos
export const obtenerIngresosVsEgresos = async (fechas: FiltrosFecha): Promise<DatosParaGrafico> => {
  const params = new URLSearchParams()
  params.append("fechaInicio", fechas.fechaInicio)
  params.append("fechaFin", fechas.fechaFin)

  const response = await apiClient.get(`/estadistica/ingresosVsEgresos?${params.toString()}`)
  return response.data
}

export const obtenerProductosRentables = async (fechas: FiltrosFecha, page: number): Promise<DatosParaGrafico> => {
  const params = {
    fechaInicio: fechas.fechaInicio,
    fechaFin: fechas.fechaFin,
    page: page,
  };
  
  const response = await apiClient.get('/estadistica/productosRentables', { params });
  return response.data;
}

// Obtener volumen de ventas mensual
export const obtenerVolumenVentas = async (
  fechas: FiltrosFecha,
  idProducto?: number | null,
): Promise<DatosParaGrafico> => {
  const params = new URLSearchParams()
  params.append("fechaInicio", fechas.fechaInicio)
  params.append("fechaFin", fechas.fechaFin)

  if (idProducto !== null && idProducto !== undefined) {
    params.append("idProducto", idProducto.toString())
  }

  const response = await apiClient.get(`/estadistica/volumenVentas?${params.toString()}`)
  return response.data
}

// Obtener ventas por hora del día
export const obtenerVentasPorHora = async (fechas: FiltrosFecha): Promise<DatosParaGrafico> => {
  const params = new URLSearchParams()
  params.append("fechaInicio", fechas.fechaInicio)
  params.append("fechaFin", fechas.fechaFin)

  const response = await apiClient.get(`/estadistica/ventasPorHora?${params.toString()}`)
  return response.data
}

// Obtener ventas por método de pago
export const obtenerVentasPorMetodoDePago = async (fechas: {
  fechaInicio: string
  fechaFin: string
}): Promise<DatosParaGrafico> => {
  const params = new URLSearchParams()
  params.append("fechaInicio", fechas.fechaInicio)
  params.append("fechaFin", fechas.fechaFin)

  const response = await apiClient.get(`/estadistica/ventasPorMetodoDePago?${params.toString()}`)
  return response.data
}