"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, Plus, BrushCleaning, ChevronLeft, ChevronRight, ScrollText } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import type { PaginaDeVentas, VentaHistorial } from "../types/dto/Venta"
import { obtenerVentas, obtenerMetodosDePago } from "../api/ventaApi"
import { obtenerUsuarios } from "../api/usuarioApi"
import type { Usuario } from "../types/dto/Usuario"
import { formatCurrency } from "../utils/numberFormatUtils"
import { formatearFecha, formatearHora } from "../utils/fechaUtils"
import { ModalDetallesVenta } from "../components/ventas/ModalDetallesVenta"

const PaginaHistorialVentas: React.FC = () => {
  const navigate = useNavigate()

  // Estados principales
  const [ventas, setVentas] = useState<PaginaDeVentas | null>(null)
  const [metodosDePago, setMetodosDePago] = useState<string[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [ventaSeleccionada, setVentaSeleccionada] = useState<VentaHistorial | null>(null)
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState<boolean>(false)

  const [filtros, setFiltros] = useState({
    pagina: 0,
    tamaño: 10,
    metodoDePago: null as string | null,
    fechaInicio: null as Date | null,
    fechaFin: null as Date | null,
    idUsuario: null as number | null,
  })

  // Estados de carga y error
  const [cargando, setCargando] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  // Cargar datos iniciales
  useEffect(() => {
    const cargarVentas = async () => {
      setCargando(true)
      setError("")
      try {
        const filtrosApi = {
          ...filtros,
          fechaInicio: filtros.fechaInicio ? filtros.fechaInicio.toISOString().split("T")[0] : null,
          fechaFin: filtros.fechaFin ? filtros.fechaFin.toISOString().split("T")[0] : null,
        }
        const resultado = await obtenerVentas(filtrosApi)
        setVentas(resultado)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al buscar ventas")
      } finally {
        setCargando(false)
      }
    }
    cargarVentas()
  }, [filtros])

  useEffect(() => {
    const cargarDatosSelects = async (): Promise<void> => {
      try {
        const [metodosData, usuariosData] = await Promise.all([
          obtenerMetodosDePago(),
          obtenerUsuarios(),
        ])
        setMetodosDePago(metodosData)
        setUsuarios(usuariosData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar datos iniciales")
      }
    }
    cargarDatosSelects()
  }, [])

  const manejarCambioFiltro = (campo: keyof typeof filtros, valor: any) => {
    setFiltros(prev => ({ ...prev, [campo]: valor, pagina: 0 }))
  }  

  const limpiarFiltros = () => {
    setFiltros({
      pagina: 0,
      tamaño: 10,
      metodoDePago: null,
      fechaInicio: null,
      fechaFin: null,
      idUsuario: null,
    })
  }

  const cambiarPagina = (nuevaPagina: number) => {
    setFiltros(prev => ({ ...prev, pagina: nuevaPagina }))
  }

  const cambiarTamanoPagina = (nuevoTamano: number) => {
    setFiltros(prev => ({ ...prev, tamaño: nuevoTamano, pagina: 0 }))
  }

  const mostrarDetalles = (venta: VentaHistorial): void => {
    setVentaSeleccionada(venta)
    setMostrarModalDetalles(true)
  }

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ScrollText className="text-blue-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Historial de Ventas</h1>
            <p className="text-gray-600">Gestiona los ventas del negocio</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/ventas")}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Nueva Venta</span>
        </button>
      </div>

      {error && <div className="mt-2 mb-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      {/* Panel de filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">        
        <div className="inline-grid grid-cols-[0.9fr_0.9fr_1.1fr_1.1fr_auto] gap-4 mb-2">
          {/* Fecha desde */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
            <DatePicker
              selected={filtros.fechaInicio}
              onChange={(date) => manejarCambioFiltro("fechaInicio", date)}
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
              selected={filtros.fechaFin}
              onChange={(date) => manejarCambioFiltro("fechaFin", date)}
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
              value={filtros.metodoDePago || ""}
              onChange={(e) => manejarCambioFiltro("metodoDePago", e.target.value || null)}
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
            <select
              value={filtros.idUsuario || ""}
              onChange={(e) => manejarCambioFiltro("idUsuario", e.target.value ? Number(e.target.value) : null)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los usuarios</option>
              {usuarios.map((usuario) => (
                <option key={usuario.idUsuario} value={usuario.idUsuario}>
                  {usuario.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Botones de acción */}
          <div className="flex self-end mb-2">
            <button
              onClick={limpiarFiltros}
              className="p-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 flex items-center justify-center"
              title="Limpiar filtros"
            >
              <BrushCleaning size={20} />
            </button>
          </div>
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

            {ventas && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => cambiarPagina(ventas.number - 1)}
                    disabled={ventas.number === 0}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => cambiarPagina(ventas.number + 1)}
                    disabled={ventas.number >= ventas.totalPages - 1}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-4">
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{ventas.number * ventas.size + 1}</span> a{" "}
                      <span className="font-medium">
                        {Math.min((ventas.number + 1) * ventas.size, ventas.totalElements)}
                      </span>{" "}
                      de <span className="font-medium">{ventas.totalElements}</span> resultados
                    </p>
                    <select
                      value={ventas.size}
                      onChange={(e) => cambiarTamanoPagina(Number.parseInt(e.target.value))}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value={10}>10 por página</option>
                      <option value={25}>25 por página</option>
                      <option value={50}>50 por página</option>
                    </select>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => cambiarPagina(ventas.number - 1)}
                        disabled={ventas.number === 0}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        Página {ventas.number + 1} de {ventas.totalPages}
                      </span>
                      <button
                        onClick={() => cambiarPagina(ventas.number + 1)}
                        disabled={ventas.number >= ventas.totalPages - 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronRight size={20} />
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
      <ModalDetallesVenta
        isOpen={mostrarModalDetalles}
        onClose={() => setMostrarModalDetalles(false)}
        venta={ventaSeleccionada}
      />
    </div>
  )
}

export default PaginaHistorialVentas
