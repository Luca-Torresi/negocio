"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Gift, Plus, Eye, Pencil } from "lucide-react"
import { obtenerPromociones, cambiarEstadoPromocion } from "../api/promocionApi"
import { ModalGestionarPromocion } from "../components/promociones/ModalGestionarPromocion"
import { ModalDetallesPromocion } from "../components/promociones/ModalDetallesPromocion"
import type { Promocion } from "../types/dto/Promocion"
import { formatCurrency } from "../utils/numberFormatUtils"

export const PaginaPromociones: React.FC = () => {
  const [promociones, setPromociones] = useState<Promocion[]>([])
  const [cargando, setCargando] = useState(true)
  const [modalGestionAbierto, setModalGestionAbierto] = useState(false)
  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(false)
  const [promocionParaEditar, setPromocionParaEditar] = useState<Promocion | null>(null)
  const [promocionDetalles, setPromocionDetalles] = useState<Promocion | null>(null)

  useEffect(() => {
    cargarPromociones()
  }, [])

  const cargarPromociones = async (): Promise<void> => {
    try {
      setCargando(true)
      const data = await obtenerPromociones()
      setPromociones(data)
    } catch (error) {
      console.error("Error al cargar promociones:", error)
      alert("Error al cargar las promociones")
    } finally {
      setCargando(false)
    }
  }

  const manejarCambiarEstado = async (id: number): Promise<void> => {
    try {
      await cambiarEstadoPromocion(id)
      await cargarPromociones()
    } catch (error) {
      console.error("Error al cambiar estado:", error)
      alert("Error al cambiar el estado de la promoción")
    }
  }

  const abrirModalNueva = (): void => {
    setPromocionParaEditar(null)
    setModalGestionAbierto(true)
  }

  const abrirModalEditar = (promocion: Promocion): void => {
    setPromocionParaEditar(promocion)
    setModalGestionAbierto(true)
  }

  const abrirModalDetalles = (promocion: Promocion): void => {
    setPromocionDetalles(promocion)
    setModalDetallesAbierto(true)
  }

  const cerrarModales = (): void => {
    setModalGestionAbierto(false)
    setModalDetallesAbierto(false)
    setPromocionParaEditar(null)
    setPromocionDetalles(null)
  }

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Gift className="text-blue-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Promociones</h1>
            <p className="text-gray-600">Gestiona las promociones del negocio</p>
          </div>
        </div>
        <button
          onClick={abrirModalNueva}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Nueva Promoción
        </button>
      </div>

      {/* Tabla de promociones */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {cargando ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Cargando promociones...</p>
          </div>
        ) : promociones.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No hay promociones registradas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promociones.map((promocion) => (
                  <tr key={promocion.idPromocion} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{promocion.idPromocion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {promocion.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{promocion.descripcion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(promocion.precio)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => { abrirModalDetalles(promocion) }}
                          className="text-black"
                          title="Ver detalles"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => { abrirModalEditar(promocion) }}
                          className="text-black"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => manejarCambiarEstado(promocion.idPromocion)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${promocion.estado
                            ? "bg-green-500 focus:ring-green-500"
                            : "bg-red-400 focus:ring-red-400"
                            }`}
                          title={promocion.estado ? "Desactivar" : "Activar"}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${promocion.estado ? "translate-x-6" : "translate-x-1"
                              }`}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ModalGestionarPromocion
        isOpen={modalGestionAbierto}
        onClose={cerrarModales}
        onSuccess={cargarPromociones}
        promocionParaEditar={promocionParaEditar}
      />

      <ModalDetallesPromocion
        isOpen={modalDetallesAbierto}
        onClose={cerrarModales}
        promocion={promocionDetalles}
      />

    </div>
  )
}
