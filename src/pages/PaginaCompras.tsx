"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ShoppingCart, Plus, Eye, ChevronLeft, ChevronRight, BrushCleaning } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import type { PaginaDeCompras, Compra } from "../types/dto/Compra"
import { obtenerCompras } from "../api/compraApi"
import { obtenerListaProveedores } from "../api/proveedorApi"
import { formatearFecha, formatearHora } from "../utils/fechaUtils"
import { ModalGestionarCompra } from "../components/compras/ModalGestionarCompra"
import { ModalDetallesCompra } from "../components/compras/ModalDetallesCompra"
import { formatCurrency } from "../utils/numberFormatUtils"
import type { Usuario } from "../types/dto/Usuario"
import { obtenerUsuarios } from "../api/usuarioApi"

const PaginaCompras: React.FC = () => {
  // Estados principales
  const [paginaDeCompras, setPaginaDeCompras] = useState<PaginaDeCompras | null>(null)
  const [proveedores, setProveedores] = useState<{ idProveedor: number; nombre: string }[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados de filtros
  const [filtros, setFiltros] = useState({
    pagina: 0,
    tamaño: 10,
    idProveedor: null as number | null,
    fechaInicio: null as Date | null,
    fechaFin: null as Date | null,
    idUsuario: null as number | null,
  })

  // Estados de modales
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false)
  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(false)
  const [compraSeleccionada, setCompraSeleccionada] = useState<Compra | null>(null)

  // Cargar proveedores al montar el componente
  useEffect(() => {
    cargarProveedores()
    cargarUsuarios()
  }, [])

  // Cargar compras cuando cambien los filtros
  useEffect(() => {
    cargarCompras()
  }, [filtros])

  const cargarProveedores = async () => {
    try {
      const data = await obtenerListaProveedores()
      setProveedores(data)
    } catch (error) {
      console.error("Error al cargar proveedores:", error)
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

  const cargarCompras = async () => {
    setCargando(true)
    setError(null)

    try {
      const filtrosApi = {
        ...filtros,
        fechaInicio: filtros.fechaInicio ? filtros.fechaInicio.toISOString().split("T")[0] : null,
        fechaFin: filtros.fechaFin ? filtros.fechaFin.toISOString().split("T")[0] : null,
      }
      const data = await obtenerCompras(filtrosApi)
      setPaginaDeCompras(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al cargar compras")
    } finally {
      setCargando(false)
    }
  }

  const manejarCambioFiltro = (campo: string, valor: any) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
      pagina: 0,
    }))
  }

  const limpiarFiltros = () => {
    setFiltros({
      pagina: 0,
      tamaño: 10,
      idProveedor: null,
      fechaInicio: null,
      fechaFin: null,
      idUsuario: null,
    })
  }

  const cambiarPagina = (nuevaPagina: number) => {
    setFiltros((prev) => ({
      ...prev,
      pagina: nuevaPagina,
    }))
  }

  const cambiarTamanoPagina = (nuevoTamano: number) => {
    setFiltros((prev) => ({
      ...prev,
      tamaño: nuevoTamano,
      pagina: 0,
    }))
  }

  const abrirModalDetalles = (compra: Compra) => {
    setCompraSeleccionada(compra)
    setModalDetallesAbierto(true)
  }

  const refrescarDatos = () => {
    cargarCompras()
  }

  const cerrarModales = () => {
    setModalNuevoAbierto(false)
    setModalDetallesAbierto(false)
    setCompraSeleccionada(null)
  }

  return (
    <div className="p-6 min-h-screen">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShoppingCart className="text-blue-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Compras</h1>
            <p className="text-gray-600">Gestiona las compras a proveedores</p>
          </div>
        </div>
        <button
          onClick={() => setModalNuevoAbierto(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Nueva Compra</span>
        </button>
      </div>

      {/* Panel de Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="inline-grid grid-cols-[0.9fr_0.9fr_1.1fr_1.1fr_auto] gap-4 mb-2">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
            <DatePicker
              selected={filtros.fechaInicio}
              onChange={(date) => manejarCambioFiltro("fechaInicio", date)}
              locale="es"
              dateFormat="dd/MM/yyyy"
              placeholderText="Seleccionar fecha"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
            <DatePicker
              selected={filtros.fechaFin}
              onChange={(date) => manejarCambioFiltro("fechaFin", date)}
              locale="es"
              dateFormat="dd/MM/yyyy"
              placeholderText="Seleccionar fecha"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
            <select
              value={filtros.idProveedor || ""}
              onChange={(e) => manejarCambioFiltro("idProveedor", e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los proveedores</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                  {proveedor.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <select
              value={filtros.idUsuario || ""}
              onChange={(e) => manejarCambioFiltro("idUsuario", e.target.value ? Number(e.target.value) : null)}
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

      {/* Tabla de Compras */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {error && <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">{error}</div>}

        {cargando ? (
          <div className="p-8 text-center">
            <div className="text-gray-500">Cargando compras...</div>
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
                      Proveedor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
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
                  {paginaDeCompras?.content.map((compra) => (
                    <tr key={compra.idCompra} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{compra.idCompra}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{compra.proveedor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {formatCurrency(compra.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{compra.usuario}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatearFecha(compra.fechaHora)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatearHora(compra.fechaHora)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => abrirModalDetalles(compra)}
                            className="text-black"
                            title="Ver detalles"
                          >
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
            {paginaDeCompras && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => cambiarPagina(paginaDeCompras.number - 1)}
                    disabled={paginaDeCompras.number === 0}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => cambiarPagina(paginaDeCompras.number + 1)}
                    disabled={paginaDeCompras.number >= paginaDeCompras.totalPages - 1}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-4">
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{paginaDeCompras.number * paginaDeCompras.size + 1}</span> a{" "}
                      <span className="font-medium">
                        {Math.min((paginaDeCompras.number + 1) * paginaDeCompras.size, paginaDeCompras.totalElements)}
                      </span>{" "}
                      de <span className="font-medium">{paginaDeCompras.totalElements}</span> resultados
                    </p>
                    <select
                      value={filtros.tamaño}
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
                        onClick={() => cambiarPagina(paginaDeCompras.number - 1)}
                        disabled={paginaDeCompras.number === 0}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        Página {paginaDeCompras.number + 1} de {paginaDeCompras.totalPages}
                      </span>
                      <button
                        onClick={() => cambiarPagina(paginaDeCompras.number + 1)}
                        disabled={paginaDeCompras.number >= paginaDeCompras.totalPages - 1}
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
      <ModalGestionarCompra
        isOpen={modalNuevoAbierto}
        onClose={cerrarModales}
        onSuccess={refrescarDatos}
        idCompra={null}
      />

      <ModalDetallesCompra isOpen={modalDetallesAbierto} onClose={cerrarModales} compra={compraSeleccionada} />
    </div>
  )
}

export default PaginaCompras
