"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Pencil, ChevronLeft, ChevronRight, ReceiptText, BrushCleaning } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import type { Gasto, PaginaDeGastos } from "../types/dto/Gasto"
import { obtenerTiposGasto, obtenerGastos } from "../api/gastoApi"
import { obtenerUsuarios } from "../api/usuarioApi"
import type { Usuario } from "../types/dto/Usuario"
import { formatearFecha, formatearHora } from "../utils/fechaUtils"
import { ModalNuevoGasto } from "../components/gastos/ModalNuevoGasto"
import { ModalEditarGasto } from "../components/gastos/ModalEditarGasto"
import { formatCurrency } from "../utils/numberFormatUtils"

const PaginaGastos: React.FC = () => {
  // Estados principales
  const [paginaDeGastos, setPaginaDeGastos] = useState<PaginaDeGastos | null>(null)
  const [tiposDeGasto, setTiposDeGasto] = useState<string[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalNuevoOpen, setIsModalNuevoOpen] = useState(false)
  const [isModalEditarOpen, setIsModalEditarOpen] = useState(false)
  const [gastoSeleccionado, setGastoSeleccionado] = useState<Gasto | null>(null)

  // Estados de filtros
  const [filtros, setFiltros] = useState({
    page: 0,
    size: 10,
    tipoGasto: null as string | null,
    fechaInicio: null as string | null,
    fechaFin: null as string | null,
    idUsuario: null as number | null,
  })

  // Cargar tipos de gasto al montar el componente
  useEffect(() => {
    const cargarTiposDeGasto = async () => {
      try {
        const tipos = await obtenerTiposGasto()
        setTiposDeGasto(tipos)
      } catch (error) {
        console.error("Error al cargar tipos de gasto:", error)
      }
    }

    const cargarUsuarios = async () => {
      try {
        const data = await obtenerUsuarios()
        setUsuarios(data)
      } catch (error) {
        console.error("Error al cargar usuarios:", error)
      }
    }

    cargarTiposDeGasto()
    cargarUsuarios()
  }, [])

  // Cargar gastos cuando cambien los filtros
  useEffect(() => {
    const cargarGastos = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const respuesta = await obtenerGastos(filtros)
        setPaginaDeGastos(respuesta)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido")
      } finally {
        setIsLoading(false)
      }
    }

    cargarGastos()
  }, [filtros])

  // Manejar cambios en filtros
  const handleFiltroChange = (campo: string, valor: any) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
      page: 0,
    }))
  }

  const limpiarFiltros = () => {
    setFiltros({
      page: 0,
      size: 10,
      tipoGasto: null,
      fechaInicio: null,
      fechaFin: null,
      idUsuario: null,
    })
  }

  // Manejar paginación
  const cambiarPagina = (nuevaPagina: number) => {
    setFiltros((prev) => ({
      ...prev,
      page: nuevaPagina,
    }))
  }

  const cambiarTamanoPagina = (nuevoTamano: number) => {
    setFiltros((prev) => ({
      ...prev,
      size: nuevoTamano,
      page: 0,
    }))
  }

  // Manejar edición
  const abrirModalEditar = (gasto: Gasto) => {
    setGastoSeleccionado(gasto)
    setIsModalEditarOpen(true)
  }

  // Refrescar datos después de operaciones exitosas
  const refrescarDatos = () => {
    const cargarGastos = async () => {
      try {
        const respuesta = await obtenerGastos(filtros)
        setPaginaDeGastos(respuesta)
      } catch (error) {
        console.error("Error al refrescar datos:", error)
      }
    }
    cargarGastos()
  }

  return (
    <div className="p-6 min-h-screen">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ReceiptText className="text-primary" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gastos</h1>
            <p className="text-gray-600">Gestiona los gastos del negocio</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalNuevoOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          <Plus size={20} />
          <span>Nuevo Gasto</span>
        </button>
      </div>

      {/* Panel de Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="inline-grid grid-cols-[0.9fr_0.9fr_1.1fr_1.1fr_auto] gap-4 mb-2">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
            <DatePicker
              selected={filtros.fechaInicio ? new Date(filtros.fechaInicio) : null}
              onChange={(date) => handleFiltroChange("fechaInicio", date ? date.toISOString().split("T")[0] : null)}
              locale="es"
              dateFormat="dd/MM/yyyy"
              placeholderText="Seleccionar fecha"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
            <DatePicker
              selected={filtros.fechaFin ? new Date(filtros.fechaFin) : null}
              onChange={(date) => handleFiltroChange("fechaFin", date ? date.toISOString().split("T")[0] : null)}
              locale="es"
              dateFormat="dd/MM/yyyy"
              placeholderText="Seleccionar fecha"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Gasto</label>
            <select
              value={filtros.tipoGasto || ""}
              onChange={(e) => handleFiltroChange("tipoGasto", e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los tipos</option>
              {tiposDeGasto.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <select
              value={filtros.idUsuario || ""}
              onChange={(e) => handleFiltroChange("idUsuario", e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los usuarios</option>
              {usuarios.map((usuario) => (
                <option key={usuario.idUsuario} value={usuario.idUsuario}>
                  {usuario.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex self-end mb-1">
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

      {/* Tabla de Gastos */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {error && <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">{error}</div>}

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="text-gray-500">Cargando gastos...</div>
          </div>
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
                      Tipo de Gasto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
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
                  {paginaDeGastos?.content.map((gasto) => (
                    <tr key={gasto.idGasto} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{gasto.idGasto}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{gasto.tipoGasto}</td>
                      <td className={`px-4 py-3 ${!gasto.descripcion
                        ? 'text-sm text-gray-400 italic'
                        : 'text-sm text-gray-900'
                        }`}>
                        {gasto.descripcion || "Sin Descripción"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {formatCurrency(gasto.monto)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{gasto.usuario}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatearFecha(gasto.fechaHora)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatearHora(gasto.fechaHora)}
                      </td>
                      <td className="flex justify-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button onClick={() => abrirModalEditar(gasto)} className="text-black">
                          <Pencil size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {paginaDeGastos && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => cambiarPagina(paginaDeGastos.number - 1)}
                    disabled={paginaDeGastos.number === 0}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => cambiarPagina(paginaDeGastos.number + 1)}
                    disabled={paginaDeGastos.number >= paginaDeGastos.totalPages - 1}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-4">
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{paginaDeGastos.number * paginaDeGastos.size + 1}</span> a{" "}
                      <span className="font-medium">
                        {Math.min((paginaDeGastos.number + 1) * paginaDeGastos.size, paginaDeGastos.totalElements)}
                      </span>{" "}
                      de <span className="font-medium">{paginaDeGastos.totalElements}</span> resultados
                    </p>
                    <select
                      value={filtros.size}
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
                        onClick={() => cambiarPagina(paginaDeGastos.number - 1)}
                        disabled={paginaDeGastos.number === 0}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        Página {paginaDeGastos.number + 1} de {paginaDeGastos.totalPages}
                      </span>
                      <button
                        onClick={() => cambiarPagina(paginaDeGastos.number + 1)}
                        disabled={paginaDeGastos.number >= paginaDeGastos.totalPages - 1}
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

      {/* Modales */}
      <ModalNuevoGasto
        isOpen={isModalNuevoOpen}
        onClose={() => setIsModalNuevoOpen(false)}
        onSuccess={refrescarDatos}
        tiposDeGasto={tiposDeGasto}
      />

      <ModalEditarGasto
        isOpen={isModalEditarOpen}
        onClose={() => setIsModalEditarOpen(false)}
        onSuccess={refrescarDatos}
        gasto={gastoSeleccionado}
        tiposDeGasto={tiposDeGasto}
      />
    </div>
  )
}

export default PaginaGastos
