"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Plus, Pencil, Truck, BrushCleaning } from "lucide-react"
import type { Proveedor, ProveedorDTO } from "../types/dto/Proveedor"
import { obtenerProveedores, crearProveedor, modificarProveedor, cambiarEstadoProveedor } from "../api/proveedorApi"
import { ModalNuevoProveedor } from "../components/proveedores/ModalNuevoProveedor"
import { ModalEditarProveedor } from "../components/proveedores/ModalEditarProveedor"
import { toast } from "react-toastify"

const PaginaProveedores: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [busqueda, setBusqueda] = useState<string>("")
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "activos" | "inactivos">("todos")
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState<boolean>(false)
  const [modalEditarAbierto, setModalEditarAbierto] = useState<boolean>(false)
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null)

  // Cargar proveedores al montar el componente
  useEffect(() => {
    cargarProveedores()
  }, [])

  const cargarProveedores = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await obtenerProveedores()
      setProveedores(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar proveedores")
    } finally {
      setLoading(false)
    }
  }

  // Filtrar proveedores basado en búsqueda y estado
  const proveedoresFiltrados = useMemo(() => {
    return proveedores.filter((proveedor) => {
      const coincideNombre = proveedor.nombre.toLowerCase().includes(busqueda.toLowerCase())
      const coincideEstado =
        filtroEstado === "todos" ||
        (filtroEstado === "activos" && proveedor.estado) ||
        (filtroEstado === "inactivos" && !proveedor.estado)

      return coincideNombre && coincideEstado
    })
  }, [proveedores, busqueda, filtroEstado])

  const handleCrearProveedor = async (data: ProveedorDTO) => {
    try {
      await crearProveedor(data)
      toast.success("Proveedor cargado con éxito")
      setModalNuevoAbierto(false)
      await cargarProveedores()
    } catch (err) {
      console.error("No fue posible cargar el nuevo proveedor")
    }
  }

  const handleEditarProveedor = async (id: number, data: ProveedorDTO) => {
    try {
      await modificarProveedor(id, data)
      toast.success("Proveedor modificado con éxito")
      setModalEditarAbierto(false)
      setProveedorSeleccionado(null)
      await cargarProveedores()
    } catch (err) {
      console.error("No fue posible modificar el proveedor")
    }
  }

  const handleCambiarEstado = async (id: number) => {
    try {
      await cambiarEstadoProveedor(id)
      await cargarProveedores()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cambiar estado")
    }
  }

  const abrirModalEditar = (proveedor: Proveedor) => {
    setProveedorSeleccionado(proveedor)
    setModalEditarAbierto(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Cargando proveedores...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Truck className="text-primary" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Proveedores</h1>
            <p className="text-gray-600">Gestiona los proveedores del negocio</p>
          </div>
        </div>
        <button
          onClick={() => setModalNuevoAbierto(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          <Plus size={20} />
          <span>Nuevo Proveedor</span>
        </button>
      </div>

      {/* Panel de filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-6 gap-4 mb-2">
          {/* Búsqueda por nombre */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Buscar por nombre</label>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro por estado */}
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">Filtrar por estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as "todos" | "activos" | "inactivos")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </div>

          <div className="flex mt-6">
            <button
              onClick={() => {
                setBusqueda("")
                setFiltroEstado("todos")
              }}
              className="p-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 flex items-center justify-center"
            >
              <BrushCleaning size={20} />
            </button>
          </div>

        </div>
      </div>

      {/* Mensaje de error */}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">{error}</div>}

      {/* Tabla de proveedores */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {proveedoresFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No se encontraron proveedores
                  </td>
                </tr>
              ) : (
                proveedoresFiltrados.map((proveedor) => (
                  <tr key={proveedor.idProveedor} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{proveedor.idProveedor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {proveedor.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{proveedor.telefono}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{proveedor.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex justify-center items-center gap-4">

                        {/* Botón editar */}
                        <button
                          onClick={() => abrirModalEditar(proveedor)}
                          className="text-black"
                          title="Editar proveedor"
                        >
                          <Pencil size={18} />
                        </button>

                        {/* Toggle estado */}
                        <button
                          onClick={() => handleCambiarEstado(proveedor.idProveedor)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${proveedor.estado
                            ? "bg-toggleOn focus:ring-toggleOn"
                            : "bg-toggleOff focus:ring-toggleOff"
                            }`}
                          title={proveedor.estado ? "Desactivar" : "Activar"}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${proveedor.estado ? "translate-x-6" : "translate-x-1"
                              }`}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      <ModalNuevoProveedor
        isOpen={modalNuevoAbierto}
        onClose={() => setModalNuevoAbierto(false)}
        onConfirm={handleCrearProveedor}
      />

      <ModalEditarProveedor
        isOpen={modalEditarAbierto}
        onClose={() => {
          setModalEditarAbierto(false)
          setProveedorSeleccionado(null)
        }}
        onConfirm={handleEditarProveedor}
        proveedor={proveedorSeleccionado}
      />
    </div>
  )
}

export default PaginaProveedores;
