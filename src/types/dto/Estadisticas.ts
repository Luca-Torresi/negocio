// Para las tarjetas de KPI del dashboard
export interface KpiDTO {
  titulo: string
  valor: string | number
}

// El tipo genérico que devuelven los endpoints de gráficos
export type DatoGrafico = (string | number)[]
export type DatosParaGrafico = DatoGrafico[]

// Para los filtros de fecha en el dashboard
export interface FiltrosFecha {
  fechaInicio: string
  fechaFin: string
}

// Para el parámetro opcional de producto en volumen de ventas
export interface FiltroVolumenVentas extends FiltrosFecha {
  idProducto?: number | null
}
