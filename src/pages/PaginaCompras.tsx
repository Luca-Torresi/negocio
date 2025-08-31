"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ShoppingCart, Plus, Eye, Pencil, ChevronLeft, ChevronRight } from "lucide-react"
import type { PaginaDeCompras, Compra } from "../types/dto/Compra"
import { obtenerCompras } from "../api/compraApi"
import { obtenerListaProveedores } from "../api/proveedorApi"
import { formatearFecha, formatearHora } from "../utils/fechaUtils"
import { ModalGestionarCompra } from "../components/compras/ModalGestionarCompra"
import { ModalDetallesCompra } from "../components/compras/ModalDetallesCompra"
import { formatCurrency } from "../utils/numberFormatUtils"

const PaginaCompras: React.FC = () => {
  // Estados principales
  const [paginaDeCompras, setPaginaDeCompras] = useState<PaginaDeCompras | null>(null)
  const [proveedores, setProveedores] = useState<{ idProveedor: number; nombre: string }[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados de filtros
  const [filtros, setFiltros] = useState({
    pagina: 0,
    tamaño: 10,
    idProveedor: null as number | null,
    fechaInicio: null as string | null,
    fechaFin: null as string | null,
  })

  // Estados de modales
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false)
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false)
  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(false)
  const [compraSeleccionada, setCompraSeleccionada] = useState<Compra | null>(null)

  // Cargar proveedores al montar el componente
  useEffect(() => {
    cargarProveedores()
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

  const cargarCompras = async () => {
    setCargando(true)
    setError(null)

    try {
      const data = await obtenerCompras(filtros)
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
      pagina: 0, // Resetear a primera página cuando cambian filtros
    }))
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

  const abrirModalEditar = (compra: Compra) => {
    setCompraSeleccionada(compra)
    setModalEditarAbierto(true)
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
    setModalEditarAbierto(false)
    setModalDetallesAbierto(false)
    setCompraSeleccionada(null)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Encabezado */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <ShoppingCart className="mr-3 text-gray-700" size={32} />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Compras</h1>
            <p className="text-gray-600">Historial de compras a proveedores</p>
          </div>
        </div>
      </div>

      {/* Panel de Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
            <input
              type="date"
              value={filtros.fechaInicio || ""}
              onChange={(e) => manejarCambioFiltro("fechaInicio", e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
            <input
              type="date"
              value={filtros.fechaFin || ""}
              onChange={(e) => manejarCambioFiltro("fechaFin", e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Botón Nueva Compra */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setModalNuevoAbierto(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          Nueva Compra
        </button>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        <div className="flex space-x-2">
                          <button
                            onClick={() => abrirModalDetalles(compra)}
                            className="text-black"
                            title="Ver detalles"
                          >
                            <Eye size={18} />
                          </button>
                          <button onClick={() => abrirModalEditar(compra)} className="text-black" title="Editar">
                            <Pencil size={18} />
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
                      Mostrando <span className="font-medium">{paginaDeCompras.number * paginaDeCompras.size + 1}</span>{" "}
                      a{" "}
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

      <ModalGestionarCompra
        isOpen={modalEditarAbierto}
        onClose={cerrarModales}
        onSuccess={refrescarDatos}
        idCompra={compraSeleccionada?.idCompra || null}
      />

      <ModalDetallesCompra isOpen={modalDetallesAbierto} onClose={cerrarModales} compra={compraSeleccionada} />
    </div>
  )
}

export default PaginaCompras;
