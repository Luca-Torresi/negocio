"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, Search, Plus, TrendingUp } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import type { PaginaDeVentas, FiltrosVenta, VentaHistorial } from "../types/dto/Venta"
import { obtenerVentas, obtenerMetodosDePago } from "../api/ventaApi"
import { formatCurrency } from "../utils/numberFormatUtils"
import { formatearFecha, formatearHora } from "../utils/fechaUtils"

const PaginaHistorialVentas: React.FC = () => {
  const navigate = useNavigate()

  // Estados principales
  const [ventas, setVentas] = useState<PaginaDeVentas | null>(null)
  const [metodosDePago, setMetodosDePago] = useState<string[]>([])
  const [ventaSeleccionada, setVentaSeleccionada] = useState<VentaHistorial | null>(null)
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState<boolean>(false)

  // Estados de filtros
  const [fechaDesde, setFechaDesde] = useState<Date | null>(null)
  const [fechaHasta, setFechaHasta] = useState<Date | null>(null)
  const [metodoPagoFiltro, setMetodoPagoFiltro] = useState<string>("")
  const [usuarioFiltro, setUsuarioFiltro] = useState<string>("")
  const [paginaActual, setPaginaActual] = useState<number>(0)

  // Estados de carga y error
  const [cargando, setCargando] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  const size = 10

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async (): Promise<void> => {
      try {
        const metodosData = await obtenerMetodosDePago()
        setMetodosDePago(metodosData)
        await buscarVentas()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar datos")
      }
    }

    cargarDatos()
  }, [])

  // Buscar ventas con filtros
  const buscarVentas = async (number = 0): Promise<void> => {
    try {
      setCargando(true)
      setError("")

      const filtros: FiltrosVenta = {
        number,
        size,
        ...(fechaDesde && { fechaDesde: fechaDesde.toISOString().split("T")[0] }),
        ...(fechaHasta && { fechaHasta: fechaHasta.toISOString().split("T")[0] }),
        ...(metodoPagoFiltro && { metodoDePago: metodoPagoFiltro }),
        ...(usuarioFiltro && { usuario: usuarioFiltro }),
      }

      const resultado = await obtenerVentas(filtros)
      setVentas(resultado)
      setPaginaActual(number)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al buscar ventas")
    } finally {
      setCargando(false)
    }
  }

  // Limpiar filtros
  const limpiarFiltros = (): void => {
    setFechaDesde(null)
    setFechaHasta(null)
    setMetodoPagoFiltro("")
    setUsuarioFiltro("")
    setPaginaActual(0)
    buscarVentas(0)
  }

  // Mostrar detalles de venta
  const mostrarDetalles = (venta: VentaHistorial): void => {
    setVentaSeleccionada(venta)
    setMostrarModalDetalles(true)
  }

  // Cambiar página
  const cambiarPagina = (nuevaPagina: number): void => {
    buscarVentas(nuevaPagina)
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-blue-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Ventas</h1>
              <p className="text-gray-600">Gestiona las ventas del negocio</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/ventas")}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={16} />
            <span>Nueva Venta</span>
          </button>
        </div>

        {error && <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

        {/* Panel de filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Search className="mr-2" size={20} />
            Filtros de Búsqueda
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Fecha desde */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
              <DatePicker
                selected={fechaDesde}
                onChange={(date) => setFechaDesde(date)}
                locale="es"
                dateFormat="dd/MM/yyyy"
                placeholderText="Seleccionar fecha"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Fecha hasta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
              <DatePicker
                selected={fechaHasta}
                onChange={(date) => setFechaHasta(date)}
                locale="es"
                dateFormat="dd/MM/yyyy"
                placeholderText="Seleccionar fecha"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Método de pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
              <select
                value={metodoPagoFiltro}
                onChange={(e) => setMetodoPagoFiltro(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los métodos</option>
                {metodosDePago.map((metodo) => (
                  <option key={metodo} value={metodo}>
                    {metodo}
                  </option>
                ))}
              </select>
            </div>

            {/* Usuario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <input
                type="text"
                value={usuarioFiltro}
                onChange={(e) => setUsuarioFiltro(e.target.value)}
                placeholder="Filtrar por usuario"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button
              onClick={() => buscarVentas(0)}
              disabled={cargando}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {cargando ? "Buscando..." : "Buscar"}
            </button>
            <button onClick={limpiarFiltros} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Tabla de ventas */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {cargando ? (
            <div className="p-8 text-center">
              <div className="text-lg">Cargando ventas...</div>
            </div>
          ) : !ventas || ventas.content.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No se encontraron ventas con los filtros aplicados</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Método de Pago
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hora
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ventas.content.map((venta) => (
                      <tr key={venta.idVenta} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{venta.idVenta}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                          {formatCurrency(venta.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{venta.metodoDePago}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{venta.usuario}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatearFecha(venta.fechaHora)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatearHora(venta.fechaHora)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex justify-center space-x-2">
                            <button onClick={() => mostrarDetalles(venta)} className="text-black" title="Ver detalles">
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {ventas.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => cambiarPagina(paginaActual - 1)}
                      disabled={paginaActual === 0}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => cambiarPagina(paginaActual + 1)}
                      disabled={paginaActual >= ventas.totalPages - 1}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Mostrando <span className="font-medium">{paginaActual * size + 1}</span> a{" "}
                        <span className="font-medium">{Math.min((paginaActual + 1) * size, ventas.totalElements)}</span>{" "}
                        de <span className="font-medium">{ventas.totalElements}</span> resultados
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => cambiarPagina(paginaActual - 1)}
                          disabled={paginaActual === 0}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          Anterior
                        </button>
                        {Array.from({ length: Math.min(5, ventas.totalPages) }, (_, i) => {
                          const pagina = i + Math.max(0, paginaActual - 2)
                          if (pagina >= ventas.totalPages) return null
                          return (
                            <button
                              key={pagina}
                              onClick={() => cambiarPagina(pagina)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagina === paginaActual
                                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                }`}
                            >
                              {pagina + 1}
                            </button>
                          )
                        })}
                        <button
                          onClick={() => cambiarPagina(paginaActual + 1)}
                          disabled={paginaActual >= ventas.totalPages - 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          Siguiente
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal de detalles */}
        {mostrarModalDetalles && ventaSeleccionada && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Detalles de Venta #{ventaSeleccionada.idVenta}
                </h3>

                <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Total:</span> {formatCurrency(ventaSeleccionada.total)}
                  </div>
                  <div>
                    <span className="font-medium">Método de Pago:</span> {ventaSeleccionada.metodoDePago}
                  </div>
                  <div>
                    <span className="font-medium">Usuario:</span> {ventaSeleccionada.usuario}
                  </div>
                  <div>
                    <span className="font-medium">Fecha:</span> {formatearFecha(ventaSeleccionada.fechaHora)}
                  </div>
                  <div>
                    <span className="font-medium">Hora:</span> {formatearHora(ventaSeleccionada.fechaHora)}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Items de la Venta:</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2">Item</th>
                          <th className="text-center py-2">Cantidad</th>
                          <th className="text-right py-2">Precio Unit.</th>
                          <th className="text-right py-2">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ventaSeleccionada.detalles.map((detalle, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-2">{detalle.nombre}</td>
                            <td className="py-2 text-center">{detalle.cantidad}</td>
                            <td className="py-2 text-right">{formatCurrency(detalle.precioUnitario)}</td>
                            <td className="py-2 text-right font-semibold">
                              {formatCurrency(detalle.precioUnitario * detalle.cantidad)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setMostrarModalDetalles(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaginaHistorialVentas
