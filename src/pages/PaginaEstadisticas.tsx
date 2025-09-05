"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, Activity, RefreshCw, ClipboardList, TrendingDown, AlertTriangle } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Chart } from "react-google-charts"
import type { KpiDTO, DatosParaGrafico } from "../types/dto/Estadisticas"
import {
  obtenerKpis,
  obtenerIngresosVsEgresos,
  obtenerProductosRentables,
  obtenerVolumenVentas,
  obtenerVentasPorHora,
} from "../api/estadisticaApi"
import { obtenerListaProductosVenta } from "../api/productoApi"
import type { ProductoVenta } from "../types/dto/Producto"
import { formatCurrency } from "../utils/numberFormatUtils"

const PaginaEstadisticas: React.FC = () => {
  // Estados principales
  const [kpis, setKpis] = useState<KpiDTO[]>([])
  const [datosIngresosVsEgresos, setDatosIngresosVsEgresos] = useState<DatosParaGrafico | null>(null)
  const [datosProductosRentables, setDatosProductosRentables] = useState<DatosParaGrafico | null>(null)
  const [datosVolumenVentas, setDatosVolumenVentas] = useState<DatosParaGrafico | null>(null)
  const [datosVentasPorHora, setDatosVentasPorHora] = useState<DatosParaGrafico | null>(null)
  const [productosVenta, setProductosVenta] = useState<ProductoVenta[]>([])

  // Estados de filtros
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null)
  const [fechaFin, setFechaFin] = useState<Date | null>(null)
  const [productoSeleccionado, setProductoSeleccionado] = useState<number | null>(null)

  // Estados de carga
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cargandoGraficos, setCargandoGraficos] = useState({
    ingresos: false,
    productos: false,
    volumen: false,
    horas: false,
  })

  // Establecer rango de fechas inicial (hace un año hasta hoy)
  useEffect(() => {
    const hoy = new Date()
    const haceUnAno = new Date()
    haceUnAno.setFullYear(hoy.getFullYear() - 1)

    setFechaInicio(haceUnAno)
    setFechaFin(hoy)
  }, [])

  // Cargar lista de productos para el filtro
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const productos = await obtenerListaProductosVenta()
        setProductosVenta(productos)
      } catch (error) {
        console.error("Error al cargar productos:", error)
      }
    }
    cargarProductos()
  }, [])

  // Cargar datos cuando cambien las fechas
  useEffect(() => {
    if (fechaInicio && fechaFin) {
      cargarDatos()
    }
  }, [fechaInicio, fechaFin])

  // Cargar datos de volumen de ventas cuando cambie el producto seleccionado
  useEffect(() => {
    if (fechaInicio && fechaFin) {
      cargarVolumenVentas()
    }
  }, [productoSeleccionado, fechaInicio, fechaFin])

  const cargarDatos = async () => {
    if (!fechaInicio || !fechaFin) return

    try {
      setCargando(true)
      setError(null)

      setCargandoGraficos({
        ingresos: true,
        productos: true,
        volumen: true,
        horas: true,
      })

      const fechas = {
        fechaInicio: fechaInicio.toISOString().split("T")[0],
        fechaFin: fechaFin.toISOString().split("T")[0],
      }

      const [kpisData, ingresosData, productosData, ventasHoraData] = await Promise.all([
        obtenerKpis(),
        obtenerIngresosVsEgresos(fechas),
        obtenerProductosRentables(fechas),
        obtenerVentasPorHora(fechas),
      ])

      setKpis(kpisData)
      setDatosIngresosVsEgresos(ingresosData)
      setDatosProductosRentables(productosData)
      setDatosVentasPorHora(ventasHoraData)

      setCargandoGraficos((prev) => ({
        ...prev,
        ingresos: false,
        productos: false,
        horas: false,
      }))

      await cargarVolumenVentas()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar estadísticas")
      setCargandoGraficos({
        ingresos: false,
        productos: false,
        volumen: false,
        horas: false,
      })
    } finally {
      setCargando(false)
    }
  }

  const cargarVolumenVentas = async () => {
    if (!fechaInicio || !fechaFin) return

    try {
      setCargandoGraficos((prev) => ({ ...prev, volumen: true }))

      const fechas = {
        fechaInicio: fechaInicio.toISOString().split("T")[0],
        fechaFin: fechaFin.toISOString().split("T")[0],
      }

      const volumenData = await obtenerVolumenVentas(fechas, productoSeleccionado)
      setDatosVolumenVentas(volumenData)
    } catch (err) {
      console.error("Error al cargar volumen de ventas:", err)
    } finally {
      setCargandoGraficos((prev) => ({ ...prev, volumen: false }))
    }
  }

  const aplicarFiltros = () => {
    cargarDatos()
  }

  const opcionesIngresosVsEgresos = {
    title: "Ingresos vs Egresos",
    hAxis: {
      title: "Período",
      titleTextStyle: { color: "#374151", fontSize: 12 },
    },    
    vAxis: {
      title: "Monto ($)",
      titleTextStyle: { color: "#374151", fontSize: 12 },
      format: "currency",
    },
    colors: ["#10B981", "#EF4444"],
    backgroundColor: "transparent",
    legend: { position: "top", alignment: "center" },
    chartArea: { left: 60, top: 60, width: "80%", height: "70%" },
  }

  const opcionesProductosRentables = {
    title: "Top 5 Productos Más Rentables",
    hAxis: {
      title: "Rentabilidad ($)",
      titleTextStyle: { color: "#374151", fontSize: 12 },
      format: "currency",
    },
    vAxis: {
      title: "Productos",
      titleTextStyle: { color: "#374151", fontSize: 12 },
    },
    colors: ["#3B82F6"],
    backgroundColor: "transparent",
    chartArea: { left: 120, top: 60, width: "70%", height: "70%" },
  }

  const opcionesVolumenVentas = {
    title: productoSeleccionado
      ? `Volumen de Ventas - ${productosVenta.find((p) => p.idProducto === productoSeleccionado)?.nombre || "Producto"}`
      : "Volumen de Ventas Mensual",
    hAxis: {
      title: "Mes",
      titleTextStyle: { color: "#374151", fontSize: 12 },
    },
    vAxis: {
      title: "Cantidad Vendida",
      titleTextStyle: { color: "#374151", fontSize: 12 },
    },
    colors: ["#F59E0B"],
    backgroundColor: "transparent",
    chartArea: { left: 60, top: 60, width: "80%", height: "70%" },
  }

  const opcionesVentasPorHora = {
    title: "Ventas por Hora del Día",
    hAxis: {
      title: "Hora",
      titleTextStyle: { color: "#374151", fontSize: 12 },
    },
    vAxis: {
      title: "Cantidad de Ventas",
      titleTextStyle: { color: "#374151", fontSize: 12 },
    },
    colors: ["#8B5CF6"],
    backgroundColor: "transparent",
    chartArea: { left: 60, top: 60, width: "80%", height: "70%" },
  }

  return (
    <div className="p-6 min-h-screen">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="text-blue-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Estadísticas</h1>
            <p className="text-gray-600">Panel de indicadores y análisis del negocio</p>
          </div>
        </div>
      </div>

      {/* Panel de Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
            <DatePicker
              selected={fechaInicio}
              onChange={(date) => setFechaInicio(date)}
              showMonthYearPicker
              dateFormat="MM/yyyy"
              placeholderText="Seleccionar mes/año"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
            <DatePicker
              selected={fechaFin}
              onChange={(date) => setFechaFin(date)}
              showMonthYearPicker
              dateFormat="MM/yyyy"
              placeholderText="Seleccionar mes/año"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={aplicarFiltros}
              disabled={!fechaInicio || !fechaFin || cargando}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"
            >
              {cargando ? (
                <>
                  <RefreshCw className="animate-spin mr-2" size={16} />
                  Cargando...
                </>
              ) : (
                "Aplicar Filtros"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mensaje de Error */}
      {error && <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 mb-6">{error}</div>}

      {/* Sección de KPIs */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
  {kpis.map((kpi, index) => (
    <div key={index} className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {/* Lógica de íconos (sin cambios) */}
          {index === 0 && <TrendingUp className="h-8 w-8 text-green-600" />}
          {index === 1 && <TrendingDown className="h-8 w-8 text-red-600" />}
          {index === 2 && <ClipboardList className="h-8 w-8 text-gray-600" />}
          {index === 3 && <Activity className="h-8 w-8 text-gray-600" />}
          {index === 4 && <AlertTriangle className="h-8 w-8 text-yellow-500" />}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-600">{kpi.titulo}</p>
          <p className="text-2xl font-semibold text-gray-900">
            {index === 0 || index === 1 || index === 3
              ? formatCurrency(kpi.valor as number)
              : kpi.valor.toString()} 
          </p>
        </div>
      </div>
    </div>
  ))}
</div>

      {/* Sección de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Ingresos vs Egresos */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ingresos vs. Egresos</h3>
          {cargandoGraficos.ingresos || !datosIngresosVsEgresos ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="flex items-center">
                <RefreshCw className="animate-spin mr-2" size={20} />
                Cargando datos...
              </div>
            </div>
          ) : (
            <Chart
              chartType="AreaChart"
              width="100%"
              height="300px"
              data={datosIngresosVsEgresos}
              options={opcionesIngresosVsEgresos}
            />
          )}
        </div>

        {/* Gráfico 2: Top 5 Productos Rentables */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Productos Rentables</h3>
          {cargandoGraficos.productos || !datosProductosRentables ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="flex items-center">
                <RefreshCw className="animate-spin mr-2" size={20} />
                Cargando datos...
              </div>
            </div>
          ) : (
            <Chart
              chartType="BarChart"
              width="100%"
              height="300px"
              data={datosProductosRentables}
              options={opcionesProductosRentables}
            />
          )}
        </div>

        {/* Gráfico 3: Volumen de Ventas Mensual */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Volumen de Ventas Mensual</h3>
            <select
              value={productoSeleccionado || ""}
              onChange={(e) => setProductoSeleccionado(e.target.value ? Number(e.target.value) : null)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={cargandoGraficos.volumen}
            >
              <option value="">Todos los productos</option>
              {productosVenta.map((producto) => (
                <option key={producto.idProducto} value={producto.idProducto}>
                  {producto.nombre}
                </option>
              ))}
            </select>
          </div>
          {cargandoGraficos.volumen || !datosVolumenVentas ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="flex items-center">
                <RefreshCw className="animate-spin mr-2" size={20} />
                Cargando datos...
              </div>
            </div>
          ) : (
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="300px"
              data={datosVolumenVentas}
              options={opcionesVolumenVentas}
            />
          )}
        </div>

        {/* Gráfico 4: Ventas por Hora */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ventas por Hora</h3>
          {cargandoGraficos.horas || !datosVentasPorHora ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="flex items-center">
                <RefreshCw className="animate-spin mr-2" size={20} />
                Cargando datos...
              </div>
            </div>
          ) : (
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="300px"
              data={datosVentasPorHora}
              options={opcionesVentasPorHora}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default PaginaEstadisticas
